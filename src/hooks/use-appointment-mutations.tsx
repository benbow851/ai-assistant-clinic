import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Appointment, AppointmentStatus } from '@/types/clinic';

export function useAddAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('clinic_appointments').insert([data as any]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic_appointments'] });
      toast({ title: 'สำเร็จ', description: 'เพิ่มนัดหมายเรียบร้อยแล้ว' });
    },
    onError: (err: any) => {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    },
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      const { error } = await supabase.from('clinic_appointments').update({ status } as any).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinic_appointments'] });
      toast({ title: 'สำเร็จ', description: 'อัปเดตสถานะนัดหมายเรียบร้อยแล้ว' });
    },
    onError: (err: any) => {
      toast({ title: 'เกิดข้อผิดพลาด', description: err.message, variant: 'destructive' });
    },
  });
}
