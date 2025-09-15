import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Talent = Tables<'talents'>;
export type TalentInsert = TablesInsert<'talents'>;
export type TalentUpdate = TablesUpdate<'talents'>;

export function useTalents() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTalents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('talents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTalents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch talents');
    } finally {
      setLoading(false);
    }
  };

  const createTalent = async (talentData: TalentInsert) => {
    try {
      const { data, error } = await supabase
        .from('talents')
        .insert(talentData)
        .select()
        .single();

      if (error) throw error;
      setTalents(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create talent');
    }
  };

  const updateTalent = async (id: string, updates: TalentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('talents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTalents(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update talent');
    }
  };

  const deleteTalent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('talents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTalents(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete talent');
    }
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  return {
    talents,
    loading,
    error,
    fetchTalents,
    createTalent,
    updateTalent,
    deleteTalent,
  };
}