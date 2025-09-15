import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Team = Tables<'construction_teams'>;
export type TeamInsert = TablesInsert<'construction_teams'>;
export type TeamUpdate = TablesUpdate<'construction_teams'>;

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('construction_teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData: TeamInsert) => {
    try {
      const { data, error } = await supabase
        .from('construction_teams')
        .insert(teamData)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No data returned from database insert');

      setTeams(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create team');
    }
  };

  const updateTeam = async (id: string, updates: TeamUpdate) => {
    try {
      const { data, error } = await supabase
        .from('construction_teams')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTeams(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update team');
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const { error } = await supabase
        .from('construction_teams')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTeams(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete team');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    loading,
    error,
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
  };
}