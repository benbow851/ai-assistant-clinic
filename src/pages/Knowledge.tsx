
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import LoadingState from '@/components/LoadingState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useClinicServices, useClinicFaq, useClinicStaff, ClinicService, ClinicFaq, ClinicStaff } from '@/hooks/use-knowledge';
import { cn } from '@/lib/utils';
import { Search, Zap, HelpCircle, Users, Clock, User, Sparkles, RefreshCw, BadgeDollarSign, Target, Calendar, Globe, Star, ClipboardList } from 'lucide-react';
import brandAmbassador from '@/assets/brand-ambassador.png';

// ── Category badge color map ──
const serviceCategoryColors: Record<string, string> = {
  Botox: 'bg-purple-100 text-purple-700 border-purple-200',
  Filler: 'bg-pink-100 text-pink-700 border-pink-200',
  Laser: 'bg-orange-100 text-orange-700 border-orange-200',
  'Skin Tightening': 'bg-blue-100 text-blue-700 border-blue-200',
  'Vitamin Drip': 'bg-green-100 text-green-700 border-green-200',
  Facial: 'bg-teal-100 text-teal-700 border-teal-200',
  Hair: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Body: 'bg-red-100 text-red-700 border-red-200',
  Package: 'bg-amber-100 text-amber-700 border-amber-200',
  'Acne & Scar': 'bg-rose-100 text-rose-700 border-rose-200',
  'Thread Lift': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Consultation: 'bg-sky-100 text-sky-700 border-sky-200',
  'Check-up': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};
const getCategoryBadge = (cat: string) =>
  serviceCategoryColors[cat] || 'bg-gray-100 text-gray-600 border-gray-200';

const faqCategoryColors: Record<string, string> = {
  'การจอง': 'bg-blue-100 text-blue-700 border-blue-200',
  Botox: 'bg-purple-100 text-purple-700 border-purple-200',
  Filler: 'bg-pink-100 text-pink-700 border-pink-200',
  Laser: 'bg-orange-100 text-orange-700 border-orange-200',
  'ทั่วไป': 'bg-gray-100 text-gray-600 border-gray-200',
  'ราคา': 'bg-green-100 text-green-700 border-green-200',
};
const getFaqBadge = (cat: string) => faqCategoryColors[cat] || 'bg-gray-100 text-gray-600 border-gray-200';

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

// ── Hero Stat Pill (matches Index.tsx) ──
const StatPill = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/15">
    <Icon size={15} className="text-nerd-orange flex-shrink-0" />
    <div>
      <p className="text-white/60 text-[10px] font-medium uppercase tracking-wide leading-none mb-0.5">{label}</p>
      <p className="text-white text-sm font-bold leading-none">{value}</p>
    </div>
  </div>
);

// ── Search Input (light card style) ──
const SearchInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
  <div className="relative w-full mb-4">
    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-nerd-blue focus:ring-1 focus:ring-nerd-blue/20 transition-all shadow-sm"
    />
  </div>
);

// ── Filter Pills ──
const FilterPills = ({ categories, active, onChange }: { categories: string[]; active: string; onChange: (c: string) => void }) => (
  <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
    {categories.map(cat => (
      <button
        key={cat}
        onClick={() => onChange(cat)}
        className={cn(
          "flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all border",
          active === cat
            ? 'bg-nerd-blue text-white border-nerd-blue shadow-sm'
            : 'bg-card text-muted-foreground border-border hover:border-nerd-blue/40 hover:text-foreground'
        )}
      >
        {cat}
      </button>
    ))}
  </div>
);

// ── Service Card (light card, matches news-card) ──
const ServiceCard = ({ service }: { service: ClinicService }) => (
  <div className="news-card group">
    <div className="flex items-center justify-between gap-2 mb-3">
      <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full border', getCategoryBadge(service.category))}>
        {service.category}
      </span>
      <span className="text-muted-foreground text-[11px] font-mono">{service.service_code}</span>
    </div>

    <h3 className="text-foreground font-bold text-sm leading-snug mb-1">{service.name}</h3>
    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-3">{service.description}</p>

    <div className="h-px bg-border mb-3" />

    <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-3">
      <span className="flex items-center gap-1.5"><Clock size={12} /> {service.duration_minutes} นาที</span>
      <span className="flex items-center gap-1.5"><User size={12} /> {service.age_recommendation}</span>
    </div>

    <div className="h-px bg-border mb-3" />

    <div className="flex flex-col gap-1 text-xs">
      <span className="text-nerd-green font-bold flex items-center gap-1.5">
        <BadgeDollarSign size={12} /> {service.price_min} – {service.price_max} บาท
      </span>
      <span className="text-muted-foreground flex items-center gap-1.5"><Sparkles size={12} /> {service.expected_result}</span>
      <span className="text-muted-foreground flex items-center gap-1.5"><RefreshCw size={12} /> {service.recommended_sessions}</span>
    </div>
  </div>
);

