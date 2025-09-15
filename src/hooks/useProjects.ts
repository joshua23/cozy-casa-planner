import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Project = Tables<'projects'>;
export type ProjectInsert = TablesInsert<'projects'>;
export type ProjectUpdate = TablesUpdate<'projects'>;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: ProjectInsert) => {
    try {
      // 获取当前用户ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('用户未登录');
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          user_id: user.id, // 确保设置user_id
        })
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create project');
    }
  };

  const updateProject = async (id: string, updates: ProjectUpdate) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update project');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete project');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}