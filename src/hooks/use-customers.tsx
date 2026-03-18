import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Customer } from '@/types/clinic';

export function useCustomers() {
  const queryClient = useQueryClient();

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['clinic_customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinic_customers')
        .select('*')
        .eq('is_active', true)
        .order('full_name') as { data: Customer[] | null; error: any };
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    const channel = supabase
      .channel('clinic_customers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clinic_customers' }, () => {
        queryClient.invalidateQueries({ queryKey: ['clinic_customers'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { customers: customers ?? [], isLoading, error };
}
