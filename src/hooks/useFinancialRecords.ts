import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useProjects } from './useProjects';
import { useCustomers } from './useCustomers';

export type FinancialRecord = Tables<'financial_records'>;
export type FinancialRecordInsert = TablesInsert<'financial_records'>;
export type FinancialRecordUpdate = TablesUpdate<'financial_records'>;

export interface DetailedFinancialRecord extends FinancialRecord {
  project_display_name?: string;
  project_client_name?: string;
  project_client_phone?: string;
  project_address?: string;
  customer_display_name?: string;
  customer_phone?: string;
  customer_email?: string;
  customer_status?: string;
}

export function useFinancialRecords() {
  const [records, setRecords] = useState<DetailedFinancialRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { projects } = useProjects();
  const { customers } = useCustomers();

  const fetchRecords = async () => {
    try {
      setLoading(true);
      
      // 使用详细视图获取包含关联信息的财务记录
      const { data, error } = await supabase
        .from('financial_records')
        .select(`
          *,
          projects:project_id (
            name,
            client_name,
            client_phone,
            project_address
          ),
          customers:customer_id (
            name,
            phone,
            email,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // 转换数据格式以包含关联信息
      const detailedRecords = (data || []).map(record => ({
        ...record,
        project_display_name: record.projects?.name || record.project_name,
        project_client_name: record.projects?.client_name || record.customer_name,
        project_client_phone: record.projects?.client_phone,
        project_address: record.projects?.project_address,
        customer_display_name: record.customers?.name || record.customer_name,
        customer_phone: record.customers?.phone,
        customer_email: record.customers?.email,
        customer_status: record.customers?.status
      }));
      
      setRecords(detailedRecords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial records');
    } finally {
      setLoading(false);
    }
  };

  const createRecord = async (recordData: FinancialRecordInsert & { 
    customer_id?: string; 
    customer_name?: string; 
    project_name?: string; 
  }) => {
    try {
      // 获取当前用户ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('用户未登录');
      }

      const { data, error } = await supabase
        .from('financial_records')
        .insert({
          ...recordData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      
      // 重新获取记录以包含关联信息
      await fetchRecords();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create financial record');
    }
  };

  const updateRecord = async (id: string, updates: FinancialRecordUpdate) => {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // 重新获取记录以包含关联信息
      await fetchRecords();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update financial record');
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete financial record');
    }
  };

  // 获取可用的项目和客户选项
  const getProjectOptions = () => {
    return projects.map(project => ({
      id: project.id,
      name: project.name,
      client: project.client_name,
      value: project.id,
      label: `${project.name} (${project.client_name})`
    }));
  };

  const getCustomerOptions = () => {
    return customers.map(customer => ({
      id: customer.id,
      name: customer.name,
      value: customer.id,
      label: customer.name
    }));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    error,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    getProjectOptions,
    getCustomerOptions,
    projects,
    customers,
  };
}