// ── Staff Card ──
const StaffCard = ({ staff }: { staff: ClinicStaff }) => {
  const color = getAvatarColor(staff.staff_code);
  const initial = staff.full_name.charAt(0);

  return (
    <div className="news-card flex flex-col items-center text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3 shadow-md"
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
      <h3 className="text-foreground font-bold text-sm mb-1">{staff.full_name}</h3>
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-nerd-blue/10 text-nerd-blue border border-nerd-blue/20 mb-3">
        {staff.position}
      </span>

      <div className="h-px bg-border w-full mb-3" />

      <div className="w-full flex flex-col gap-1.5 text-xs text-muted-foreground text-left">
        <span className="flex items-center gap-1.5"><Target size={12} /> {staff.specialties}</span>
        <span className="flex items-center gap-1.5"><Calendar size={12} /> {staff.working_days} · {staff.working_hours}</span>
        <span className="flex items-center gap-1.5"><Globe size={12} /> {staff.languages}</span>
        <span className="flex items-center gap-1.5"><Star size={12} /> {staff.experience_years} ปี</span>
        <span className="flex items-center gap-1.5"><ClipboardList size={12} /> {staff.cases_per_day} เคส/วัน</span>
      </div>
    </div>
  );
};

// ── Hero Section (same structure as Index.tsx) ──
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

        <h1
          className="font-black text-3xl md:text-4xl leading-tight mb-4 text-white animate-fade-in"
          style={{ animationDelay: '80ms' }}
        >
          Clinic<br />
          <span style={{ color: '#6b82c4' }}>Knowledge Base</span>
        </h1>

        <p className="text-sm leading-relaxed mb-7 max-w-md animate-fade-in" style={{ color: 'rgba(255,255,255,0.55)', animationDelay: '160ms' }}>
          ข้อมูลบริการ คำถามที่พบบ่อย และทีมแพทย์ — ครบทุกอย่างในที่เดียว
        </p>

        <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '240ms' }}>
          <StatPill icon={Zap} label="บริการ" value={`${serviceCount} รายการ`} />
          <StatPill icon={HelpCircle} label="FAQ" value={`${faqCount} คำถาม`} />
          <StatPill icon={Users} label="บุคลากร" value={`${staffCount} คน`} />
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
    return <LoadingState onSignOut={() => {}} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="snes-container">
        <HeroSection
          serviceCount={services?.length ?? 0}
          faqCount={faqs?.length ?? 0}
          staffCount={staff?.length ?? 0}
        />

        {/* ── Tabs ── */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="w-full bg-card border border-border mb-6 h-12 p-1 rounded-xl shadow-sm">
            <TabsTrigger
              value="services"
              className="flex-1 text-sm font-semibold rounded-lg data-[state=active]:bg-nerd-blue data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              💉 บริการ
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="flex-1 text-sm font-semibold rounded-lg data-[state=active]:bg-nerd-blue data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              ❓ FAQ
            </TabsTrigger>
            <TabsTrigger
              value="staff"
              className="flex-1 text-sm font-semibold rounded-lg data-[state=active]:bg-nerd-blue data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
            >
              👩‍⚕️ ทีมแพทย์
            </TabsTrigger>
          </TabsList>

          {/* ── TAB 1: Services ── */}
          <TabsContent value="services">
            <SearchInput value={serviceSearch} onChange={setServiceSearch} placeholder="ค้นหาบริการ..." />
            <FilterPills categories={serviceCategories} active={serviceCategory} onChange={setServiceCategory} />
            <p className="text-muted-foreground text-xs mb-4">
              แสดง {filteredServices.length} จาก {services?.length ?? 0} บริการ
            </p>

            {filteredServices.length === 0 ? (
              <div className="news-card text-center py-12">
                <p className="text-muted-foreground text-sm">ไม่พบบริการที่ค้นหา 🔍</p>
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
              <div className="news-card text-center py-12">
                <p className="text-muted-foreground text-sm">ไม่พบคำถามที่ค้นหา 🔍</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {filteredFaqs.map(f => (
                  <AccordionItem key={f.id} value={f.id} className="border-none">
                    <AccordionTrigger className="bg-card border border-border rounded-xl px-4 py-3 hover:border-nerd-blue/40 hover:no-underline text-left gap-3 shadow-sm [&[data-state=open]]:rounded-b-none [&[data-state=open]]:border-nerd-blue/30 transition-all">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 border', getFaqBadge(f.category))}>
                          {f.category}
                        </span>
                        <span className="text-muted-foreground text-[10px] font-mono flex-shrink-0">{f.faq_code}</span>
                        <span className="text-foreground text-sm truncate">{f.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-muted/50 border border-t-0 border-border rounded-b-xl px-5 py-4">
                      <p className="text-foreground/80 text-sm leading-relaxed mb-3">
                        <span className="text-muted-foreground font-semibold">คำตอบ: </span>{f.answer}
                      </p>
                      {f.related_services && (
                        <p className="text-muted-foreground text-xs">🔗 {f.related_services}</p>
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
              <div className="news-card text-center py-12">
                <p className="text-muted-foreground text-sm">ไม่พบข้อมูลบุคลากร 👩‍⚕️</p>
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
