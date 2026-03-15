import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'motion/react';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';

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

export default function Contact() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

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
      </div>
    </section>
  );
}
