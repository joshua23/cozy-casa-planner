import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Worker = Tables<'workers'>;
export type WorkerInsert = TablesInsert<'workers'>;
export type WorkerUpdate = TablesUpdate<'workers'>;

export function useWorkers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      console.log('Fetching workers from database...');
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Workers fetch result:', { data, error });
      if (error) throw error;
      setWorkers(data || []);
      console.log('Workers loaded:', data?.length || 0);
    } catch (err) {
      console.error('Workers fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workers');
    } finally {
      setLoading(false);
    }
  };

  const createWorker = async (workerData: WorkerInsert) => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .insert(workerData)
        .select()
        .single();

      if (error) throw error;
      setWorkers(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create worker');
    }
  };

  const updateWorker = async (id: string, updates: WorkerUpdate) => {
    try {
      const { data, error } = await supabase
        .from('workers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setWorkers(prev => prev.map(w => w.id === id ? data : w));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update worker');
    }
  };

  const deleteWorker = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWorkers(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete worker');
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  return {
    workers,
    loading,
    error,
    fetchWorkers,
    createWorker,
    updateWorker,
    deleteWorker,
  };
}