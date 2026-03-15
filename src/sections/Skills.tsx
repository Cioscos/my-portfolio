import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'motion/react';
import {
  FaJava,
  FaPython,
  FaDocker,
  FaGitAlt,
  FaLinux,
  FaDatabase,
} from 'react-icons/fa';
import {
  SiSpringboot,
  SiFastapi,
  SiPostgresql,
  SiApachekafka,
  SiRabbitmq,
} from 'react-icons/si';

interface Skill {
  name: string;
  icon: React.ReactNode;
  category: string;
}

const skills: Skill[] = [
  { name: 'Java', icon: <FaJava />, category: 'backend' },
  { name: 'Spring Boot', icon: <SiSpringboot />, category: 'backend' },
  { name: 'Python', icon: <FaPython />, category: 'backend' },
  { name: 'FastAPI', icon: <SiFastapi />, category: 'backend' },
  { name: 'Oracle', icon: <FaDatabase />, category: 'database' },
  { name: 'PostgreSQL', icon: <SiPostgresql />, category: 'database' },
  { name: 'Apache Kafka', icon: <SiApachekafka />, category: 'messaging' },
  { name: 'RabbitMQ', icon: <SiRabbitmq />, category: 'messaging' },
  { name: 'Docker', icon: <FaDocker />, category: 'tools' },
  { name: 'Git', icon: <FaGitAlt />, category: 'tools' },
  { name: 'Linux', icon: <FaLinux />, category: 'tools' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300 } },
};

export default function Skills() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const categories = ['backend', 'database', 'messaging', 'tools'] as const;

  return (
    <section id="skills" className="bg-bg-secondary px-6 py-24">
      <div ref={ref} className="mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center font-heading text-4xl font-bold text-text-primary"
        >
          {t('skills.title')}
        </motion.h2>

        {categories.map((cat) => (
          <div key={cat} className="mb-10">
            <h3 className="mb-4 font-heading text-lg font-semibold text-neon-cyan">
              {t(`skills.categories.${cat}`)}
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="flex flex-wrap gap-4"
            >
              {skills
                .filter((s) => s.category === cat)
                .map((skill) => (
                  <motion.div
                    key={skill.name}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(0,240,255,0.2)' }}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-bg-glass px-4 py-2.5 text-text-primary backdrop-blur-sm"
                  >
                    <span className="text-xl text-neon-cyan">{skill.icon}</span>
                    <span className="text-sm font-medium">{skill.name}</span>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
