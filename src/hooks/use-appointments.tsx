import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Appointment } from '@/types/clinic';

export function useAppointments() {
  const queryClient = useQueryClient();

  const { data: appointments, isLoading, error } = useQuery({
    queryKey: ['clinic_appointments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinic_appointments')
        .select('*')
        .order('appointment_date', { ascending: false })
        .order('appointment_time', { ascending: false }) as { data: Appointment[] | null; error: any };
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    const channel = supabase
      .channel('clinic_appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clinic_appointments' }, () => {
        queryClient.invalidateQueries({ queryKey: ['clinic_appointments'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { appointments: appointments ?? [], isLoading, error };
}
