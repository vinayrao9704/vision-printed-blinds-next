'use client';

import { useRef, useState, useCallback } from 'react';

interface Props {
  beforeSrc: string;
  afterSrc: string;
  aspectRatio: number; // width / height
}

export default function BeforeAfterSlider({ beforeSrc, afterSrc, aspectRatio }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, p)));
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (draggingRef.current) updateFromClientX(e.clientX);
  }
  function onPointerUp() {
    draggingRef.current = false;
  }

  return (
    <div
      className="bpt-compare"
      ref={wrapRef}
      style={{ aspectRatio: String(aspectRatio) }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Both images are the same size and stacked exactly on top of each other;
          the "before" layer is revealed only up to pct% via clip-path, so
          dragging never resizes or reflows either image. */}
      <img src={afterSrc} alt="Custom blind preview" className="bpt-compare__img bpt-compare__img--after" draggable={false} />
      <img
        src={beforeSrc}
        alt="Original room"
        className="bpt-compare__img bpt-compare__img--before"
        draggable={false}
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      />
      <span className="bpt-compare__tag bpt-compare__tag--before">BEFORE</span>
      <span className="bpt-compare__tag bpt-compare__tag--after">AFTER</span>
      <div className="bpt-compare__divider" style={{ left: `${pct}%` }}>
        <div className="bpt-compare__handle">
          <svg viewBox="0 0 24 24" fill="none"><path d="M8 6L2 12L8 18M16 6L22 12L16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </div>
  );
}
