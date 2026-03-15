import { useTranslation } from 'react-i18next';
import { FaHeart } from 'react-icons/fa';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-white/10 bg-bg-secondary py-8 text-center text-sm text-text-secondary">
      <p className="flex items-center justify-center gap-1">
        {t('footer.madeWith')}{' '}
        <FaHeart className="text-neon-magenta" />{' '}
        {t('footer.by')}
      </p>
    </footer>
  );
}
