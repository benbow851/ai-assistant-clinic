
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';
import { Search, CalendarDays, Clock, User, Phone, MessageSquare, CheckCircle2, XCircle, AlertCircle, Bot, UserCheck, PhoneCall, BadgeDollarSign, ClipboardList } from 'lucide-react';
import type { Appointment, AppointmentStatus, BookedVia } from '@/types/clinic';
import brandAmbassador from '@/assets/brand-ambassador.png';

// ── Mock data ──
const mockAppointments: Appointment[] = [
  { id: '1', appointment_code: 'APT-0001', booking_date: '2024-12-01', customer_name: 'สมศรี จันทร์เพ็ญ', customer_phone: '081-234-5678', line_id: 'somsri_j', service_name: 'Botox Forehead', staff_name: 'พญ.นภัสสร', appointment_date: '2024-12-15', appointment_time: '10:00', status: 'confirmed', notes: null, price_estimate: 8500, booked_via: 'chatbot', created_at: '2024-12-01', updated_at: '2024-12-01' },
  { id: '2', appointment_code: 'APT-0002', booking_date: '2024-12-02', customer_name: 'วิชัย สุขสันต์', customer_phone: '089-876-5432', line_id: 'wichai_s', service_name: 'Laser Pigment', staff_name: 'นพ.ธนพล', appointment_date: '2024-12-16', appointment_time: '14:00', status: 'pending', notes: 'รอยืนยันจากลูกค้า', price_estimate: 15000, booked_via: 'staff', created_at: '2024-12-02', updated_at: '2024-12-02' },
  { id: '3', appointment_code: 'APT-0003', booking_date: '2024-12-03', customer_name: 'พิมพ์ใจ รักสวย', customer_phone: '062-111-2233', line_id: null, service_name: 'Facial Treatment', staff_name: 'คุณอรทัย', appointment_date: '2024-12-14', appointment_time: '11:30', status: 'completed', notes: null, price_estimate: 3500, booked_via: 'phone', created_at: '2024-12-03', updated_at: '2024-12-14' },
  { id: '4', appointment_code: 'APT-0004', booking_date: '2024-12-05', customer_name: 'อรทัย ใจดี', customer_phone: '091-555-6677', line_id: 'orathai_j', service_name: 'Thread Lift', staff_name: 'พญ.นภัสสร', appointment_date: '2024-12-20', appointment_time: '09:00', status: 'confirmed', notes: 'ลูกค้าต้องการดูแลพิเศษ', price_estimate: 35000, booked_via: 'chatbot', created_at: '2024-12-05', updated_at: '2024-12-05' },
  { id: '5', appointment_code: 'APT-0005', booking_date: '2024-12-06', customer_name: 'ธนพล มั่งมี', customer_phone: '085-999-0011', line_id: 'thanapol_m', service_name: 'Hair Treatment', staff_name: 'นพ.ธนพล', appointment_date: '2024-12-18', appointment_time: '15:30', status: 'cancelled', notes: 'ลูกค้ายกเลิกเนื่องจากติดธุระ', price_estimate: 5500, booked_via: 'phone', created_at: '2024-12-06', updated_at: '2024-12-07' },
  { id: '6', appointment_code: 'APT-0006', booking_date: '2024-12-08', customer_name: 'นภัสสร แสงทอง', customer_phone: '063-444-5566', line_id: 'napatsorn', service_name: 'Filler Chin', staff_name: 'พญ.นภัสสร', appointment_date: '2024-12-22', appointment_time: '13:00', status: 'pending', notes: null, price_estimate: 12000, booked_via: 'chatbot', created_at: '2024-12-08', updated_at: '2024-12-08' },
];

