import { useState, useEffect, useRef, useCallback } from 'react';

const values = [
  { label: 'Valores Cristãos', id: 'valores' },
  { label: 'Excelência Acadêmica', id: 'excelencia' },
  { label: 'Formação Humana', id: 'formacao' },
  { label: 'Preparação para o Futuro', id: 'futuro' },
];

const CYCLE_MS = 4000;
const RESUME_DELAY_MS = 8000;

export default function ValueSpotlight() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [indicatorX, setIndicatorX] = useState(0);
  const [indicatorY, setIndicatorY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const containerRef = useRef<HTMLUListElement>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Position gold dot beneath the active item (supports flex-wrap)
  const updateIndicator = useCallback(() => {
    const item = itemRefs.current[activeIndex];
    const container = containerRef.current;
    if (!item || !container) return;
    const cRect = container.getBoundingClientRect();
    const iRect = item.getBoundingClientRect();
    setIndicatorX(iRect.left - cRect.left + iRect.width / 2);
    setIndicatorY(iRect.bottom - cRect.top + 4);
  }, [activeIndex]);

  useEffect(() => {
    updateIndicator();
    const onResize = () => updateIndicator();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateIndicator]);

  // Auto-rotate
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % values.length);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, [isPaused, prefersReducedMotion]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  const pause = () => {
    setIsPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const resume = () => {
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, RESUME_DELAY_MS);
  };

  return (
    <div
      className='relative inline-block'
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      <ul
        ref={containerRef}
        role='list'
        aria-label='Pilares institucionais: Valores Cristãos, Excelência Acadêmica, Formação Humana, Preparação para o Futuro'
        className='relative flex flex-wrap gap-x-6 gap-y-2'
      >
        {values.map((value, index) => (
          <li
            key={value.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            tabIndex={0}
            onFocus={() => {
              setActiveIndex(index);
              pause();
            }}
            onBlur={resume}
            onMouseEnter={() => {
              setActiveIndex(index);
              pause();
            }}
            className={`relative text-sm font-medium tracking-wide text-white transition-opacity duration-300 ease-in-out cursor-default ${
              index === activeIndex ? 'opacity-100' : 'opacity-60'
            }`}
          >
            {value.label}
          </li>
        ))}
        {/* Gold dot indicator — GPU-friendly transform-only */}
        <span
          aria-hidden='true'
          className='absolute h-2 w-2 rounded-full bg-secondary transition-transform duration-500 ease-in-out'
          style={{
            transform: `translate(${indicatorX}px, ${indicatorY}px) translateX(-50%)`,
            willChange: 'transform',
          }}
        />
      </ul>
    </div>
  );
}
