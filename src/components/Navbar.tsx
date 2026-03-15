import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-scroll';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_ITEMS = ['about', 'projects', 'skills', 'experience', 'contact'] as const;

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-bg-glass backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="font-heading text-xl font-bold text-neon-cyan"
        >
          CC
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item}
              to={item}
              spy
              smooth
              offset={-80}
              duration={500}
              className="cursor-pointer text-sm text-text-secondary transition-colors hover:text-neon-cyan"
              activeClass="!text-neon-cyan"
            >
              {t(`nav.${item}`)}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <button
          className="text-2xl text-text-primary md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col items-center gap-6 border-t border-white/10 bg-bg-glass px-6 py-8 backdrop-blur-xl md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item}
              to={item}
              spy
              smooth
              offset={-80}
              duration={500}
              className="cursor-pointer text-lg text-text-secondary transition-colors hover:text-neon-cyan"
              activeClass="!text-neon-cyan"
              onClick={() => setMenuOpen(false)}
            >
              {t(`nav.${item}`)}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>
      )}
    </nav>
  );
}
