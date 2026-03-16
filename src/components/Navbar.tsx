import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import LanguageSwitcher from './LanguageSwitcher';

const NAV_ITEMS = ['about', 'projects', 'github-stats', 'skills', 'experience', 'blog', 'contact'] as const;

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleNavClick = useCallback(
    (section: string) => {
      setMenuOpen(false);
      if (!isHome) {
        navigate('/', { state: { scrollTo: section } });
      }
    },
    [isHome, navigate],
  );

  const renderNavItem = (item: string, mobile: boolean) => {
    const className = mobile
      ? 'cursor-pointer text-lg text-text-secondary transition-colors hover:text-neon-cyan'
      : 'cursor-pointer text-sm text-text-secondary transition-colors hover:text-neon-cyan';

    if (isHome) {
      return (
        <ScrollLink
          key={item}
          to={item}
          spy
          smooth
          offset={-80}
          duration={500}
          className={className}
          activeClass="!text-neon-cyan"
          onClick={() => setMenuOpen(false)}
        >
          {t(`nav.${item}`)}
        </ScrollLink>
      );
    }

    return (
      <button
        key={item}
        onClick={() => handleNavClick(item)}
        className={className}
      >
        {t(`nav.${item}`)}
      </button>
    );
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'border-white/10 bg-bg-glass backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <RouterLink
          to="/"
          className="font-heading text-xl font-bold text-neon-cyan"
        >
          CC
        </RouterLink>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => renderNavItem(item, false))}
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <button
          className="text-2xl text-text-primary md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-menu" className="flex flex-col items-center gap-6 border-t border-white/10 bg-bg-glass px-6 py-8 backdrop-blur-xl md:hidden">
          {NAV_ITEMS.map((item) => renderNavItem(item, true))}
          <LanguageSwitcher />
        </div>
      )}
    </nav>
  );
}
