import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Appointment, AppointmentStatus, BookedVia } from '@/types/clinic';

const appointmentStatuses: AppointmentStatus[] = ['confirmed', 'pending', 'cancelled', 'completed'];
const bookedViaOptions: BookedVia[] = ['staff', 'chatbot', 'phone'];

const normalizeAppointment = (appointment: Partial<Appointment>): Appointment => ({
  id: appointment.id ?? crypto.randomUUID(),
  appointment_code: appointment.appointment_code ?? '-',
  booking_date: appointment.booking_date ?? null,
  customer_name: appointment.customer_name ?? 'ไม่ระบุชื่อลูกค้า',
  customer_phone: appointment.customer_phone ?? null,
  line_id: appointment.line_id ?? null,
  service_name: appointment.service_name ?? null,
  staff_name: appointment.staff_name ?? null,
  appointment_date: appointment.appointment_date ?? null,
  appointment_time: appointment.appointment_time ?? null,
  status: appointmentStatuses.includes(appointment.status as AppointmentStatus)
    ? appointment.status as AppointmentStatus
    : 'pending',
  notes: appointment.notes ?? null,
  price_estimate: appointment.price_estimate ?? 0,
  booked_via: bookedViaOptions.includes(appointment.booked_via as BookedVia)
    ? appointment.booked_via as BookedVia
    : 'staff',
  created_at: appointment.created_at ?? '',
  updated_at: appointment.updated_at ?? '',
});

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
      return (data ?? []).map(normalizeAppointment);
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
