
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import LoadingState from '@/components/LoadingState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useClinicServices, useClinicFaq, useClinicStaff, ClinicService, ClinicFaq, ClinicStaff } from '@/hooks/use-knowledge';
import { cn } from '@/lib/utils';
import { Search, Zap, HelpCircle, Users, Clock, User, Sparkles, RefreshCw, BadgeDollarSign, Target, Calendar, Globe, Star, ClipboardList } from 'lucide-react';
import nerdLogo from '@/assets/nerd-banner-logo.png';

// ── Category badge color map ──
const serviceCategoryColors: Record<string, string> = {
  Botox: 'bg-[#4d62a7]/25 text-[#8da0d6] border-[#4d62a7]/30',
  Filler: 'bg-[#bf415c]/25 text-[#e08a9d] border-[#bf415c]/30',
  Laser: 'bg-[#f7991a]/25 text-[#f7b960] border-[#f7991a]/30',
  'Skin Tightening': 'bg-[#4d62a7]/25 text-[#8da0d6] border-[#4d62a7]/30',
  'Vitamin Drip': 'bg-[#add099]/25 text-[#add099] border-[#add099]/30',
  Facial: 'bg-[#bf415c]/25 text-[#e08a9d] border-[#bf415c]/30',
  Hair: 'bg-[#f7991a]/25 text-[#f7b960] border-[#f7991a]/30',
  Body: 'bg-[#4d62a7]/25 text-[#8da0d6] border-[#4d62a7]/30',
  Package: 'bg-[#f7991a]/25 text-[#f7b960] border-[#f7991a]/30',
  'Acne & Scar': 'bg-[#bf415c]/25 text-[#e08a9d] border-[#bf415c]/30',
  'Thread Lift': 'bg-[#4d62a7]/25 text-[#8da0d6] border-[#4d62a7]/30',
  Consultation: 'bg-[#add099]/25 text-[#add099] border-[#add099]/30',
  'Check-up': 'bg-[#add099]/25 text-[#add099] border-[#add099]/30',
};
const getCategoryBadge = (cat: string) =>
  serviceCategoryColors[cat] || 'bg-white/10 text-white/50 border-white/10';

// ── Card backgrounds per category ──
const serviceCategoryCardBg: Record<string, string> = {
  Botox: 'bg-[#4d62a7]/[0.08] border-[#4d62a7]/20',
  Filler: 'bg-[#bf415c]/[0.08] border-[#bf415c]/20',
  Laser: 'bg-[#f7991a]/[0.08] border-[#f7991a]/20',
  'Skin Tightening': 'bg-[#4d62a7]/[0.06] border-[#4d62a7]/15',
  'Vitamin Drip': 'bg-[#add099]/[0.10] border-[#add099]/20',
  Facial: 'bg-[#bf415c]/[0.06] border-[#bf415c]/15',
  Hair: 'bg-[#f7991a]/[0.06] border-[#f7991a]/15',
  Body: 'bg-[#4d62a7]/[0.08] border-[#4d62a7]/20',
  Package: 'bg-[#f7991a]/[0.08] border-[#f7991a]/20',
  'Acne & Scar': 'bg-[#bf415c]/[0.08] border-[#bf415c]/20',
  'Thread Lift': 'bg-[#4d62a7]/[0.06] border-[#4d62a7]/15',
  Consultation: 'bg-[#add099]/[0.08] border-[#add099]/15',
  'Check-up': 'bg-[#add099]/[0.08] border-[#add099]/15',
};
const getCategoryCardBg = (cat: string) =>
  serviceCategoryCardBg[cat] || 'bg-white/5 border-white/10';

