import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GlassPanel from '../components/GlassPanel';
import NeonRunnerGame from '../components/NeonRunnerGame';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-24">
      <h1
        className="font-heading text-[8rem] font-bold leading-none text-neon-magenta sm:text-[10rem]"
        style={{ textShadow: '0 0 40px #ff00e5, 0 0 80px #ff00e5' }}
      >
        {t('notFound.title')}
      </h1>
      <p className="text-xl text-text-secondary">{t('notFound.subtitle')}</p>

      <GlassPanel className="w-full max-w-2xl">
        <NeonRunnerGame />
      </GlassPanel>

      <Link
        to="/"
        className="text-neon-cyan transition-colors hover:text-neon-magenta"
      >
        {t('notFound.backHome')}
      </Link>
    </section>
  );
}
