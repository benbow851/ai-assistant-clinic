
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import LoadingState from '@/components/LoadingState';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useClinicServices, useClinicFaq, useClinicStaff, ClinicService, ClinicFaq, ClinicStaff } from '@/hooks/use-knowledge';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

// ── Category badge color map for services ──
const serviceCategoryColors: Record<string, string> = {
  Botox: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  Filler: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
  Laser: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  'Skin Tightening': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  'Vitamin Drip': 'bg-green-500/20 text-green-300 border border-green-500/30',
  Facial: 'bg-teal-500/20 text-teal-300 border border-teal-500/30',
  Hair: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  Body: 'bg-red-500/20 text-red-300 border border-red-500/30',
  Package: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
};

const getCategoryBadge = (category: string) =>
  serviceCategoryColors[category] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30';

// ── FAQ category colors (reuse similar palette) ──
const faqCategoryColors: Record<string, string> = {
  'การจอง': 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  Botox: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
  Filler: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
  Laser: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
  'ทั่วไป': 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
  'ราคา': 'bg-green-500/20 text-green-300 border border-green-500/30',
};
const getFaqBadge = (cat: string) => faqCategoryColors[cat] || 'bg-gray-500/20 text-gray-300 border border-gray-500/30';

// ── Staff avatar color pool ──
const avatarColors = ['#4d62a7', '#bf415c', '#f7991a', '#22c55e', '#7c3aed', '#0ea5e9', '#ec4899'];
const getAvatarColor = (code: string) => {
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

// ── Service categories for filter pills ──
const serviceCategories = [
  'All', 'Botox', 'Filler', 'Laser', 'Skin Tightening', 'Vitamin Drip',
  'Facial', 'Hair', 'Body', 'Acne & Scar', 'Thread Lift', 'Package', 'Consultation', 'Check-up',
];

const faqCategories = ['All', 'การจอง', 'Botox', 'Filler', 'Laser', 'ทั่วไป', 'ราคา'];

// ── Stat Pill (matching Index hero) ──
const StatPill = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/15">
    <span className="text-base flex-shrink-0">{icon}</span>
    <div>
      <p className="text-white/60 text-[10px] font-medium uppercase tracking-wide leading-none mb-0.5 font-['Poppins']">{label}</p>
      <p className="text-white text-sm font-bold leading-none font-['Poppins']">{value}</p>
    </div>
  </div>
);

// ── Search Input ──
const SearchInput = ({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) => (
  <div className="relative w-full mb-4">
    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/30 text-sm font-['Poppins'] outline-none focus:border-white/25 transition-colors"
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
          "flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all font-['Poppins']",
          active === cat
            ? 'bg-nerd-blue text-white'
            : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
        )}
      >
        {cat}
      </button>
    ))}
  </div>
);

// ── Service Card ──
const ServiceCard = ({ service }: { service: ClinicService }) => (
  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:border-white/20 transition-colors">
    <div className="flex items-center justify-between gap-2">
      <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full', getCategoryBadge(service.category))}>
        {service.category}
      </span>
      <span className="text-white/40 text-[11px] font-mono">{service.service_code}</span>
    </div>

    <h3 className="text-white font-bold text-sm font-['Poppins'] leading-snug">{service.name}</h3>
    <p className="text-white/60 text-xs font-['Poppins'] leading-relaxed line-clamp-2">{service.description}</p>

    <div className="h-px bg-white/10" />

    <div className="flex flex-col gap-1 text-xs text-white/60 font-['Poppins']">
      <span>⏱ {service.duration_minutes} นาที</span>
      <span>👤 {service.age_recommendation}</span>
    </div>

    <div className="h-px bg-white/10" />

    <div className="flex flex-col gap-1 text-xs font-['Poppins']">
      <span className="text-green-400 font-semibold">💰 {service.price_min} – {service.price_max} บาท</span>
      <span className="text-white/60">✨ {service.expected_result}</span>
      <span className="text-white/60">🔁 {service.recommended_sessions}</span>
    </div>
  </div>
);

// ── Staff Card ──
const StaffCard = ({ staff }: { staff: ClinicStaff }) => {
  const color = getAvatarColor(staff.staff_code);
  const initial = staff.full_name.charAt(0);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:border-white/20 transition-colors">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold font-['Poppins']"
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
      <h3 className="text-white font-bold text-sm font-['Poppins']">{staff.full_name}</h3>
      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-nerd-blue/20 text-nerd-blue border border-nerd-blue/30 font-['Poppins']">
        {staff.position}
      </span>

      <div className="h-px bg-white/10 w-full" />

      <div className="w-full flex flex-col gap-1.5 text-xs text-white/60 text-left font-['Poppins']">
        <span>🎯 {staff.specialties}</span>
        <span>📅 {staff.working_days}  ⏰ {staff.working_hours}</span>
        <span>🌐 {staff.languages}</span>
        <span>⭐ {staff.experience_years} ปี</span>
        <span>📋 {staff.cases_per_day} เคส/วัน</span>
      </div>
    </div>
  );
};

