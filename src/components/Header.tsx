
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
    { to: '/', label: 'News' },
    { to: '/webhooks', label: 'Webhooks' },
    { to: '/chat-editor', label: 'Chat Editor' },
    { to: '/credentials', label: '🔐 Credentials' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-nerd-navy shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200",
                location.pathname === link.to
                  ? "bg-nerd-blue text-white"
                  : "text-nerd-cloud hover:text-white hover:bg-white/10"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-nerd-cloud hover:text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-nerd-navy border-t border-white/10 px-4 pb-4">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-md text-sm font-semibold transition-all duration-200 mb-1",
                location.pathname === link.to
                  ? "bg-nerd-blue text-white"
                  : "text-nerd-cloud hover:text-white hover:bg-white/10"
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
