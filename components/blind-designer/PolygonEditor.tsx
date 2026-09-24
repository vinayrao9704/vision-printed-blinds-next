'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { EditPoint } from './types';

interface Props {
  points: EditPoint[];
  onChange: (points: EditPoint[]) => void;
  naturalWidth: number;
  naturalHeight: number;
}

const MAX_POINTS = 8;
// Target physical on-screen size for touch targets, in CSS pixels — not raw
// viewBox units. A large room photo (e.g. 3000px wide) displayed at phone
// width (e.g. 340px) has a ~9x scale-down, so a fixed viewBox-unit radius
// that looks right on desktop becomes only a couple of screen pixels on a
// phone — effectively untappable. These are resolved to viewBox units below
// based on the SVG's actual rendered size.
const HANDLE_TARGET_PX = 22;
const MID_TARGET_PX = 15;

/**
 * SVG overlay for editing a window outline over a room photo.
 * The 4 `corner` points (TL,TR,BR,BL) drive the perspective warp and can
 * be dragged but never removed. Non-corner points can be inserted at any
 * edge midpoint (to notch the mask around an obstruction) and removed.
 * Dragging inside the shape (not on a handle) moves the whole outline.
 *
 * The SVG's viewBox is set to the image's natural pixel dimensions and
 * stretched via CSS to match the displayed image, so all point math here
 * is already in natural-image coordinate space via getScreenCTM().
 */
export default function PolygonEditor({ points, onChange, naturalWidth, naturalHeight }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragMove, setDragMove] = useState<{ startX: number; startY: number; original: EditPoint[] } | null>(null);
  const [screenScale, setScreenScale] = useState(1); // naturalWidth / renderedWidth

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || naturalWidth <= 0) return;
    const update = () => {
      const rect = svg.getBoundingClientRect();
      if (rect.width > 0) setScreenScale(naturalWidth / rect.width);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [naturalWidth]);

  const HANDLE_R = HANDLE_TARGET_PX * screenScale;
  const MID_R = MID_TARGET_PX * screenScale;

  const toSvgPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const transformed = pt.matrixTransform(ctm.inverse());
    return { x: transformed.x, y: transformed.y };
  }, []);

  function clamp(p: Point2) {
    return { x: Math.max(0, Math.min(naturalWidth, p.x)), y: Math.max(0, Math.min(naturalHeight, p.y)) };
  }

  function handlePointerDownVertex(e: React.PointerEvent, index: number) {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragIndex(index);
  }

  function handlePointerDownBody(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture(e.pointerId);
    const p = toSvgPoint(e.clientX, e.clientY);
    setDragMove({ startX: p.x, startY: p.y, original: points.map((pt) => ({ ...pt })) });
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (dragIndex !== null) {
      const p = clamp(toSvgPoint(e.clientX, e.clientY));
      const next = points.map((pt, i) => (i === dragIndex ? { ...pt, x: p.x, y: p.y } : pt));
      onChange(next);
    } else if (dragMove) {
      const p = toSvgPoint(e.clientX, e.clientY);
      const dx = p.x - dragMove.startX;
      const dy = p.y - dragMove.startY;
      const next = dragMove.original.map((pt) => clamp({ x: pt.x + dx, y: pt.y + dy }));
      onChange(next.map((pt, i) => ({ ...pt, corner: dragMove.original[i].corner })));
    }
  }

  function handlePointerUp() {
    setDragIndex(null);
    setDragMove(null);
  }

  function addPointAt(edgeIndex: number) {
    if (points.length >= MAX_POINTS) return;
    const a = points[edgeIndex];
    const b = points[(edgeIndex + 1) % points.length];
    const mid: EditPoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, corner: false };
    const next = [...points.slice(0, edgeIndex + 1), mid, ...points.slice(edgeIndex + 1)];
    onChange(next);
  }

  function removePoint(index: number) {
    if (points[index].corner) return; // corners are permanent
    if (points.length <= 4) return;
    onChange(points.filter((_, i) => i !== index));
  }

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg
      ref={svgRef}
      className="bpt-editor-svg"
      viewBox={`0 0 ${naturalWidth} ${naturalHeight}`}
      preserveAspectRatio="none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* dim everything outside the polygon */}
      <path
        d={`M0 0 H${naturalWidth} V${naturalHeight} H0 Z ${pathD}`}
        fillRule="evenodd"
        className="bpt-editor-dim"
      />
      {/* draggable body fill */}
      <path d={pathD} className="bpt-editor-fill" onPointerDown={handlePointerDownBody} />
      <path d={pathD} className="bpt-editor-outline" />

      {/* edge midpoint "add point" markers */}
      {points.map((p, i) => {
        const next = points[(i + 1) % points.length];
        const mx = (p.x + next.x) / 2;
        const my = (p.y + next.y) / 2;
        return (
          <g key={`mid-${i}`} className="bpt-editor-addpoint" onPointerDown={(e) => e.stopPropagation()} onClick={() => addPointAt(i)}>
            <circle cx={mx} cy={my} r={MID_R} />
            <line x1={mx - 3} y1={my} x2={mx + 3} y2={my} />
            <line x1={mx} y1={my - 3} x2={mx} y2={my + 3} />
          </g>
        );
      })}

      {/* vertex handles */}
      {points.map((p, i) => (
        <g key={`pt-${i}`}>
          <circle
            cx={p.x}
            cy={p.y}
            r={HANDLE_R}
            className={p.corner ? 'bpt-editor-handle bpt-editor-handle--corner' : 'bpt-editor-handle'}
            onPointerDown={(e) => handlePointerDownVertex(e, i)}
            onDoubleClick={() => removePoint(i)}
          />
          {!p.corner && (
            <text x={p.x} y={p.y + 1} className="bpt-editor-handle-x" onPointerDown={(e) => e.stopPropagation()} onClick={() => removePoint(i)}>
              ×
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

interface Point2 {
  x: number;
  y: number;
}
