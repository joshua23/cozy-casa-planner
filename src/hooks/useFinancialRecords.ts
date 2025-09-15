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
      setError(null);
      
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Fetched financial records:', data);
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching financial records:', err);
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
          user_id: user.id,
          transaction_type: recordData.transaction_type,
          amount: recordData.amount,
          category: recordData.category,
          project_id: recordData.project_id,
          customer_id: recordData.customer_id,
          customer_name: recordData.customer_name,
          project_name: recordData.project_name,
          description: recordData.description,
          transaction_date: recordData.transaction_date,
          payment_method: recordData.payment_method,
          invoice_number: recordData.invoice_number,
          payment_status: recordData.payment_status || '已完成'
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchRecords();
      return data;
    } catch (err) {
      console.error('Error creating financial record:', err);
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