// ── Status badge styling ──
const statusStyles: Record<AppointmentStatus, { className: string; icon: React.ElementType; label: string }> = {
  confirmed: { className: 'bg-[#add099]/25 text-[#4a7a3a] border-[#add099]/30', icon: CheckCircle2, label: 'Confirmed' },
  pending: { className: 'bg-[#f7991a]/15 text-[#c47a14] border-[#f7991a]/25', icon: AlertCircle, label: 'Pending' },
  cancelled: { className: 'bg-[#bf415c]/15 text-[#a03550] border-[#bf415c]/20', icon: XCircle, label: 'Cancelled' },
  completed: { className: 'bg-[#4d62a7]/15 text-[#3a4d8a] border-[#4d62a7]/20', icon: CheckCircle2, label: 'Completed' },
};

// ── Booked via styling ──
const bookedViaConfig: Record<BookedVia, { icon: React.ElementType; label: string }> = {
  chatbot: { icon: Bot, label: 'Chatbot' },
  staff: { icon: UserCheck, label: 'Staff' },
  phone: { icon: PhoneCall, label: 'Phone' },
};

// ── Avatar colors from brand palette ──
const avatarColors = ['#4d62a7', '#bf415c', '#f7991a', '#add099', '#a14c46', '#1d252d'];
const getAvatarColor = (code: string) => {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

// ── Stat Pill ──
const StatPill = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/15">
    <Icon size={15} className="text-nerd-orange flex-shrink-0" />
    <div>
      <p className="text-white/60 text-[10px] font-medium uppercase tracking-wide leading-none mb-0.5">{label}</p>
      <p className="text-white text-sm font-bold leading-none">{value}</p>
    </div>
  </div>
);

// ── Search Input ──
const SearchInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
  <div className="relative w-full mb-5">
    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all shadow-sm"
    />
  </div>
);

// ── Filter Pills ──
const FilterPills = ({ categories, active, onChange }: { categories: string[]; active: string; onChange: (c: string) => void }) => (
  <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
    {categories.map(cat => (
      <button
        key={cat}
        onClick={() => onChange(cat)}
        className={cn(
          "flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border",
          active === cat
            ? 'bg-[#4d62a7] text-white border-[#4d62a7] shadow-md'
            : 'bg-card text-foreground border-border hover:border-[#4d62a7]/40 hover:shadow-sm'
        )}
      >
        {cat}
      </button>
    ))}
  </div>
);

// ── Appointment Card ──
const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const color = getAvatarColor(appointment.appointment_code);
  const initial = appointment.customer_name.charAt(0);
  const statusConfig = statusStyles[appointment.status];
  const StatusIcon = statusConfig.icon;
  const viaConfig = bookedViaConfig[appointment.booked_via];
  const ViaIcon = viaConfig.icon;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      {/* Top row: customer + status */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md"
          style={{ background: color }}
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-foreground font-bold text-sm truncate">{appointment.customer_name}</h3>
            <span className={cn('text-[10px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 flex-shrink-0', statusConfig.className)}>
              <StatusIcon size={11} />
              {statusConfig.label}
            </span>
          </div>
          <p className="text-muted-foreground text-[11px] font-mono">{appointment.appointment_code}</p>
        </div>
      </div>

      {/* Service & Staff */}
      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-3">
        {appointment.service_name && (
          <span className="flex items-center gap-1.5"><ClipboardList size={12} className="text-accent" /> {appointment.service_name}</span>
        )}
        {appointment.staff_name && (
          <span className="flex items-center gap-1.5"><User size={12} className="text-accent" /> {appointment.staff_name}</span>
        )}
      </div>

      <div className="h-px bg-border mb-3" />

      {/* Date, Time, Contact */}
      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-3">
        {appointment.appointment_date && (
          <span className="flex items-center gap-1.5">
            <CalendarDays size={12} className="text-nerd-blue" />
            {appointment.appointment_date}
            {appointment.appointment_time && <> · <Clock size={12} className="text-nerd-orange" /> {appointment.appointment_time}</>}
          </span>
        )}
        {appointment.customer_phone && (
          <span className="flex items-center gap-1.5"><Phone size={12} className="text-accent" /> {appointment.customer_phone}</span>
        )}
      </div>

      <div className="h-px bg-border mb-3" />

      {/* Bottom row: price + booked via */}
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-emerald-600 font-bold">
          <BadgeDollarSign size={13} /> {appointment.price_estimate.toLocaleString()} ฿
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <ViaIcon size={12} className="text-accent" /> {viaConfig.label}
        </span>
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div className="mt-3 flex items-start gap-1.5 text-[11px] text-muted-foreground bg-muted/50 rounded-lg px-2.5 py-2 border border-border">
          <MessageSquare size={12} className="flex-shrink-0 mt-0.5 text-accent" />
          <span>{appointment.notes}</span>
        </div>
      )}
    </div>
  );
};

