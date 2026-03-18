
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Search, Users, Crown, Star, UserCheck, Phone, Mail, Heart, ShieldAlert, Calendar, BadgeDollarSign } from 'lucide-react';
import type { Customer, MembershipStatus } from '@/types/clinic';
import brandAmbassador from '@/assets/brand-ambassador.png';

// ── Mock data ──
const mockCustomers: Customer[] = [
  { id: '1', customer_code: 'C-0001', full_name: 'สมศรี จันทร์เพ็ญ', date_of_birth: '1990-05-12', age: 35, gender: 'Female', phone: '081-234-5678', line_id: 'somsri_j', email: 'somsri@email.com', first_visit_date: '2023-01-15', total_visits: 12, favorite_services: 'Botox, Filler', total_purchase: 85000, membership_status: 'gold', allergies: null, notes: 'ลูกค้าประจำ', is_active: true, created_at: '2023-01-15', updated_at: '2024-12-01' },
  { id: '2', customer_code: 'C-0002', full_name: 'วิชัย สุขสันต์', date_of_birth: '1985-08-20', age: 40, gender: 'Male', phone: '089-876-5432', line_id: 'wichai_s', email: 'wichai@email.com', first_visit_date: '2022-06-10', total_visits: 28, favorite_services: 'Laser, Vitamin Drip', total_purchase: 220000, membership_status: 'diamond', allergies: 'Lidocaine', notes: null, is_active: true, created_at: '2022-06-10', updated_at: '2024-11-20' },
  { id: '3', customer_code: 'C-0003', full_name: 'พิมพ์ใจ รักสวย', date_of_birth: '1995-03-08', age: 30, gender: 'Female', phone: '062-111-2233', line_id: null, email: 'pimjai@email.com', first_visit_date: '2024-03-01', total_visits: 3, favorite_services: 'Facial', total_purchase: 12000, membership_status: 'new', allergies: null, notes: 'สนใจ Thread Lift', is_active: true, created_at: '2024-03-01', updated_at: '2024-10-15' },
  { id: '4', customer_code: 'C-0004', full_name: 'อรทัย ใจดี', date_of_birth: '1988-11-25', age: 37, gender: 'Female', phone: '091-555-6677', line_id: 'orathai_j', email: null, first_visit_date: '2023-07-20', total_visits: 8, favorite_services: 'Botox, Skin Tightening', total_purchase: 54000, membership_status: 'silver', allergies: 'Aspirin', notes: null, is_active: true, created_at: '2023-07-20', updated_at: '2024-09-30' },
  { id: '5', customer_code: 'C-0005', full_name: 'ธนพล มั่งมี', date_of_birth: '1992-01-14', age: 33, gender: 'Male', phone: '085-999-0011', line_id: 'thanapol_m', email: 'thanapol@email.com', first_visit_date: '2024-08-05', total_visits: 2, favorite_services: 'Hair', total_purchase: 8500, membership_status: 'new', allergies: null, notes: null, is_active: false, created_at: '2024-08-05', updated_at: '2024-08-10' },
  { id: '6', customer_code: 'C-0006', full_name: 'นภัสสร แสงทอง', date_of_birth: '1993-07-30', age: 32, gender: 'Female', phone: '063-444-5566', line_id: 'napatsorn', email: 'napatsorn@email.com', first_visit_date: '2023-04-12', total_visits: 15, favorite_services: 'Filler, Laser, Facial', total_purchase: 120000, membership_status: 'gold', allergies: null, notes: 'แนะนำเพื่อนมาแล้ว 3 คน', is_active: true, created_at: '2023-04-12', updated_at: '2024-12-05' },
];

