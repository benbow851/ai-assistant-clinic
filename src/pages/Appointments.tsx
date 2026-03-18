
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';
import { useAppointments } from '@/hooks/use-appointments';
import { useUpdateAppointmentStatus } from '@/hooks/use-appointment-mutations';
import AddAppointmentDialog from '@/components/appointments/AddAppointmentDialog';
import LoadingState from '@/components/LoadingState';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Search, CalendarDays, CheckCircle2, AlertCircle, XCircle, Plus,
  MoreHorizontal, Phone, MessageSquare, Clock, ChevronDown, ChevronUp,
  BadgeDollarSign, Bot, UserCheck as UserCheckIcon, PhoneCall, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Appointment, AppointmentStatus } from '@/types/clinic';
import nerdLogo from '@/assets/nerdoptimize-logo.png';

// ── Status badge config ──
const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  confirmed: { label: '✅ ยืนยัน', className: 'bg-green-500/20 text-green-300 border-green-500/30' },
  pending: { label: '⏳ รอยืนยัน', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  cancelled: { label: '❌ ยกเลิก', className: 'bg-red-500/20 text-red-300 border-red-500/30' },
  completed: { label: '✔️ เสร็จสิ้น', className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
};

// ── Booked via config ──
const bookedViaLabel: Record<string, string> = { chatbot: '🤖 Chatbot', staff: '👩‍⚕️ Staff', phone: '📞 Phone' };

// ── Thai date formatter ──
const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const formatThaiDate = (dateStr: string | null) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`;
};

// ── Date range helpers ──
const isToday = (dateStr: string | null) => {
  if (!dateStr) return false;
  return dateStr === new Date().toISOString().slice(0, 10);
};
const isThisWeek = (dateStr: string | null) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return d >= startOfWeek && d < endOfWeek;
};
const isThisMonth = (dateStr: string | null) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

// ── Stat Pill ──
const StatPill = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/15">
    <Icon size={15} className="text-nerd-orange flex-shrink-0" />
    <div>
      <p className="text-white/60 text-[10px] font-medium uppercase tracking-wide leading-none mb-0.5 font-poppins">{label}</p>
      <p className="text-white text-sm font-bold leading-none font-poppins">{value}</p>
    </div>
  </div>
);

// ── Mobile Appointment Card ──
const AppointmentMobileCard = ({
  apt, onStatusChange, expanded, onToggle,
}: {
  apt: Appointment; onStatusChange: (id: string, s: AppointmentStatus) => void; expanded: boolean; onToggle: () => void;
}) => {
  const sc = statusConfig[apt.status];
  return (
    <div className={cn("bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 transition-all", apt.status === 'cancelled' && 'opacity-60')}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-white font-bold text-sm font-poppins">{apt.customer_name}</p>
          {apt.customer_phone && <p className="text-white/40 text-[11px] font-poppins">{apt.customer_phone}</p>}
        </div>
        <span className={cn('text-[10px] font-semibold px-2.5 py-0.5 rounded-full border flex-shrink-0', sc.className)}>{sc.label}</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50 mb-2 font-poppins">
        <span className="flex items-center gap-1"><CalendarDays size={12} /> {formatThaiDate(apt.appointment_date)}</span>
        <span className="flex items-center gap-1"><Clock size={12} /> {apt.appointment_time || '-'}</span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/50 mb-3 font-poppins">
        {apt.service_name && <span>{apt.service_name}</span>}
        {apt.staff_name && <span className="text-nerd-blue">{apt.staff_name}</span>}
        <span className="text-emerald-400 font-bold">฿{apt.price_estimate.toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/10 text-xs gap-1">
              <MoreHorizontal size={14} /> จัดการ
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1a2233] border-white/10">
            <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => onStatusChange(apt.id, 'confirmed')}>✅ ยืนยันนัด</DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => onStatusChange(apt.id, 'completed')}>✔️ เสร็จสิ้น</DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => onStatusChange(apt.id, 'cancelled')}>❌ ยกเลิก</DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => onStatusChange(apt.id, 'pending')}>⏳ รอยืนยัน</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" className="text-white/30 hover:text-white hover:bg-white/10 ml-auto" onClick={onToggle}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </Button>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-1.5 text-[11px] text-white/40 font-poppins">
          <span>📋 {apt.appointment_code}</span>
          <span>📅 จองเมื่อ: {formatThaiDate(apt.booking_date)}</span>
          <span>📡 ช่องทาง: {bookedViaLabel[apt.booked_via] || apt.booked_via}</span>
          {apt.line_id && <span>💬 LINE: {apt.line_id}</span>}
          {apt.notes && <span className="text-amber-400/70">⚠️ {apt.notes}</span>}
        </div>
      )}
    </div>
  );
};

// ── Main Page ──
const Appointments = () => {
  const { appointments, isLoading, error } = useAppointments();
  const updateStatus = useUpdateAppointmentStatus();
  const isMobile = useIsMobile();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [staffFilter, setStaffFilter] = useState('All');
  const [dateRange, setDateRange] = useState('ทั้งหมด');
  const [addOpen, setAddOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Unique staff names
  const staffNames = useMemo(() => {
    const names = new Set<string>();
    appointments.forEach(a => { if (a.staff_name) names.add(a.staff_name); });
    return Array.from(names).sort();
  }, [appointments]);

  // Filtered
  const filtered = useMemo(() => {
    return appointments.filter(a => {
      const q = search.toLowerCase();
      const matchesSearch = !search ||
        a.customer_name.toLowerCase().includes(q) ||
        (a.service_name && a.service_name.toLowerCase().includes(q)) ||
        (a.staff_name && a.staff_name.toLowerCase().includes(q));
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchesStaff = staffFilter === 'All' || a.staff_name === staffFilter;
      const matchesDate =
        dateRange === 'ทั้งหมด' ? true :
        dateRange === 'Today' ? isToday(a.appointment_date) :
        dateRange === 'สัปดาห์นี้' ? isThisWeek(a.appointment_date) :
        dateRange === 'เดือนนี้' ? isThisMonth(a.appointment_date) : true;
      return matchesSearch && matchesStatus && matchesStaff && matchesDate;
    });
  }, [appointments, search, statusFilter, staffFilter, dateRange]);

  // Stats
  const todayCount = appointments.filter(a => isToday(a.appointment_date)).length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const cancelledCount = appointments.filter(a => a.status === 'cancelled').length;

  const handleStatusChange = (id: string, status: AppointmentStatus) => {
    updateStatus.mutate({ id, status });
  };

  if (isLoading && !error) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f1923 0%, #162033 100%)' }}>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-nerd-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50 text-sm font-poppins">กำลังโหลดนัดหมาย...</p>
          </div>
        </div>
      </div>
    );
  }

  // Filter categories
  const statusCategories = [
    { key: 'All', label: 'All' },
    { key: 'confirmed', label: '✅ ยืนยัน' },
    { key: 'pending', label: '⏳ รอยืนยัน' },
    { key: 'cancelled', label: '❌ ยกเลิก' },
    { key: 'completed', label: '✔️ เสร็จสิ้น' },
  ];

  const dateCategories = ['Today', 'สัปดาห์นี้', 'เดือนนี้', 'ทั้งหมด'];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f1923 0%, #162033 100%)' }}>
      <Header />
      <main className="max-w-6xl mx-auto px-4 pt-8 pb-16">
        {/* Live indicator */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            🟢 Live
          </div>
        </div>

        {/* Mobile add button */}
        <div className="md:hidden flex justify-end mb-4">
          <Button onClick={() => setAddOpen(true)} className="bg-nerd-blue hover:bg-nerd-blue/80 text-white font-poppins font-semibold gap-2">
            <Plus size={16} /> จองนัดใหม่
          </Button>
        </div>

        {/* ── Hero ── */}
        <div
          className="relative overflow-hidden rounded-3xl mb-10"
          style={{ background: 'linear-gradient(135deg, #111921 0%, #1e2d50 55%, #151d28 100%)' }}
        >
          <div className="absolute inset-0" style={{ opacity: 0.04, backgroundImage: `repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)` }} />
          <div className="absolute top-[-40px] right-[28%] w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(77,98,167,0.18)' }} />
          <div className="absolute bottom-[-30px] left-[-20px] w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(247,153,26,0.10)' }} />

          <div className="relative z-10 flex items-end justify-between gap-6 px-8 pt-10" style={{ minHeight: 260 }}>
            <div className="flex-1 max-w-xl pb-10">
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border animate-fade-in" style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.85)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: '#f7991a' }} />
                Appointment Management
              </div>

              <h1 className="font-retro text-lg md:text-xl leading-relaxed mb-4 text-white animate-fade-in" style={{ animationDelay: '80ms' }}>
                Appointments
              </h1>

              <p className="text-sm leading-relaxed mb-7 max-w-md animate-fade-in font-poppins" style={{ color: 'rgba(255,255,255,0.55)', animationDelay: '160ms' }}>
                ตารางนัดหมายและการจัดการนัด
              </p>

              <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '240ms' }}>
                <StatPill icon={CalendarDays} label="นัดวันนี้" value={`${todayCount}`} />
                <StatPill icon={CheckCircle2} label="ยืนยันแล้ว" value={`${confirmedCount}`} />
                <StatPill icon={AlertCircle} label="รอยืนยัน" value={`${pendingCount}`} />
                <StatPill icon={XCircle} label="ยกเลิก" value={`${cancelledCount}`} />
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end gap-4 self-end pb-10">
              <Button onClick={() => setAddOpen(true)} className="bg-nerd-blue hover:bg-nerd-blue/80 text-white font-poppins font-semibold gap-2 shadow-lg">
                <Plus size={16} /> จองนัดใหม่
              </Button>
              <img src={brandAmbassador} alt="NerdOptimize Brand Ambassador" className="w-auto object-contain select-none animate-fade-in" style={{ height: 180, filter: 'drop-shadow(0 -6px 28px rgba(77,98,167,0.35))', animationDelay: '100ms' }} />
            </div>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative w-full mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ บริการ..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm outline-none focus:border-nerd-blue/50 focus:ring-2 focus:ring-nerd-blue/10 transition-all font-poppins backdrop-blur-sm"
          />
        </div>

        {/* ── Status filter pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
          {statusCategories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setStatusFilter(cat.key)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border font-poppins",
                statusFilter === cat.key
                  ? 'bg-nerd-blue text-white border-nerd-blue shadow-md shadow-nerd-blue/20'
                  : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white/70'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Staff filter pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
          <button
            onClick={() => setStaffFilter('All')}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border font-poppins",
              staffFilter === 'All'
                ? 'bg-nerd-pink text-white border-nerd-pink shadow-sm'
                : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'
            )}
          >
            All Staff
          </button>
          {staffNames.map(name => (
            <button
              key={name}
              onClick={() => setStaffFilter(name)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border font-poppins",
                staffFilter === name
                  ? 'bg-nerd-pink text-white border-nerd-pink shadow-sm'
                  : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'
              )}
            >
              {name}
            </button>
          ))}
        </div>

        {/* ── Date range pills ── */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {dateCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setDateRange(cat)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border font-poppins",
                dateRange === cat
                  ? 'bg-nerd-orange text-white border-nerd-orange shadow-sm'
                  : 'bg-white/5 text-white/40 border-white/10 hover:text-white/60'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Desktop Table ── */}
        {!isMobile ? (
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02] backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/50 font-poppins text-xs">วันนัด</TableHead>
                  <TableHead className="text-white/50 font-poppins text-xs">เวลา</TableHead>
                  <TableHead className="text-white/50 font-poppins text-xs">ลูกค้า</TableHead>
                  <TableHead className="text-white/50 font-poppins text-xs">บริการ</TableHead>
                  <TableHead className="text-white/50 font-poppins text-xs">แพทย์</TableHead>
                  <TableHead className="text-white/50 font-poppins text-xs text-right">ราคา</TableHead>
                  <TableHead className="text-white/50 font-poppins text-xs">สถานะ</TableHead>
                  <TableHead className="text-white/50 font-poppins text-xs w-[80px]">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(apt => {
                  const sc = statusConfig[apt.status];
                  const isExpanded = expandedId === apt.id;
                  return (
                    <React.Fragment key={apt.id}>
                      <TableRow
                        className={cn(
                          "border-white/5 cursor-pointer transition-all hover:bg-white/[0.04]",
                          apt.status === 'cancelled' && 'opacity-60'
                        )}
                        onClick={() => setExpandedId(isExpanded ? null : apt.id)}
                      >
                        <TableCell className="text-white/70 text-xs font-poppins">{formatThaiDate(apt.appointment_date)}</TableCell>
                        <TableCell className="text-white/70 text-xs font-poppins">{apt.appointment_time || '-'}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-white text-xs font-semibold font-poppins">{apt.customer_name}</p>
                            {apt.customer_phone && <p className="text-white/30 text-[10px] font-poppins">{apt.customer_phone}</p>}
                          </div>
                        </TableCell>
                        <TableCell className="text-white/60 text-xs font-poppins">{apt.service_name || '-'}</TableCell>
                        <TableCell>
                          {apt.staff_name && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-nerd-blue/20 text-nerd-blue border border-nerd-blue/20 font-poppins">
                              {apt.staff_name}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-emerald-400 text-xs font-bold font-poppins">฿{apt.price_estimate.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={cn('text-[10px] font-semibold px-2.5 py-0.5 rounded-full border', sc.className)}>{sc.label}</span>
                        </TableCell>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-white/30 hover:text-white hover:bg-white/10 h-7 w-7">
                                <MoreHorizontal size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#1a2233] border-white/10">
                              <DropdownMenuItem className="text-white hover:bg-white/10 text-xs" onClick={() => handleStatusChange(apt.id, 'confirmed')}>✅ ยืนยันนัด</DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10 text-xs" onClick={() => handleStatusChange(apt.id, 'completed')}>✔️ เสร็จสิ้น</DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10 text-xs" onClick={() => handleStatusChange(apt.id, 'cancelled')}>❌ ยกเลิก</DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10 text-xs" onClick={() => handleStatusChange(apt.id, 'pending')}>⏳ รอยืนยัน</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                      {/* Expandable detail row */}
                      {isExpanded && (
                        <TableRow className="border-white/5 bg-white/[0.02]">
                          <TableCell colSpan={8} className="py-3">
                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-white/40 font-poppins px-2">
                              <span>📋 {apt.appointment_code}</span>
                              <span>📅 จองเมื่อ: {formatThaiDate(apt.booking_date)}</span>
                              <span>📡 ช่องทาง: {bookedViaLabel[apt.booked_via] || apt.booked_via}</span>
                              {apt.line_id && <span>💬 LINE: {apt.line_id}</span>}
                              {apt.notes && <span className="text-amber-400/70">⚠️ {apt.notes}</span>}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* ── Mobile Cards ── */
          <div className="flex flex-col gap-3">
            {filtered.map(apt => (
              <AppointmentMobileCard
                key={apt.id}
                apt={apt}
                onStatusChange={handleStatusChange}
                expanded={expandedId === apt.id}
                onToggle={() => setExpandedId(expandedId === apt.id ? null : apt.id)}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <CalendarDays size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-poppins">ไม่พบนัดหมายที่ตรงกับการค้นหา</p>
          </div>
        )}
      </main>

      <AddAppointmentDialog open={addOpen} onOpenChange={setAddOpen} staffNames={staffNames} />
    </div>
  );
};

export default Appointments;