const faqCategoryColors: Record<string, string> = {
  'การจอง': 'bg-[#4d62a7]/25 text-[#8da0d6] border-[#4d62a7]/30',
  Botox: 'bg-[#4d62a7]/25 text-[#8da0d6] border-[#4d62a7]/30',
  Filler: 'bg-[#bf415c]/25 text-[#e08a9d] border-[#bf415c]/30',
  Laser: 'bg-[#f7991a]/25 text-[#f7b960] border-[#f7991a]/30',
  'ทั่วไป': 'bg-white/10 text-white/50 border-white/15',
  'ราคา': 'bg-[#add099]/25 text-[#add099] border-[#add099]/30',
};
const getFaqBadge = (cat: string) => faqCategoryColors[cat] || 'bg-white/10 text-white/50 border-white/15';

// ── Avatar colors from brand palette ──
const avatarColors = ['#4d62a7', '#bf415c', '#f7991a', '#add099', '#a14c46', '#1d252d'];
const getAvatarColor = (code: string) => {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

// ── Filter categories ──
const serviceCategories = [
  'All', 'Botox', 'Filler', 'Laser', 'Skin Tightening', 'Vitamin Drip',
  'Facial', 'Hair', 'Body', 'Acne & Scar', 'Thread Lift', 'Package', 'Consultation', 'Check-up',
];
const faqCategories = ['All', 'การจอง', 'Botox', 'Filler', 'Laser', 'ทั่วไป', 'ราคา'];

// ── Hero Stat Pill ──
const StatPill = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/15">
    <Icon size={15} className="text-nerd-orange flex-shrink-0" />
    <div>
      <p className="text-white/60 text-[10px] font-medium uppercase tracking-wide leading-none mb-0.5 font-poppins">{label}</p>
      <p className="text-white text-sm font-bold leading-none font-poppins">{value}</p>
    </div>
  </div>
);

// ── Search Input ──
const SearchInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
  <div className="relative w-full mb-5">
    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-sm outline-none focus:border-nerd-blue/50 focus:ring-2 focus:ring-nerd-blue/10 transition-all font-poppins backdrop-blur-sm"
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
          "flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border font-poppins",
          active === cat
            ? 'bg-nerd-blue text-white border-nerd-blue shadow-md shadow-nerd-blue/20'
            : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white/70'
        )}
      >
        {cat}
      </button>
    ))}
  </div>
);

// ── Service Card ──
const ServiceCard = ({ service }: { service: ClinicService }) => (
  <div className={cn("rounded-2xl border p-6 backdrop-blur-sm hover:bg-white/[0.08] hover:-translate-y-0.5 transition-all duration-300 flex flex-col", getCategoryCardBg(service.category))}>
    <div className="flex items-center justify-between gap-2 mb-3">
      <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full border', getCategoryBadge(service.category))}>
        {service.category}
      </span>
      <span className="text-white/30 text-[11px] font-mono">{service.service_code}</span>
    </div>

    <h3 className="text-white font-bold text-[15px] leading-snug mb-1.5 font-poppins">{service.name}</h3>
    <p className="text-white/50 text-xs leading-relaxed line-clamp-2 mb-4 font-poppins">{service.description}</p>

    <div className="h-px bg-white/10 mb-3" />

    <div className="flex flex-col gap-1.5 text-xs text-white/50 mb-3 font-poppins">
      <span className="flex items-center gap-1.5"><Clock size={13} className="text-nerd-blue" /> {service.duration_minutes} นาที</span>
      <span className="flex items-center gap-1.5"><User size={13} className="text-nerd-blue" /> {service.age_recommendation}</span>
    </div>

    <div className="h-px bg-white/10 mb-3" />

    <div className="flex flex-col gap-1.5 text-xs mt-auto font-poppins">
      <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-[13px]">
        <BadgeDollarSign size={14} /> {service.price_min} – {service.price_max} บาท
      </span>
      <span className="text-white/50 flex items-center gap-1.5"><Sparkles size={12} className="text-nerd-orange" /> {service.expected_result}</span>
      <span className="text-white/50 flex items-center gap-1.5"><RefreshCw size={12} className="text-nerd-blue" /> {service.recommended_sessions}</span>
    </div>
  </div>
);

