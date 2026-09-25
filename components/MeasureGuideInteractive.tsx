'use client';

import { useState } from 'react';
import Link from 'next/link';

type Mount = 'inside' | 'outside';

const insideSteps = [
  { title: 'Measure Casing Width', text: 'Measure the exact width inside the casing at 3 spots: top, middle, and bottom. Record the smallest width — this is what your blind will be cut to.' },
  { title: 'Measure Casing Height', text: 'Measure the exact height inside the casing at 3 spots: left, middle, and right. Record the largest height, so the blind fully covers the window.' },
  { title: 'Verify Casing Depth', text: 'Measure the depth of your recess. Required minimum depth depends on your blind type — check it below before ordering.' },
];

const outsideSteps = [
  { title: 'Decide Your Overlap', text: 'Outside mount blinds hang on the wall or trim outside the window. Add roughly 2–4" of overlap on each side of the opening for better light control and privacy.' },
  { title: 'Measure Total Width', text: 'Measure the full width you want the blind to cover, including your chosen overlap on both sides.' },
  { title: 'Measure Drop Height', text: 'Measure from where the top of the blind will mount down to where you want it to end — typically 3–4" below the sill, or to the floor.' },
];

const rules = [
  'Always use a heavy metal/steel tape measure. Never use a flexible fabric tape ruler.',
  'Measure down to the nearest 1/8th of an inch. Do not round up or down to whole inches.',
  'Write down dimensions as Width x Height (W x H) to avoid ordering inverted blinds.',
  'Measure at three points, not one — frames are rarely perfectly straight.',
];

const blindTypes = [
  'Roller Blinds', 'Zebra Blinds', 'Blackout Blinds', 'Solar Shades',
  'Cellular / Honeycomb Shades', 'Roman Shades', 'Vertical Blinds', 'Motorized Blinds',
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="mg-check-icon">
      <circle cx="10" cy="10" r="10" fill="#16A34A" />
      <path d="M6 10.2l2.4 2.4L14 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="mg-rule-icon">
      <path d="M4 2l4 4-4 4" stroke="var(--gold-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Arrowhead-tipped measurement line, drawn between two points with a label at its midpoint. */
function MeasureLine({ x1, y1, x2, y2, label, labelDx = 0, labelDy = -6 }: { x1: number; y1: number; x2: number; y2: number; label: string; labelDx?: number; labelDy?: number }) {
  const mx = (x1 + x2) / 2 + labelDx;
  const my = (y1 + y2) / 2 + labelDy;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#16A34A" strokeWidth="1.5" markerStart="url(#mgArrow)" markerEnd="url(#mgArrow)" />
      <rect x={mx - label.length * 3} y={my - 8} width={label.length * 6} height={14} fill="#16A34A" rx="3" />
      <text x={mx} y={my + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill="white">{label}</text>
    </g>
  );
}

/** A pill-labeled measurement line that can run horizontally or vertically (rotates its label to match). */
function OverallMeasureLine({ x1, y1, x2, y2, label, vertical = false }: { x1: number; y1: number; x2: number; y2: number; label: string; vertical?: boolean }) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const w = label.length * 6 + 10;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#16A34A" strokeWidth="1.5" markerStart="url(#mgArrow3)" markerEnd="url(#mgArrow3)" />
      <g transform={vertical ? `rotate(90 ${mx} ${my})` : undefined}>
        <rect x={mx - w / 2} y={my - 8} width={w} height={16} fill="#16A34A" rx="3" />
        <text x={mx} y={my + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="white">{label}</text>
      </g>
    </g>
  );
}

/** Small diagonal double-headed "resize" arrow marking a corner's clearance. */
function CornerArrow({ cx, cy, mirrored = false }: { cx: number; cy: number; mirrored?: boolean }) {
  const [dx, dy] = mirrored ? [9, -9] : [9, 9];
  return (
    <line
      x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy}
      stroke="var(--text-xlight)" strokeWidth="1.6"
      markerStart="url(#mgArrowGray)" markerEnd="url(#mgArrowGray)"
    />
  );
}

function InsideDiagram() {
  return (
    <svg viewBox="0 0 320 320" className="mg-diagram-svg">
      <defs>
        <marker id="mgArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#16A34A" />
        </marker>
        <marker id="mgArrowGray" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--text-xlight)" />
        </marker>
      </defs>
      <rect x="8" y="8" width="304" height="304" rx="14" fill="var(--surface-2)" stroke="var(--border-dark)" strokeWidth="2" />
      <rect x="40" y="40" width="240" height="240" rx="4" fill="#DCEEFB" />
      {/* corner clearance arrows */}
      <CornerArrow cx={40} cy={40} />
      <CornerArrow cx={280} cy={40} mirrored />
      <CornerArrow cx={40} cy={280} mirrored />
      <CornerArrow cx={280} cy={280} />
      <MeasureLine x1={40} y1={64} x2={280} y2={64} label="Width Top" />
      <MeasureLine x1={40} y1={160} x2={280} y2={160} label="Width Mid" labelDy={14} />
      <MeasureLine x1={40} y1={256} x2={280} y2={256} label="Width Bot" labelDy={14} />
      <MeasureLine x1={80} y1={40} x2={80} y2={280} label="Height L" labelDx={-24} />
      <MeasureLine x1={160} y1={40} x2={160} y2={280} label="Height M" labelDx={24} />
      <MeasureLine x1={240} y1={40} x2={240} y2={280} label="Height R" labelDx={24} />
    </svg>
  );
}