// ── Membership badge styling ──
const membershipStyles: Record<MembershipStatus, string> = {
  new: 'bg-[#4d62a7]/15 text-[#3a4d8a] border-[#4d62a7]/20',
  silver: 'bg-[#dfe6ef] text-[#4d62a7] border-[#4d62a7]/20',
  gold: 'bg-[#f7991a]/15 text-[#c47a14] border-[#f7991a]/25',
  diamond: 'bg-[#bf415c]/15 text-[#a03550] border-[#bf415c]/20',
};
const membershipIcon: Record<MembershipStatus, React.ElementType> = {
  new: UserCheck,
  silver: Star,
  gold: Crown,
  diamond: Crown,
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

// ── Customer Card ──
const CustomerCard = ({ customer }: { customer: Customer }) => {
  const color = getAvatarColor(customer.customer_code);
  const initial = customer.full_name.charAt(0);
  const MemberIcon = membershipIcon[customer.membership_status];

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-md"
          style={{ background: color }}
        >
          {initial}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-foreground font-bold text-sm truncate">{customer.full_name}</h3>
            <span className={cn('text-[10px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 flex-shrink-0', membershipStyles[customer.membership_status])}>
              <MemberIcon size={11} />
              {customer.membership_status.charAt(0).toUpperCase() + customer.membership_status.slice(1)}
            </span>
          </div>

          <p className="text-muted-foreground text-[11px] font-mono mb-3">{customer.customer_code}</p>

          {/* Contact info */}
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-3">
            {customer.phone && (
              <span className="flex items-center gap-1.5"><Phone size={12} className="text-accent" /> {customer.phone}</span>
            )}
            {customer.email && (
              <span className="flex items-center gap-1.5 truncate"><Mail size={12} className="text-accent" /> {customer.email}</span>
            )}
            {customer.favorite_services && (
              <span className="flex items-center gap-1.5"><Heart size={12} className="text-nerd-pink" /> {customer.favorite_services}</span>
            )}
          </div>

          <div className="h-px bg-border mb-3" />

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar size={12} className="text-accent" /> {customer.total_visits} visits
            </span>
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <BadgeDollarSign size={13} /> {customer.total_purchase.toLocaleString()} ฿
            </span>
          </div>

          {/* Allergy warning */}
          {customer.allergies && (
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-nerd-pink font-medium bg-[#bf415c]/8 rounded-lg px-2.5 py-1.5 border border-[#bf415c]/15">
              <ShieldAlert size={12} /> แพ้: {customer.allergies}
            </div>
          )}

          {/* Inactive badge */}
          {!customer.is_active && (
            <div className="mt-2 inline-flex items-center text-[10px] font-semibold text-muted-foreground bg-muted rounded-full px-2.5 py-1 border border-border">
              Inactive
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Hero ──
const HeroSection = ({ customerCount, activeCount, diamondCount }: { customerCount: number; activeCount: number; diamondCount: number }) => (
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
    <div className="absolute bottom-[-30px] left-[-20px] w-56 h-56 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(191,65,92,0.12)' }} />

    <div className="relative z-10 flex items-end justify-between gap-6 px-8 pt-10" style={{ minHeight: 260 }}>
      <div className="flex-1 max-w-xl pb-10">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border animate-fade-in"
          style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.85)' }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: '#f7991a' }} />
          Customer Management
        </div>

        <h1
          className="font-black text-3xl md:text-4xl leading-tight mb-4 text-white animate-fade-in font-display"
          style={{ animationDelay: '80ms' }}
        >
          ลูกค้า<br />
          <span style={{ color: '#6b82c4' }}>Customers</span>
        </h1>

        <p className="text-sm leading-relaxed mb-7 max-w-md animate-fade-in" style={{ color: 'rgba(255,255,255,0.55)', animationDelay: '160ms' }}>
          จัดการข้อมูลลูกค้า สถานะสมาชิก และประวัติการใช้บริการ
        </p>

        <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '240ms' }}>
          <StatPill icon={Users} label="ลูกค้าทั้งหมด" value={`${customerCount} คน`} />
          <StatPill icon={UserCheck} label="Active" value={`${activeCount} คน`} />
          <StatPill icon={Crown} label="Diamond" value={`${diamondCount} คน`} />
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
const Customers = () => {
  const [search, setSearch] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('All');

  const customers = mockCustomers;

  const filtered = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = !search ||
        c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        c.customer_code.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search));
      const matchesMembership = membershipFilter === 'All' || c.membership_status === membershipFilter.toLowerCase();
      return matchesSearch && matchesMembership;
    });
  }, [customers, search, membershipFilter]);

  const activeCount = customers.filter(c => c.is_active).length;
  const diamondCount = customers.filter(c => c.membership_status === 'diamond').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        <HeroSection
          customerCount={customers.length}
          activeCount={activeCount}
          diamondCount={diamondCount}
        />

        <SearchInput value={search} onChange={setSearch} placeholder="ค้นหาลูกค้า ชื่อ, รหัส, เบอร์โทร..." />
        <FilterPills
          categories={['All', 'New', 'Silver', 'Gold', 'Diamond']}
          active={membershipFilter}
          onChange={setMembershipFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(customer => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">ไม่พบลูกค้าที่ตรงกับการค้นหา</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Customers;
