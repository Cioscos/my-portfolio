import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggle = () => {
    i18n.changeLanguage(i18n.language === 'it' ? 'en' : 'it');
  };

  return (
    <button
      onClick={toggle}
      className="rounded-lg border border-white/10 bg-bg-glass px-3 py-1.5 font-mono text-sm text-neon-cyan backdrop-blur-sm transition-all hover:border-neon-cyan/50 hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]"
      aria-label="Switch language"
    >
      {i18n.language === 'it' ? 'EN' : 'IT'}
    </button>
  );
}