function OutsideDiagram() {
  return (
    <svg viewBox="0 0 320 320" className="mg-diagram-svg">
      <defs>
        <marker id="mgArrow3" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#16A34A" />
        </marker>
      </defs>
      <rect x="8" y="8" width="304" height="304" rx="14" fill="var(--surface-2)" stroke="var(--border-dark)" strokeWidth="2" />
      {/* window frame with 4 panes */}
      <rect x="70" y="70" width="180" height="180" fill="none" stroke="var(--border-dark)" strokeWidth="3" />
      <rect x="74" y="74" width="84" height="84" fill="#DCEEFB" />
      <rect x="162" y="74" width="84" height="84" fill="#DCEEFB" />
      <rect x="74" y="162" width="84" height="84" fill="#DCEEFB" />
      <rect x="162" y="162" width="84" height="84" fill="#DCEEFB" />
      {/* outside-mount coverage area */}
      <rect x="40" y="40" width="240" height="240" rx="6" fill="none" stroke="#16A34A" strokeWidth="1.5" strokeDasharray="5 4" />
      <OverallMeasureLine x1={40} y1={26} x2={280} y2={26} label="Overall Width" />
      <OverallMeasureLine x1={294} y1={40} x2={294} y2={280} label="Overall Height" vertical />
    </svg>
  );
}

function StepList({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="mg-checksteps">
      {steps.map((s) => (
        <li key={s.title}>
          <CheckIcon />
          <div>
            <strong>{s.title}</strong>
            <p>{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function MeasureGuideInteractive() {
  const [mount, setMount] = useState<Mount>('inside');
  const [blindType, setBlindType] = useState('');

  return (
    <div className="mg-wrap">
      <div className="mg-toggle" role="tablist" aria-label="Mounting style">
        <button
          role="tab"
          aria-selected={mount === 'inside'}
          className={`mg-toggle__btn${mount === 'inside' ? ' active' : ''}`}
          onClick={() => setMount('inside')}
        >
          <svg viewBox="0 0 16 16" fill="none"><path d="M2 2h4M2 2v4M14 2h-4M14 2v4M2 14h4M2 14v-4M14 14h-4M14 14v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          Inside Mount Guide
        </button>
        <button
          role="tab"
          aria-selected={mount === 'outside'}
          className={`mg-toggle__btn${mount === 'outside' ? ' active' : ''}`}
          onClick={() => setMount('outside')}
        >
          <svg viewBox="0 0 16 16" fill="none"><path d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Outside Mount Guide
        </button>
      </div>

      <div className="mg-panel">
        <div className="mg-diagram-col">
          <h3 className="mg-diagram-title">{mount === 'inside' ? 'Inside Recess Measurements' : 'Outside Wall Measurements'}</h3>
          <div className="mg-diagram-divider"><span className="mg-diagram-dot" /></div>
          {mount === 'inside' ? <InsideDiagram /> : <OutsideDiagram />}
          <p className="mg-tip">💡 <strong>Tip:</strong> {mount === 'inside' ? 'Measure in three spots because frames are rarely perfectly straight.' : 'Mount higher and wider than the frame to make the window look larger and block more light around the edges.'}</p>
        </div>

        <div className="mg-steps-col">
          <h3>{mount === 'inside' ? 'Measuring for Inside Mount' : 'Measuring for Outside Mount'}</h3>
          <p className="mg-steps-intro">
            {mount === 'inside'
              ? 'Inside mount window treatments sit flush inside the window casing, showcasing your frame’s trim. They offer the cleanest, most built-in appearance.'
              : 'Outside mount blinds hang on the wall or trim above the window, covering the whole opening and then some — ideal for shallow recesses or maximum blackout.'}
          </p>

          <StepList steps={mount === 'inside' ? insideSteps : outsideSteps} />

          <div className="mg-rules">
            <h4>📏 General Measuring Rules</h4>
            <ul>
              {rules.map((r) => (
                <li key={r}><ChevronIcon /><span>{r}</span></li>
              ))}
            </ul>
          </div>

          {mount === 'inside' && (
            <div className="mg-depth-check">
              <h4>📐 Verify Casing Depth Requirements</h4>
              <p>Select your blind type to check what depth clearance you&apos;ll need.</p>
              <select className="mg-depth-select" value={blindType} onChange={(e) => setBlindType(e.target.value)} aria-label="Select your blind type">
                <option value="">Choose a blind type…</option>
                {blindTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {blindType && (
                <p className="mg-depth-result">
                  Minimum casing depth for <strong>{blindType}</strong> depends on the fabric and hardware you choose — <Link href="/quote">request your free estimate</Link> and we&apos;ll confirm your exact clearance before you order, or ask for a free in-person measurement.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