// ── Main Page ──
const Knowledge = () => {
  const { data: services, isLoading: sLoading } = useClinicServices();
  const { data: faqs, isLoading: fLoading } = useClinicFaq();
  const { data: staff, isLoading: stLoading } = useClinicStaff();

  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategory, setServiceCategory] = useState('All');
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState('All');

  // Client-side filtering for services
  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter(s => {
      const matchesSearch = !serviceSearch ||
        s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.description.toLowerCase().includes(serviceSearch.toLowerCase());
      // "All" shows everything; otherwise match category exactly
      const matchesCategory = serviceCategory === 'All' || s.category === serviceCategory;
      return matchesSearch && matchesCategory;
    });
  }, [services, serviceSearch, serviceCategory]);

  // Client-side filtering for FAQ
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
        {/* ── Hero Section ── */}
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

          <div className="relative z-10 px-8 py-10">
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border animate-fade-in"
              style={{ background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.85)' }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse-soft" style={{ background: '#f7991a' }} />
              Knowledge Base
            </div>

            <h1
              className="font-['Press_Start_2P'] text-lg md:text-xl leading-tight mb-4 text-white animate-fade-in"
              style={{ animationDelay: '80ms' }}
            >
              Clinic Knowledge Base
            </h1>
            <p className="text-sm text-white/55 font-['Poppins'] mb-7 max-w-md animate-fade-in" style={{ animationDelay: '160ms' }}>
              ข้อมูลบริการ คำถาม และทีมแพทย์
            </p>

            <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: '240ms' }}>
              <StatPill icon="⚡" label="บริการ" value={String(services?.length ?? 0)} />
              <StatPill icon="❓" label="FAQ" value={String(faqs?.length ?? 0)} />
              <StatPill icon="👩‍⚕️" label="บุคลากร" value={String(staff?.length ?? 0)} />
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="w-full bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="services" className="flex-1 data-[state=active]:bg-nerd-blue data-[state=active]:text-white font-['Poppins'] text-sm">
              💉 บริการ
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex-1 data-[state=active]:bg-nerd-blue data-[state=active]:text-white font-['Poppins'] text-sm">
              ❓ FAQ
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex-1 data-[state=active]:bg-nerd-blue data-[state=active]:text-white font-['Poppins'] text-sm">
              👩‍⚕️ ทีมแพทย์
            </TabsTrigger>
          </TabsList>

          {/* ── TAB 1: Services ── */}
          <TabsContent value="services">
            <SearchInput value={serviceSearch} onChange={setServiceSearch} placeholder="ค้นหาบริการ..." />
            <FilterPills categories={serviceCategories} active={serviceCategory} onChange={setServiceCategory} />
            <p className="text-white/40 text-xs font-['Poppins'] mb-4">
              แสดง {filteredServices.length} จาก {services?.length ?? 0} บริการ
            </p>

            {filteredServices.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10 text-center text-white/60 font-['Poppins']">
                ไม่พบบริการที่ค้นหา 🔍
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map(s => <ServiceCard key={s.id} service={s} />)}
              </div>
            )}
          </TabsContent>

          {/* ── TAB 2: FAQ ── */}
          <TabsContent value="faq">
            <SearchInput value={faqSearch} onChange={setFaqSearch} placeholder="ค้นหาคำถาม..." />
            <FilterPills categories={faqCategories} active={faqCategory} onChange={setFaqCategory} />

            {filteredFaqs.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10 text-center text-white/60 font-['Poppins']">
                ไม่พบคำถามที่ค้นหา 🔍
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {filteredFaqs.map(f => (
                  <AccordionItem key={f.id} value={f.id} className="border-none">
                    <AccordionTrigger className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 hover:bg-white/8 hover:no-underline text-left gap-3 [&[data-state=open]]:rounded-b-none">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0', getFaqBadge(f.category))}>
                          {f.category}
                        </span>
                        <span className="text-white/40 text-[10px] font-mono flex-shrink-0">{f.faq_code}</span>
                        <span className="text-white text-sm font-['Poppins'] truncate">{f.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white/[0.03] border border-t-0 border-white/10 rounded-b-xl px-5 py-4">
                      <p className="text-white/70 text-sm font-['Poppins'] leading-relaxed mb-3">
                        <span className="text-white/40 font-semibold">คำตอบ: </span>{f.answer}
                      </p>
                      {f.related_services && (
                        <p className="text-white/40 text-xs font-['Poppins']">🔗 {f.related_services}</p>
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
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10 text-center text-white/60 font-['Poppins']">
                ไม่พบข้อมูลบุคลากร 👩‍⚕️
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