// ── Hero ──
const HeroSection = ({ totalCount, confirmedCount, pendingCount }: { totalCount: number; confirmedCount: number; pendingCount: number }) => (
  <div
    className="relative rounded-3xl overflow-hidden mb-10"
    style={{ background: 'linear-gradient(135deg, #1d252d 0%, #2a3a5c 50%, #4d62a7 100%)' }}
  >
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'1\' cy=\'1\' r=\'0.7\' fill=\'white\'/%3E%3C/svg%3E")',
        backgroundSize: '12px 12px',
      }}
    />
    <div className="absolute top-[-40px] right-[28%] w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(77,98,167,0.18)' }} />
    <div className="absolute bottom-[-30px] left-[-20px] w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(247,153,26,0.10)' }} />

    <div className="relative z-10 flex items-end justify-between gap-6 px-8 pt-10" style={{ minHeight: 260 }}>
      <div className="flex-1 max-w-xl pb-10">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border animate-fade-in"
          style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.85)' }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: '#f7991a' }} />
          Appointment Management
        </div>

        <h1
          className="font-black text-3xl md:text-4xl leading-tight mb-4 text-white animate-fade-in font-display"
          style={{ animationDelay: '80ms' }}
        >
          นัดหมาย<br />
          <span style={{ color: '#6b82c4' }}>Appointments</span>
        </h1>

        <p className="text-sm leading-relaxed mb-7 max-w-md animate-fade-in" style={{ color: 'rgba(255,255,255,0.55)', animationDelay: '160ms' }}>
          จัดการตารางนัดหมาย ติดตามสถานะ และข้อมูลการจอง
        </p>

        <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '240ms' }}>
          <StatPill icon={CalendarDays} label="นัดหมายทั้งหมด" value={`${totalCount} รายการ`} />
          <StatPill icon={CheckCircle2} label="Confirmed" value={`${confirmedCount} รายการ`} />
          <StatPill icon={AlertCircle} label="Pending" value={`${pendingCount} รายการ`} />
        </div>
      </div>

      <div className="hidden md:block flex-shrink-0 self-end animate-fade-in" style={{ animationDelay: '100ms' }}>
        <img
          src={brandAmbassador}
          alt="NerdOptimize Brand Ambassador"
          className="w-auto object-contain select-none"
          style={{ height: 220, filter: 'drop-shadow(0 -6px 28px rgba(77,98,167,0.35))' }}
        />
      </div>
    </div>
  </div>
);

// ── Main Page ──
const Appointments = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const appointments = mockAppointments;

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      const matchesSearch = !search ||
        a.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        a.appointment_code.toLowerCase().includes(search.toLowerCase()) ||
        (a.service_name && a.service_name.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        <HeroSection
          totalCount={appointments.length}
          confirmedCount={confirmedCount}
          pendingCount={pendingCount}
        />

        <SearchInput value={search} onChange={setSearch} placeholder="ค้นหานัดหมาย ชื่อลูกค้า, รหัส, บริการ..." />
        <FilterPills
          categories={['All', 'Confirmed', 'Pending', 'Cancelled', 'Completed']}
          active={statusFilter}
          onChange={setStatusFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">ไม่พบนัดหมายที่ตรงกับการค้นหา</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Appointments;
