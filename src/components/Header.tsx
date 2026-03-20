
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: '/knowledge', label: '📚 Knowledge Base' },
    { to: '/customers', label: '👥 Customers' },
    { to: '/appointments', label: '📅 Appointments' },
    { to: '/webhooks', label: 'Webhooks' },
    { to: '/credentials', label: '🔐 Credentials' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl border-b border-white/[0.06]" style={{ background: 'rgba(15, 25, 35, 0.85)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 font-poppins",
                location.pathname === link.to
                  ? "bg-nerd-blue/20 text-white border border-nerd-blue/30 shadow-sm shadow-nerd-blue/10"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.06] border border-transparent"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <button
            className="text-white/50 hover:text-white p-2 rounded-xl hover:bg-white/[0.06] transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.06] px-4 pb-4 pt-2" style={{ background: 'rgba(15, 25, 35, 0.95)' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 mb-1 font-poppins",
                location.pathname === link.to
                  ? "bg-nerd-blue/20 text-white border border-nerd-blue/30"
                  : "text-white/45 hover:text-white/80 hover:bg-white/[0.06] border border-transparent"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