// ── Staff Card ──
const StaffCard = ({ staff }: { staff: ClinicStaff }) => {
  const color = getAvatarColor(staff.staff_code);
  const initial = staff.full_name.charAt(0);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg font-poppins"
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
      <h3 className="text-white font-bold text-sm mb-1 font-poppins">{staff.full_name}</h3>
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-nerd-blue/20 text-[#8da0d6] border border-nerd-blue/30 mb-4">
        {staff.position}
      </span>

      <div className="h-px bg-white/10 w-full mb-4" />

      <div className="w-full flex flex-col gap-2 text-xs text-white/50 text-left font-poppins">
        <span className="flex items-center gap-2"><Target size={13} className="text-nerd-pink flex-shrink-0" /> {staff.specialties}</span>
        <span className="flex items-center gap-2"><Calendar size={13} className="text-nerd-blue flex-shrink-0" /> {staff.working_days} · {staff.working_hours}</span>
        <span className="flex items-center gap-2"><Globe size={13} className="text-nerd-orange flex-shrink-0" /> {staff.languages}</span>
        <span className="flex items-center gap-2"><Star size={13} className="text-nerd-orange flex-shrink-0" /> {staff.experience_years} ปี</span>
        <span className="flex items-center gap-2"><ClipboardList size={13} className="text-nerd-blue flex-shrink-0" /> {staff.cases_per_day} เคส/วัน</span>
      </div>
    </div>
  );
};

// ── Hero Section ──
const HeroSection = ({ serviceCount, faqCount, staffCount }: { serviceCount: number; faqCount: number; staffCount: number }) => (
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
          Knowledge Base
        </div>

        <h1 className="font-retro text-lg md:text-xl leading-relaxed mb-4 text-white animate-fade-in" style={{ animationDelay: '80ms' }}>
          Knowledge Base
        </h1>

        <p className="text-sm leading-relaxed mb-7 max-w-md animate-fade-in font-poppins" style={{ color: 'rgba(255,255,255,0.55)', animationDelay: '160ms' }}>
          ข้อมูลบริการ คำถามที่พบบ่อย และทีมแพทย์ — ครบทุกอย่างในที่เดียว
        </p>

        <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '240ms' }}>
          <StatPill icon={Zap} label="บริการ" value={`${serviceCount} รายการ`} />
          <StatPill icon={HelpCircle} label="FAQ" value={`${faqCount} คำถาม`} />
          <StatPill icon={Users} label="บุคลากร" value={`${staffCount} คน`} />
        </div>
      </div>

      <div className="hidden md:block flex-shrink-0 self-end animate-fade-in pb-10" style={{ animationDelay: '100ms' }}>
        <img
          src={nerdLogo}
          alt="NerdOptimize"
          className="w-auto object-contain select-none"
          style={{ height: 80, filter: 'drop-shadow(0 -6px 28px rgba(77,98,167,0.35))' }}
        />
      </div>
    </div>
  </div>
);

