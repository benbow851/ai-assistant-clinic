
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// ── Types ──────────────────────────────────────────────

export type ClinicService = {
  id: string;
  service_code: string;
  category: string;
  name: string;
  description: string;
  price_min: string;
  price_max: string;
  duration_minutes: string;
  age_recommendation: string;
  expected_result: string;
  recommended_sessions: string;
  is_active: boolean;
  created_at: string;
};

export type ClinicFaq = {
  id: string;
  faq_code: string;
  category: string;
  question: string;
  answer: string;
  keywords: string;
  related_services: string;
  created_at: string;
};

export type ClinicStaff = {
  id: string;
  staff_code: string;
  full_name: string;
  position: string;
  specialties: string;
  working_days: string;
  working_hours: string;
  line_id: string;
  languages: string;
  experience_years: string;
  cases_per_day: string;
  is_active: boolean;
  created_at: string;
};

/**
 * Fetches active clinic services from the `clinic_services` table.
 * Results are ordered by category then service_code.
 */
export const useClinicServices = () => {
  return useQuery({
    queryKey: ['clinic_services'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('clinic_services')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('service_code');

      if (error) {
        console.error('Error fetching clinic services:', error);
        throw new Error(error.message);
      }
      return data as ClinicService[];
    },
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Fetches all FAQ entries from the `clinic_faq` table.
 * Results are ordered by faq_code.
 */
export const useClinicFaq = () => {
  return useQuery({
    queryKey: ['clinic_faq'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('clinic_faq')
        .select('*')
        .order('faq_code');

      if (error) {
        console.error('Error fetching clinic FAQ:', error);
        throw new Error(error.message);
      }
      return data as ClinicFaq[];
    },
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Fetches active clinic staff from the `clinic_staff` table.
 * Results are ordered by staff_code.
 */
export const useClinicStaff = () => {
  return useQuery({
    queryKey: ['clinic_staff'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('clinic_staff')
        .select('*')
        .eq('is_active', true)
        .order('staff_code');

      if (error) {
        console.error('Error fetching clinic staff:', error);
        throw new Error(error.message);
      }
      return data as ClinicStaff[];
    },
    staleTime: 10 * 60 * 1000,
  });
};
