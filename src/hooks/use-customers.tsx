import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Customer, MembershipStatus } from '@/types/clinic';

const membershipStatuses: MembershipStatus[] = ['new', 'silver', 'gold', 'diamond'];

type CustomerRow = Partial<Omit<Customer, 'membership_status'>> & { membership_status?: string | null };

const normalizeCustomer = (customer: CustomerRow): Customer => ({
  id: customer.id ?? crypto.randomUUID(),
  customer_code: customer.customer_code ?? '-',
  full_name: customer.full_name ?? 'ไม่ระบุชื่อ',
  date_of_birth: customer.date_of_birth ?? null,
  age: customer.age ?? null,
  gender: customer.gender ?? null,
  phone: customer.phone ?? null,
  line_id: customer.line_id ?? null,
  email: customer.email ?? null,
  first_visit_date: customer.first_visit_date ?? null,
  total_visits: customer.total_visits ?? 0,
  favorite_services: customer.favorite_services ?? null,
  total_purchase: customer.total_purchase ?? 0,
  membership_status: membershipStatuses.includes(customer.membership_status as MembershipStatus)
    ? customer.membership_status as MembershipStatus
    : 'new',
  allergies: customer.allergies ?? null,
  notes: customer.notes ?? null,
  is_active: customer.is_active ?? true,
  created_at: customer.created_at ?? '',
  updated_at: customer.updated_at ?? '',
});

export function useCustomers() {
  const queryClient = useQueryClient();

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['clinic_customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinic_customers')
        .select('*')
        .order('full_name') as { data: CustomerRow[] | null; error: Error | null };
      if (error) throw error;
      return (data ?? []).map(normalizeCustomer);
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
