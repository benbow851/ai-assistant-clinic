export type MembershipStatus = 'new' | 'silver' | 'gold' | 'diamond'

export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed'

export type BookedVia = 'staff' | 'chatbot' | 'phone'

export type Customer = {
  id: string
  customer_code: string
  full_name: string
  date_of_birth: string | null
  age: number | null
  gender: string | null
  phone: string | null
  line_id: string | null
  email: string | null
  first_visit_date: string | null
  total_visits: number
  favorite_services: string | null
  total_purchase: number
  membership_status: MembershipStatus
  allergies: string | null
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Appointment = {
  id: string
  appointment_code: string
  booking_date: string | null
  customer_name: string
  customer_phone: string | null
  line_id: string | null
  service_name: string | null
  staff_name: string | null
  appointment_date: string | null
  appointment_time: string | null
  status: AppointmentStatus
  notes: string | null
  price_estimate: number
  booked_via: BookedVia
  created_at: string
  updated_at: string
}
