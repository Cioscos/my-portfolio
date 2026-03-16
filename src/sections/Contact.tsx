import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'motion/react';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import GlassPanel from '../components/GlassPanel';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mreyyvkr';

const socials = [
  {
    icon: <FaEnvelope />,
    href: 'mailto:claudiocicca98@gmail.com',
    label: 'Email',
  },
  {
    icon: <FaLinkedin />,
    href: 'https://www.linkedin.com/in/claudio-ciccarone-366b14141/',
    label: 'LinkedIn',
  },
  {
    icon: <FaGithub />,
    href: 'https://github.com/Cioscos',
    label: 'GitHub',
  },
];

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function Contact() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(e.currentTarget),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="bg-bg-secondary px-6 py-24">
      <div ref={ref} className="mx-auto max-w-2xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-4 font-heading text-4xl font-bold text-text-primary"
        >
          {t('contact.title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="mb-12 text-text-secondary"
        >
          {t('contact.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-6"
        >
          {socials.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-bg-glass text-2xl text-text-secondary backdrop-blur-sm transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              aria-label={s.label}
            >
              {s.icon}
            </motion.a>
          ))}
        </motion.div>

        <GlassPanel
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 text-left"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              required
              placeholder={t('contact.namePlaceholder')}
              className="rounded-lg border border-white/10 bg-bg-glass px-4 py-3 font-body text-text-primary placeholder-text-secondary backdrop-blur-sm transition-colors focus:border-neon-cyan focus:outline-none"
            />
            <input
              type="email"
              name="email"
              required
              placeholder={t('contact.emailPlaceholder')}
              className="rounded-lg border border-white/10 bg-bg-glass px-4 py-3 font-body text-text-primary placeholder-text-secondary backdrop-blur-sm transition-colors focus:border-neon-cyan focus:outline-none"
            />
            <textarea
              name="message"
              required
              rows={5}
              placeholder={t('contact.messagePlaceholder')}
              className="resize-none rounded-lg border border-white/10 bg-bg-glass px-4 py-3 font-body text-text-primary placeholder-text-secondary backdrop-blur-sm transition-colors focus:border-neon-cyan focus:outline-none"
            />

            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center justify-center gap-2 rounded-lg border border-neon-cyan/50 bg-neon-cyan/10 px-6 py-3 font-heading font-semibold text-neon-cyan transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] disabled:opacity-50"
            >
              {status === 'loading' ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                t('contact.send')
              )}
            </button>

            {status === 'success' && (
              <p className="text-sm text-neon-green">{t('contact.success')}</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-400">{t('contact.error')}</p>
            )}
          </form>
        </GlassPanel>
      </div>
    </section>
  );
}