// ── Main Page ──
const Knowledge = () => {
  const { data: services, isLoading: sLoading } = useClinicServices();
  const { data: faqs, isLoading: fLoading } = useClinicFaq();
  const { data: staff, isLoading: stLoading } = useClinicStaff();

  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategory, setServiceCategory] = useState('All');
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState('All');

  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter(s => {
      const matchesSearch = !serviceSearch ||
        s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.description.toLowerCase().includes(serviceSearch.toLowerCase());
      const matchesCategory = serviceCategory === 'All' || s.category === serviceCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, serviceSearch, serviceCategory]);

  const filteredFaqs = useMemo(() => {
    if (!faqs) return [];
    return faqs.filter(f => {
      const matchesSearch = !faqSearch ||
        f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.answer.toLowerCase().includes(faqSearch.toLowerCase());
      const matchesCategory = faqCategory === 'All' || f.category === faqCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, faqSearch, faqCategory]);

  const isLoading = sLoading || fLoading || stLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0f1923 0%, #162033 100%)' }}>
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-nerd-blue border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50 text-sm font-poppins">กำลังโหลดข้อมูล...</p>
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

        <HeroSection
          serviceCount={services?.length ?? 0}
          faqCount={faqs?.length ?? 0}
          staffCount={staff?.length ?? 0}
        />

        {/* ── Tabs ── */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="w-full bg-white/5 border border-white/10 mb-8 h-14 p-1.5 rounded-2xl backdrop-blur-sm">
            <TabsTrigger
              value="services"
              className="flex-1 text-sm font-semibold rounded-xl text-white/50 data-[state=active]:bg-nerd-blue data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-nerd-blue/20 transition-all h-full font-poppins"
            >
              💉 บริการ
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="flex-1 text-sm font-semibold rounded-xl text-white/50 data-[state=active]:bg-nerd-blue data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-nerd-blue/20 transition-all h-full font-poppins"
            >
              ❓ FAQ
            </TabsTrigger>
            <TabsTrigger
              value="staff"
              className="flex-1 text-sm font-semibold rounded-xl text-white/50 data-[state=active]:bg-nerd-blue data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-nerd-blue/20 transition-all h-full font-poppins"
            >
              👩‍⚕️ ทีมแพทย์
            </TabsTrigger>
          </TabsList>

          {/* ── TAB 1: Services ── */}
          <TabsContent value="services">
            <SearchInput value={serviceSearch} onChange={setServiceSearch} placeholder="ค้นหาบริการ..." />
            <FilterPills categories={serviceCategories} active={serviceCategory} onChange={setServiceCategory} />
            <p className="text-white/40 text-xs mb-5 font-poppins">
              แสดง {filteredServices.length} จาก {services?.length ?? 0} บริการ
            </p>

            {filteredServices.length === 0 ? (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center backdrop-blur-sm">
                <p className="text-white/40 text-sm font-poppins">ไม่พบบริการที่ค้นหา 🔍</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredServices.map(s => <ServiceCard key={s.id} service={s} />)}
              </div>
            )}
          </TabsContent>

          {/* ── TAB 2: FAQ ── */}
          <TabsContent value="faq">
            <SearchInput value={faqSearch} onChange={setFaqSearch} placeholder="ค้นหาคำถาม..." />
            <FilterPills categories={faqCategories} active={faqCategory} onChange={setFaqCategory} />

            {filteredFaqs.length === 0 ? (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center backdrop-blur-sm">
                <p className="text-white/40 text-sm font-poppins">ไม่พบคำถามที่ค้นหา 🔍</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-3">
                {filteredFaqs.map(f => (
                  <AccordionItem key={f.id} value={f.id} className="border-none">
                    <AccordionTrigger className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 hover:bg-white/[0.08] hover:border-white/15 hover:no-underline text-left gap-3 backdrop-blur-sm [&[data-state=open]]:rounded-b-none [&[data-state=open]]:border-nerd-blue/30 transition-all">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className={cn('text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 border', getFaqBadge(f.category))}>
                          {f.category}
                        </span>
                        <span className="text-white/30 text-[10px] font-mono flex-shrink-0">{f.faq_code}</span>
                        <span className="text-white text-sm font-medium truncate font-poppins">{f.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white/[0.03] border border-t-0 border-white/10 rounded-b-2xl px-5 py-4">
                      <p className="text-white/70 text-sm leading-relaxed mb-3 font-poppins">
                        <span className="text-nerd-blue font-semibold">คำตอบ: </span>{f.answer}
                      </p>
                      {f.related_services && (
                        <p className="text-white/40 text-xs font-poppins">🔗 {f.related_services}</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>

          {/* ── TAB 3: Staff ── */}
          <TabsContent value="staff">
            {!staff || staff.length === 0 ? (
              <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center backdrop-blur-sm">
                <p className="text-white/40 text-sm font-poppins">ไม่พบข้อมูลบุคลากร 👩‍⚕️</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {staff.map(s => <StaffCard key={s.id} staff={s} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Knowledge;
