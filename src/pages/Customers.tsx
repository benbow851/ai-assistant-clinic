
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';
import { useCustomers } from '@/hooks/use-customers';
import AddCustomerDialog from '@/components/customers/AddCustomerDialog';
import EditCustomerDialog from '@/components/customers/EditCustomerDialog';
import LoadingState from '@/components/LoadingState';
import {
  Search, Users, Crown, Star, UserCheck, Phone, Mail, Heart,
  ShieldAlert, BadgeDollarSign, Pencil, ArrowRight, Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Customer, MembershipStatus } from '@/types/clinic';
import brandAmbassador from '@/assets/brand-ambassador.png';
import { useNavigate } from 'react-router-dom';

// ── Membership avatar color ──
const membershipAvatarColor: Record<MembershipStatus, string> = {
  diamond: '#a855f7',
  gold: '#eab308',
  silver: '#9ca3af',
  new: '#3b82f6',
};

// ── Membership badges ──
const membershipBadge: Record<MembershipStatus, { label: string; className: string }> = {
  diamond: { label: '💎 Diamond', className: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  gold: { label: '🥇 Gold', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  silver: { label: '🥈 Silver', className: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
  new: { label: '🆕 New', className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
};

// ── Filter pill categories ──
const filterCategories = [
  { key: 'All', label: 'All' },
  { key: 'new', label: '🆕 New' },
  { key: 'silver', label: '🥈 Silver' },
  { key: 'gold', label: '🥇 Gold' },
  { key: 'diamond', label: '💎 Diamond' },
];

// ── Format currency ──
const formatPurchase = (n: number) => {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `฿${(n / 1_000).toFixed(0)}K`;
  return `฿${n.toLocaleString()}`;
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

// ── Customer Card ──
const CustomerCard = ({
  customer,
  onEdit,
}: {
  customer: Customer;
  onEdit: (c: Customer) => void;
}) => {
  const navigate = useNavigate();
  const badge = membershipBadge[customer.membership_status];
  const avatarBg = membershipAvatarColor[customer.membership_status];
  const initials = customer.full_name
    .split(' ')
    .map(w => w.charAt(0))
    .join('')
    .slice(0, 2);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center hover:bg-white/[0.08] hover:border-white/15 transition-all duration-300 group">
      {/* Avatar */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold mb-3 shadow-lg font-poppins"
        style={{ background: avatarBg }}
      >
        {initials}
      </div>

      {/* Name */}
      <h3 className="text-white font-bold text-sm mb-1.5 font-poppins">{customer.full_name}</h3>

      {/* Badge + code */}
      <div className="flex items-center gap-2 mb-3">
        <span className={cn('text-[10px] font-semibold px-2.5 py-0.5 rounded-full border', badge.className)}>
          {badge.label}
        </span>
        <span className="text-white/30 text-[10px] font-mono">{customer.customer_code}</span>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 w-full mb-3" />

      {/* Contact */}
      <div className="w-full flex flex-col gap-1.5 text-xs text-white/50 mb-3 font-poppins">
        {customer.phone && (
          <span className="flex items-center gap-1.5 justify-center">
            <Phone size={12} className="text-nerd-blue" /> {customer.phone}
          </span>
        )}
        {customer.line_id && (
          <span className="flex items-center gap-1.5 justify-center">
            💬 {customer.line_id}
          </span>
        )}
        {customer.email && (
          <span className="flex items-center gap-1.5 justify-center truncate max-w-full">
            <Mail size={12} className="text-nerd-blue" /> {customer.email}
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/10 w-full mb-3" />

      {/* Stats */}
      <div className="w-full flex flex-col gap-1.5 text-xs font-poppins mb-3">
        <span className="flex items-center gap-1.5 justify-center text-white/50">
          🏥 {customer.total_visits} ครั้ง
        </span>
        <span className="flex items-center gap-1.5 justify-center text-emerald-400 font-bold">
          <BadgeDollarSign size={13} /> {customer.total_purchase.toLocaleString()} ฿
        </span>
        {customer.allergies && customer.allergies !== '-' && (
          <span className="flex items-center gap-1.5 justify-center text-amber-400">
            <ShieldAlert size={12} /> {customer.allergies}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-white/50 hover:text-white hover:bg-white/10 text-xs gap-1 font-poppins"
          onClick={() => onEdit(customer)}
        >
          <Pencil size={12} /> แก้ไข
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-nerd-blue hover:text-white hover:bg-nerd-blue/20 text-xs gap-1 font-poppins"
          onClick={() => navigate('/appointments')}
        >
          ดูนัด <ArrowRight size={12} />
        </Button>
      </div>
    </div>
  );
};

// ── Hero Section ──
const HeroSection = ({
  customerCount, vipCount, newCount, totalPurchase, onAddClick,
}: {
  customerCount: number; vipCount: number; newCount: number; totalPurchase: number;
  onAddClick: () => void;
}) => (
  <div
    className="relative overflow-hidden rounded-3xl mb-10"
    style={{ background: 'linear-gradient(135deg, #111921 0%, #1e2d50 55%, #151d28 100%)' }}
  >
    <div
      className="absolute inset-0"
      style={{
        opacity: 0.04,
        backgroundImage: `repeating-linear-gradient(0deg, #fff 0, #fff 1px, transparent 1px, transparent 40px),
                          repeating-linear-gradient(90deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)`,
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

        <h1 className="font-retro text-lg md:text-xl leading-relaxed mb-4 text-white animate-fade-in" style={{ animationDelay: '80ms' }}>
          Customer Database
        </h1>

        <p className="text-sm leading-relaxed mb-7 max-w-md animate-fade-in font-poppins" style={{ color: 'rgba(255,255,255,0.55)', animationDelay: '160ms' }}>
          ข้อมูลลูกค้าและประวัติการใช้บริการ
        </p>

        <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '240ms' }}>
          <StatPill icon={Users} label="ลูกค้าทั้งหมด" value={`${customerCount}`} />
          <StatPill icon={Crown} label="VIP" value={`${vipCount}`} />
          <StatPill icon={UserCheck} label="ลูกค้าใหม่" value={`${newCount}`} />
          <StatPill icon={BadgeDollarSign} label="ยอดรวม" value={formatPurchase(totalPurchase)} />
        </div>
      </div>

      <div className="hidden md:flex flex-col items-end gap-4 self-end pb-10">
        <Button
          onClick={onAddClick}
          className="bg-nerd-blue hover:bg-nerd-blue/80 text-white font-poppins font-semibold gap-2 shadow-lg"
        >
          <Plus size={16} /> เพิ่มลูกค้า
        </Button>
        <img
          src={brandAmbassador}
          alt="NerdOptimize Brand Ambassador"
          className="w-auto object-contain select-none animate-fade-in"
          style={{ height: 180, filter: 'drop-shadow(0 -6px 28px rgba(77,98,167,0.35))', animationDelay: '100ms' }}
        />
      </div>
    </div>
  </div>
);

// ── Main Page ──
const Customers = () => {
  const { customers, isLoading, error } = useCustomers();
  const [search, setSearch] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('All');
  const [addOpen, setAddOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    return customers.filter(c => {
      const q = search.toLowerCase();
      const matchesSearch = !search ||
        c.full_name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.line_id && c.line_id.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q));
      const matchesMembership = membershipFilter === 'All' || c.membership_status === membershipFilter;
      return matchesSearch && matchesMembership;
    });
  }, [customers, search, membershipFilter]);

  const vipCount = customers.filter(c => c.membership_status === 'diamond' || c.membership_status === 'gold').length;
  const newCount = customers.filter(c => c.membership_status === 'new').length;
  const totalPurchase = customers.reduce((sum, c) => sum + c.total_purchase, 0);

  if (isLoading && !error) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f1923 0%, #162033 100%)' }}>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-nerd-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50 text-sm font-poppins">กำลังโหลดข้อมูลลูกค้า...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <Plus size={16} /> เพิ่มลูกค้า
          </Button>
        </div>

        <HeroSection
          customerCount={customers.length}
          vipCount={vipCount}
          newCount={newCount}
          totalPurchase={totalPurchase}
          onAddClick={() => setAddOpen(true)}
        />

        {/* Search */}
        <div className="relative w-full mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ เบอร์ LINE..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm outline-none focus:border-nerd-blue/50 focus:ring-2 focus:ring-nerd-blue/10 transition-all font-poppins backdrop-blur-sm"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {filterCategories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setMembershipFilter(cat.key)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border font-poppins",
                membershipFilter === cat.key
                  ? 'bg-nerd-blue text-white border-nerd-blue shadow-md shadow-nerd-blue/20'
                  : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white/70'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(customer => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={setEditCustomer}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30">
            <Users size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-poppins">ไม่พบลูกค้าที่ตรงกับการค้นหา</p>
          </div>
        )}
      </main>

      <AddCustomerDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditCustomerDialog open={!!editCustomer} onOpenChange={open => !open && setEditCustomer(null)} customer={editCustomer} />
    </div>
  );
};

export default Customers;
