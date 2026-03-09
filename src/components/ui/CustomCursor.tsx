'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isSmall = window.innerWidth < 768;
    setIsMobile(isTouch || isSmall);

    const handleResize = () => {
      const touch = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(touch || window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!mounted || isMobile) return;

    const move = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const lerp = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
      }
      requestAnimationFrame(lerp);
    };

    document.addEventListener('mousemove', move);
    lerp();

    const onEnter = () => setHovering(true);
    const onLeave = () => setHovering(false);

    const interactives = document.querySelectorAll('a,button,.product-card,input,textarea,select');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    return () => {
      document.removeEventListener('mousemove', move);
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, [mounted, isMobile]);

  if (!mounted || isMobile) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{
        width: hovering ? '32px' : '8px',
        height: hovering ? '32px' : '8px',
        borderRadius: '50%',
        background: '#111111',
        opacity: hovering ? 0.15 : 1,
        transition: 'width 0.25s cubic-bezier(0.22, 1, 0.36, 1), height 0.25s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.25s ease',
      }}
    />
  );
}
