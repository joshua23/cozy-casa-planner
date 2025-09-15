import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { secureJoinQuery, secureUpdate, secureDelete, getCurrentUser } from '@/utils/secureDataFetch';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectWithDetails {
  id: string;
  name: string;
  status: string;
  client_name: string;
  client_phone?: string;
  client_email?: string;
  total_contract_amount?: number;
  property_type?: string;
  decoration_style?: string;
  area?: number;
  start_date?: string;
  end_date?: string;
  project_address?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  project_phases: Array<{
    id: string;
    phase_name: string;
    status: string;
    progress: number;
    completion_percentage: number;
    start_date?: string;
    end_date?: string;
    phase_order: number;
  }>;
  payment_nodes: Array<{
    id: string;
    node_type: string;
    amount: number;
    paid_amount: number;
    status: string;
    due_date?: string;
    created_at: string;
  }>;
}

// 获取项目详细信息
const fetchProjectsWithDetails = async (): Promise<ProjectWithDetails[]> => {
  console.log('获取项目详细信息（包含阶段和付款节点）...');

  const data = await secureJoinQuery(
    'projects',
    `
      *,
      project_phases (
        id,
        phase_name,
        status,
        progress,
        completion_percentage,
        start_date,
        end_date,
        phase_order,
        created_at
      ),
      payment_nodes (
        id,
        node_type,
        amount,
        paid_amount,
        status,
        due_date,
        created_at
      )
    `,
    {},
    { orderBy: { column: 'created_at', ascending: false } }
  );

  // 对每个项目的阶段按照phase_order排序
  const processedData = data.map((project: any) => ({
    ...project,
    project_phases: (project.project_phases || []).sort((a: any, b: any) => a.phase_order - b.phase_order),
    payment_nodes: (project.payment_nodes || []).sort((a: any, b: any) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  }));

  console.log('处理后的项目数据:', processedData);
  return processedData;
};

// 刷新单个项目的数据
const fetchSingleProject = async (projectId: string): Promise<ProjectWithDetails | null> => {
  try {
    const user = await getCurrentUser();

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_phases (
          id,
          phase_name,
          status,
          progress,
          completion_percentage,
          start_date,
          end_date,
          phase_order,
          created_at
        ),
        payment_nodes (
          id,
          node_type,
          amount,
          paid_amount,
          status,
          due_date,
          created_at
        )
      `)
      .eq('id', projectId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    if (data) {
      return {
        ...data,
        project_phases: (data.project_phases || []).sort((a: any, b: any) => a.phase_order - b.phase_order),
        payment_nodes: (data.payment_nodes || []).sort((a: any, b: any) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      };
    }
    return null;
  } catch (err) {
    console.error('获取单个项目数据失败:', err);
    throw err;
  }
};

/**
 * 使用React Query的项目详细信息Hook
 * 提供缓存、自动更新和乐观更新功能
 */
export function useProjectsWithDetailsQuery() {
  const queryClient = useQueryClient();

  // 主查询：获取所有项目详细信息
  const query = useQuery({
    queryKey: ['projects-with-details'],
    queryFn: fetchProjectsWithDetails,
    staleTime: 2 * 60 * 1000, // 2分钟缓存（项目数据变化较快）
    gcTime: 5 * 60 * 1000,
  });

  // 刷新单个项目的mutation
  const refreshProjectMutation = useMutation({
    mutationFn: fetchSingleProject,
    onSuccess: (updatedProject, projectId) => {
      if (updatedProject) {
        // 更新缓存中的特定项目
        queryClient.setQueryData(['projects-with-details'], (oldData: ProjectWithDetails[] | undefined) => {
          if (!oldData) return [updatedProject];
          return oldData.map(project => project.id === projectId ? updatedProject : project);
        });
      }
    },
  });

  // 乐观更新项目状态
  const updateProjectStatusMutation = useMutation({
    mutationFn: async ({ projectId, status }: { projectId: string; status: string }) => {
      return secureUpdate('projects', projectId, { status });
    },
    onMutate: async ({ projectId, status }) => {
      // 取消正在进行的查询
      await queryClient.cancelQueries({ queryKey: ['projects-with-details'] });

      // 获取当前数据
      const previousProjects = queryClient.getQueryData<ProjectWithDetails[]>(['projects-with-details']);

      // 乐观更新
      if (previousProjects) {
        queryClient.setQueryData(['projects-with-details'],
          previousProjects.map(project =>
            project.id === projectId ? { ...project, status } : project
          )
        );
      }

      return { previousProjects };
    },
    onError: (err, variables, context) => {
      // 错误时回滚
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects-with-details'], context.previousProjects);
      }
    },
    onSettled: () => {
      // 最终同步数据
      queryClient.invalidateQueries({ queryKey: ['projects-with-details'] });
    },
  });

  return {
    projects: query.data || [],
    loading: query.isLoading,
    error: query.error?.message || null,
    refetch: query.refetch,
    refreshProject: (projectId: string) => refreshProjectMutation.mutate(projectId),
    updateProjectStatus: updateProjectStatusMutation.mutate,
    // 提供额外的状态信息
    isFetching: query.isFetching,
    isStale: query.isStale,
  };
}