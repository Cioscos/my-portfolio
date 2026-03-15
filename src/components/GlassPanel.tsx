import { motion, type HTMLMotionProps } from 'motion/react';

type GlassPanelProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode;
};

export default function GlassPanel({
  children,
  className = '',
  ...props
}: GlassPanelProps) {
  return (
    <motion.div
      className={`rounded-2xl border border-white/10 bg-bg-glass backdrop-blur-xl p-6 shadow-lg ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
