import { useCallback, useEffect, useRef, useState } from 'react';

const KONAMI_SEQUENCE = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
];

export default function useKonamiCode() {
  const [activated, setActivated] = useState(false);
  const bufferRef = useRef<string[]>([]);

  const reset = useCallback(() => {
    setActivated(false);
    bufferRef.current = [];
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const buffer = bufferRef.current;
      const key = e.key.toLowerCase();
      buffer.push(key);
      if (buffer.length > KONAMI_SEQUENCE.length) {
        buffer.shift();
      }
      if (
        buffer.length === KONAMI_SEQUENCE.length &&
        buffer.every((k, i) => k === KONAMI_SEQUENCE[i])
      ) {
        setActivated(true);
        bufferRef.current = [];
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { activated, reset };
}
