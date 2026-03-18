import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import GlassPanel from './GlassPanel';
import NeonRunnerGame from './NeonRunnerGame';

interface GameOverlayProps {
  onClose: () => void;
}

export default function GameOverlay({ onClose }: GameOverlayProps) {
  const { t } = useTranslation();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="mx-4 w-full max-w-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            className="font-heading text-2xl font-bold text-neon-green"
            style={{ textShadow: '0 0 16px #39ff14' }}
          >
            {t('game.secretFound')}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 px-3 py-1 text-sm text-text-secondary transition-colors hover:border-neon-cyan hover:text-neon-cyan"
          >
            {t('game.close')}
          </button>
        </div>
        <GlassPanel>
          <NeonRunnerGame autoStart />
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
