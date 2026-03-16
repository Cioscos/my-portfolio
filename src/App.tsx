import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scroller } from 'react-scroll';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import GitHubStats from './sections/GitHubStats';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Blog from './sections/Blog';
import Contact from './sections/Contact';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        scroller.scrollTo(state.scrollTo!, {
          smooth: true,
          offset: -80,
          duration: 500,
        });
      }, 100);
      // Clear state so it doesn't re-scroll on re-render
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  return (
    <>
      <Hero />
      <About />
      <Projects />
      <GitHubStats />
      <Skills />
      <Experience />
      <Blog />
      <Contact />
    </>
  );
}
