'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { detectWindows } from '@/lib/windowDetection';
import { warpImageToQuad, type Point } from '@/lib/homography';
import type { EditPoint, WindowShape } from './types';
import PolygonEditor from './PolygonEditor';
import BeforeAfterSlider from './BeforeAfterSlider';

const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_BYTES = 20 * 1024 * 1024;
const RENDER_MAX_DIM = 1600;

export function validateFile(file: File): string | null {
  if (file.size === 0) return 'File is empty.';
  if (file.type && !VALID_TYPES.includes(file.type)) return 'Unsupported format. Please use JPG, PNG, or WEBP.';
  if (file.size > MAX_BYTES) return `Too large (${(file.size / 1048576).toFixed(1)} MB). Max is 20 MB.`;
  return null;
}

function loadImageFile(file: File, onLoad: (img: HTMLImageElement, src: string) => void, onError: (msg: string) => void) {
  const err = validateFile(file);
  if (err) {
    onError(err);
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => onError('Could not read this file.');
  reader.onload = (e) => {
    const src = e.target!.result as string;
    const img = new Image();
    img.onerror = () => onError('This file could not be loaded as an image.');
    img.onload = () => {
      if (img.naturalWidth < 20 || img.naturalHeight < 20) {
        onError('Image is too small.');
        return;
      }
      onLoad(img, src);
    };
    img.src = src;
  };
  reader.readAsDataURL(file);
}

export function defaultQuad(w: number, h: number): EditPoint[] {
  return [
    { x: w * 0.18, y: h * 0.12, corner: true },
    { x: w * 0.82, y: h * 0.12, corner: true },
    { x: w * 0.82, y: h * 0.85, corner: true },
    { x: w * 0.18, y: h * 0.85, corner: true },
  ];
}

export function corners4(points: EditPoint[]): [Point, Point, Point, Point] {
  const c = points.filter((p) => p.corner);
  return [c[0], c[1], c[2], c[3]];
}

export function lerp(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

let idCounter = 0;
function newId() {
  idCounter += 1;
  return `win-${idCounter}`;
}

/** Fine slat lines interpolated along the true window rectangle's edges — respects perspective automatically. */
function drawSlats(ctx: CanvasRenderingContext2D, corners: [Point, Point, Point, Point]) {
  const [tl, tr, br, bl] = corners;
  const steps = 16;
  ctx.save();
  ctx.strokeStyle = 'rgba(0,0,0,0.09)';
  ctx.lineWidth = 1;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const left = lerp(tl, bl, t);
    const right = lerp(tr, br, t);
    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.stroke();
  }
  ctx.restore();
}

/** Soft inset shadow ring just inside the mask boundary, via even-odd fill between the outline and a shrunk copy. */
function drawInnerShadow(ctx: CanvasRenderingContext2D, points: EditPoint[]) {
  const cx = points.reduce((a, p) => a + p.x, 0) / points.length;
  const cy = points.reduce((a, p) => a + p.y, 0) / points.length;
  const shrink = points.map((p) => ({ x: p.x + (cx - p.x) * 0.04, y: p.y + (cy - p.y) * 0.04 }));
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.20)';
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.closePath();
  shrink.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.closePath();
  ctx.fill('evenodd');
  ctx.restore();
}

/** Frame stroke + soft outward contact shadow, drawn outside the design clip so it reads as a real inset object. */
function drawFrameAndShadow(ctx: CanvasRenderingContext2D, points: EditPoint[]) {
  const path = new Path2D();
  points.forEach((p, i) => (i === 0 ? path.moveTo(p.x, p.y) : path.lineTo(p.x, p.y)));
  path.closePath();

  ctx.save();
  for (let i = 3; i >= 1; i--) {
    ctx.strokeStyle = `rgba(0,0,0,${0.05 * i})`;
    ctx.lineWidth = i * 2.5;
    ctx.stroke(path);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 1;
  ctx.stroke(path);
  ctx.strokeStyle = 'rgba(120,110,95,0.6)';
  ctx.lineWidth = 2;
  ctx.stroke(path);
  ctx.restore();
}

function sampleBrightness(data: Uint8ClampedArray, w: number, h: number, x: number, y: number): number {
  const xi = Math.max(0, Math.min(w - 1, Math.round(x)));
  const yi = Math.max(0, Math.min(h - 1, Math.round(y)));
  const i = (yi * w + xi) * 4;
  return data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
}

/** Nudges the warped design's brightness toward the room's ambient light near the window, capped so the design stays clearly visible. */
function matchLighting(ctx: CanvasRenderingContext2D, points: EditPoint[], roomData: Uint8ClampedArray, rw: number, rh: number) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const cy = ys.reduce((a, b) => a + b, 0) / ys.length;
  const bw = Math.max(...xs) - Math.min(...xs);
  const bh = Math.max(...ys) - Math.min(...ys);
  const ring = [
    { x: cx, y: Math.min(...ys) - 14 },
    { x: cx, y: Math.max(...ys) + 14 },
    { x: Math.min(...xs) - 14, y: cy },
    { x: Math.max(...xs) + 14, y: cy },
  ];
  let sum = 0;
  let n = 0;
  ring.forEach((p) => {
    if (p.x >= 0 && p.x < rw && p.y >= 0 && p.y < rh) {
      sum += sampleBrightness(roomData, rw, rh, p.x, p.y);
      n++;
    }
  });
  const roomAvg = n ? sum / n : 140;

  const designPixels = ctx.getImageData(Math.min(...xs), Math.min(...ys), Math.max(1, bw), Math.max(1, bh));
  let dSum = 0;
  let dN = 0;
  for (let i = 0; i < designPixels.data.length; i += 4 * 37) {
    if (designPixels.data[i + 3] > 10) {
      dSum += designPixels.data[i] * 0.299 + designPixels.data[i + 1] * 0.587 + designPixels.data[i + 2] * 0.114;
      dN++;
    }
  }
  const designAvg = dN ? dSum / dN : roomAvg;
  const diff = roomAvg - designAvg;
  const strength = Math.max(-0.14, Math.min(0.14, diff / 400));

  if (Math.abs(strength) > 0.01) {
    ctx.save();
    ctx.beginPath();
    points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = strength > 0 ? `rgba(255,255,255,${strength})` : `rgba(0,0,0,${-strength})`;
    ctx.fillRect(Math.min(...xs), Math.min(...ys), bw, bh);
    ctx.restore();
  }
}

export default function BlindPreviewTool() {
  const [roomImg, setRoomImg] = useState<HTMLImageElement | null>(null);
  const [roomSrc, setRoomSrc] = useState('');
  const [roomError, setRoomError] = useState('');

  const [designImg, setDesignImg] = useState<HTMLImageElement | null>(null);
  const [designSrc, setDesignSrc] = useState('');
  const [designError, setDesignError] = useState('');

  const [detectPhase, setDetectPhase] = useState<'idle' | 'loading' | 'done' | 'failed'>('idle');
  const [detectMessage, setDetectMessage] = useState('');
  const [windows, setWindows] = useState<WindowShape[]>([]);
  const [renderTarget, setRenderTarget] = useState<number | 'all'>(0);

  const [showReview, setShowReview] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [compareMode, setCompareMode] = useState(false);

  const roomInputId = 'bptRoomInput';
  const designInputId = 'bptDesignInput';
  const renderSeq = useRef(0);

  function resetAll() {
    setRoomImg(null);
    setRoomSrc('');
    setRoomError('');
    setDesignImg(null);
    setDesignSrc('');
    setDesignError('');
    setDetectPhase('idle');
    setDetectMessage('');
    setWindows([]);
    setRenderTarget(0);
    setShowReview(false);
    setReviewIndex(0);
    setEditingIndex(null);
    setResultUrl(null);
    setCompareMode(false);
  }

  function changeRoomPhoto() {
    setRoomImg(null);
    setRoomSrc('');
    setDetectPhase('idle');
    setWindows([]);
    setShowReview(false);
    setEditingIndex(null);
    setResultUrl(null);
  }

  function changeDesign() {
    setDesignImg(null);
    setDesignSrc('');
    setResultUrl(null);
  }

  function handleRoomFile(file: File) {
    loadImageFile(
      file,
      (img, src) => {
        setRoomImg(img);
        setRoomSrc(src);
        setRoomError('');
        setResultUrl(null);
        setWindows([]);
        setDetectPhase('loading');
        setShowReview(false);
        setEditingIndex(null);
      },
      setRoomError
    );
  }

  function handleDesignFile(file: File) {
    loadImageFile(
      file,
      (img, src) => {
        setDesignImg(img);
        setDesignSrc(src);
        setDesignError('');
      },
      setDesignError
    );
  }

  function fallbackToManual(message: string) {
    if (!roomImg) return;
    const pts = defaultQuad(roomImg.naturalWidth, roomImg.naturalHeight);
    setWindows([{ id: newId(), points: pts, original: pts.map((p) => ({ ...p })), score: null }]);
    setRenderTarget(0);
    setDetectMessage(message);
    setDetectPhase('failed');
    setEditingIndex(0);
  }

  // Run detection once a room photo is uploaded. detectWindows is a
  // dependency-free pure-JS/Canvas algorithm (see lib/windowDetection.ts) —
  // no network request, no WASM, so this reliably resolves in well under a
  // second with no risk of hanging the UI.
  useEffect(() => {
    if (!roomImg || detectPhase !== 'loading') return;
    let cancelled = false;

    (async () => {
      try {
        const candidates = await detectWindows(roomImg);
        if (cancelled) return;
        if (candidates.length > 0) {
          const shapes: WindowShape[] = candidates.map((c) => {
            const pts = c.quad.map((p) => ({ ...p, corner: true as const }));
            return { id: newId(), points: pts, original: pts.map((p) => ({ ...p })), score: c.score };
          });
          setWindows(shapes);
          setRenderTarget(0);
          setReviewIndex(0);
          setShowReview(true);
          setDetectPhase('done');
        } else {
          fallbackToManual("We couldn't confidently detect the window. Please outline the window manually.");
        }
      } catch {
        if (cancelled) return;
        fallbackToManual('Detection failed unexpectedly. Please outline the window manually.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roomImg, detectPhase]);

  const renderPreview = useCallback(async () => {
    if (!roomImg || !designImg || windows.length === 0) return;
    const seq = ++renderSeq.current;
    setRendering(true);

    const scale = Math.min(1, RENDER_MAX_DIM / Math.max(roomImg.naturalWidth, roomImg.naturalHeight));
    const cw = Math.round(roomImg.naturalWidth * scale);
    const ch = Math.round(roomImg.naturalHeight * scale);

    const canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(roomImg, 0, 0, cw, ch);
    const roomData = ctx.getImageData(0, 0, cw, ch).data;

    const designCanvas = document.createElement('canvas');
    designCanvas.width = designImg.naturalWidth;
    designCanvas.height = designImg.naturalHeight;
    designCanvas.getContext('2d')!.drawImage(designImg, 0, 0);

    const targets = renderTarget === 'all' ? windows : windows[renderTarget] ? [windows[renderTarget]] : [];

    for (const win of targets) {
      const scaledPoints: EditPoint[] = win.points.map((p) => ({ ...p, x: p.x * scale, y: p.y * scale }));
      const corners = corners4(scaledPoints);
      if (corners.some((c) => !c)) continue;

      const { imageData, offsetX, offsetY } = warpImageToQuad(designCanvas, corners);
      const temp = document.createElement('canvas');
      temp.width = imageData.width;
      temp.height = imageData.height;
      temp.getContext('2d')!.putImageData(imageData, 0, 0);

      ctx.save();
      ctx.beginPath();
      scaledPoints.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(temp, offsetX, offsetY);
      drawSlats(ctx, corners);
      matchLighting(ctx, scaledPoints, roomData, cw, ch);
      drawInnerShadow(ctx, scaledPoints);
      ctx.restore();

      drawFrameAndShadow(ctx, scaledPoints);
    }

    if (renderSeq.current === seq) {
      setResultUrl(canvas.toDataURL('image/png'));
      setRendering(false);
    }
  }, [roomImg, designImg, windows, renderTarget]);

  useEffect(() => {
    if (!roomImg || !designImg || windows.length === 0 || showReview) return;
    renderPreview();
  }, [roomImg, designImg, windows, renderTarget, showReview, renderPreview]);

  function updateWindowPoints(index: number, points: EditPoint[]) {
    setWindows((prev) => prev.map((w, i) => (i === index ? { ...w, points } : w)));
  }

  function resetShape(index: number) {
    const w = windows[index];
    if (!w) return;
    updateWindowPoints(index, w.original.map((p) => ({ ...p })));
  }

  function confirmReviewWindow() {
    const next = reviewIndex + 1;
    if (next >= windows.length) setShowReview(false);
    else setReviewIndex(next);
  }

  function adjustReviewWindow() {
    setEditingIndex(reviewIndex);
    setShowReview(false);
  }

  function finishEditing() {
    setEditingIndex(null);
    if (detectPhase === 'failed') setDetectPhase('done');
  }

  function skipReviewWindow() {
    setWindows((prev) => prev.filter((_, i) => i !== reviewIndex));
    if (reviewIndex >= windows.length - 1) setShowReview(windows.length - 1 > 0);
  }

  function handleDownload() {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.download = 'vision-printed-blinds-custom-preview.png';
    a.href = resultUrl;
    a.click();
  }

  const activeEditWindow = editingIndex !== null ? windows[editingIndex] : null;
  const reviewWindow = showReview ? windows[reviewIndex] : null;
  const readyForPreview = !!roomImg && windows.length > 0 && !showReview && editingIndex === null;

  return (
    <div className="bpt-layout">
      {/* ================= LEFT: Room photo + window detection ================= */}
      <div className="bpt-panel">
        <div className="bpt-panel__head">
          <div className="pt-step-num">1</div>
          <div>
            <h3>Your Room Photo</h3>
            <p>We&apos;ll automatically detect the window in it</p>
          </div>
        </div>

        {!roomSrc ? (
          <>
            <div
              className={`pt-upload-zone${roomError ? ' has-error' : ''}`}
              onClick={() => document.getElementById(roomInputId)?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) handleRoomFile(e.dataTransfer.files[0]);
              }}
            >
              <input
                type="file"
                id={roomInputId}
                accept="image/jpeg,image/png,image/webp"
                className="pt-upload-zone__input"
                aria-label="Upload a photo of your room"
                onChange={(e) => e.target.files?.[0] && handleRoomFile(e.target.files[0])}
              />
              <div className="pt-upload-zone__body">
                <div className="pt-upload-zone__icon">
                  <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8"/></svg>
                </div>
                <strong>Upload a photo of your room</strong>
                <span>JPG, PNG, or WEBP · Max 20MB</span>
              </div>
            </div>
            {roomError && (
              <div className="pt-upload-error">
                <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span>{roomError}</span>
              </div>
            )}
          </>
        ) : (
          <div className="bpt-room-stage">
            <div className="bpt-room-stage__frame">
              <img src={roomSrc} alt="Your room" className="bpt-room-stage__img" />

              {detectPhase === 'loading' && (
                <div className="bpt-detecting">
                  <div className="bpt-spinner" />
                  <span>Detecting your window…</span>
                </div>
              )}

              {reviewWindow && roomImg && (
                <WindowOutline points={reviewWindow.points} naturalWidth={roomImg.naturalWidth} naturalHeight={roomImg.naturalHeight} />
              )}

              {activeEditWindow && roomImg && editingIndex !== null && (
                <PolygonEditor
                  points={activeEditWindow.points}
                  onChange={(pts) => updateWindowPoints(editingIndex, pts)}
                  naturalWidth={roomImg.naturalWidth}
                  naturalHeight={roomImg.naturalHeight}
                />
              )}

              {readyForPreview &&
                roomImg &&
                windows.map((w, i) => {
                  if (renderTarget !== 'all' && renderTarget !== i) return null;
                  return <WindowOutline key={w.id} points={w.points} naturalWidth={roomImg.naturalWidth} naturalHeight={roomImg.naturalHeight} dim={false} />;
                })}
            </div>

            {/* Review prompt */}
            {reviewWindow && (
              <div className="bpt-review">
                <p className="bpt-review__title">
                  Is this your window?
                  {windows.length > 1 && <span className="bpt-review__count"> ({reviewIndex + 1} of {windows.length} detected)</span>}
                </p>
                <div className="bpt-review__btns">
                  <button className="btn btn--gold" onClick={confirmReviewWindow}>Confirm</button>
                  <button className="btn btn--outline-navy" onClick={adjustReviewWindow}>Adjust Window</button>
                  {windows.length > 1 && <button className="pt-reset-btn" onClick={skipReviewWindow}>Not a window, skip</button>}
                </div>
              </div>
            )}

            {/* Manual/failed detection notice */}
            {detectPhase === 'failed' && editingIndex !== null && (
              <div className="bpt-fallback-note">
                <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <span>{detectMessage}</span>
              </div>
            )}

            {/* Editing toolbar */}
            {editingIndex !== null && (
              <div className="bpt-review__btns">
                <button className="btn btn--gold" onClick={finishEditing}>Done Adjusting</button>
                <button className="pt-reset-btn" onClick={() => resetShape(editingIndex)}>Reset Shape</button>
              </div>
            )}

            {/* Ready-state controls */}
            {readyForPreview && (
              <>
                {windows.length > 1 && (
                  <div className="bpt-window-chips">
                    <span className="pt-room-label">Apply design to:</span>
                    <div className="pt-room-pills">
                      {windows.map((w, i) => (
                        <button key={w.id} className={`pt-room-pill${renderTarget === i ? ' active' : ''}`} onClick={() => setRenderTarget(i)}>
                          Window {i + 1}
                        </button>
                      ))}
                      <button className={`pt-room-pill${renderTarget === 'all' ? ' active' : ''}`} onClick={() => setRenderTarget('all')}>
                        All Windows
                      </button>
                    </div>
                  </div>
                )}
                <div className="bpt-review__btns">
                  {renderTarget !== 'all' && (
                    <button className="pt-reset-btn" onClick={() => setEditingIndex(renderTarget as number)}>Adjust Window</button>
                  )}
                  <button className="pt-reset-btn" onClick={changeRoomPhoto}>Change Room Photo</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ================= RIGHT: Design upload ================= */}
      <div className="bpt-panel">
        <div className="bpt-panel__head">
          <div className="pt-step-num">2</div>
          <div>
            <h3>Your Blind Design</h3>
            <p>Upload the artwork or pattern to print</p>
          </div>
        </div>

        <div
          className={`pt-upload-zone${designSrc ? ' has-file' : ''}${designError ? ' has-error' : ''}`}
          onClick={() => document.getElementById(designInputId)?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]) handleDesignFile(e.dataTransfer.files[0]);
          }}
        >
          <input
            type="file"
            id={designInputId}
            accept="image/jpeg,image/png,image/webp"
            className="pt-upload-zone__input"
            aria-label="Upload your blind design"
            onChange={(e) => e.target.files?.[0] && handleDesignFile(e.target.files[0])}
          />
          {!designSrc ? (
            <div className="pt-upload-zone__body">
              <div className="pt-upload-zone__icon">
                <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="8.5" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </div>
              <strong>Upload your blind design</strong>
              <span>JPG, PNG, or WEBP · High-resolution recommended</span>
            </div>
          ) : (
            <div className="pt-upload-zone__thumb" style={{ backgroundImage: `url(${designSrc})` }} />
          )}
        </div>
        {designError && (
          <div className="pt-upload-error">
            <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span>{designError}</span>
          </div>
        )}
        {designSrc && (
          <div className="bpt-review__btns">
            <button className="pt-reset-btn" onClick={changeDesign}>Change Design</button>
          </div>
        )}
      </div>

      {/* ================= BIG PREVIEW STAGE ================= */}
      <div className="bpt-stage">
        <h3 className="bpt-stage__title">Preview Your Custom Blind</h3>

        {!roomImg || !designImg ? (
          <div className="bpt-stage__placeholder">
            <p>{!roomImg ? 'Upload a room photo to get started.' : 'Now upload your design to generate the preview.'}</p>
          </div>
        ) : showReview || editingIndex !== null ? (
          <div className="bpt-stage__placeholder">
            <p>Confirm your window above to generate the preview.</p>
          </div>
        ) : (
          <>
            <div className="bpt-stage__viewport" style={{ ['--bpt-zoom' as string]: zoom / 100 }}>
              {rendering && !resultUrl && <div className="bpt-detecting"><div className="bpt-spinner" /><span>Generating preview…</span></div>}
              {resultUrl && roomImg && (
                compareMode ? (
                  <BeforeAfterSlider beforeSrc={roomSrc} afterSrc={resultUrl} aspectRatio={roomImg.naturalWidth / roomImg.naturalHeight} />
                ) : (
                  <img src={resultUrl} alt="Custom blind preview" className="bpt-stage__result" />
                )
              )}
            </div>

            <div className="bpt-toolbar">
              <div className="bpt-toolbar__zoom">
                <span>Zoom</span>
                <input type="range" min={100} max={250} step={10} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="preview-slider" />
                <span>{zoom}%</span>
              </div>
              <button className={`pt-reset-btn${compareMode ? ' active' : ''}`} onClick={() => setCompareMode((v) => !v)}>
                {compareMode ? 'Hide Before/After' : 'Before / After'}
              </button>
              <button className="pt-reset-btn" onClick={() => setZoom(100)}>Reset Zoom</button>
              <button className="pt-reset-btn" onClick={resetAll}>Reset Tool</button>
              <button className="btn btn--navy" onClick={handleDownload} disabled={!resultUrl}>Download Preview</button>
              <a href="/quote?ref=preview" className="btn btn--gold btn--animated">Add to Cart / Get Quote →</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Static, non-interactive outline used for the review prompt and the ready-state window highlight. */
function WindowOutline({ points, naturalWidth, naturalHeight, dim = true }: { points: EditPoint[]; naturalWidth: number; naturalHeight: number; dim?: boolean }) {
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  return (
    <svg className="bpt-editor-svg bpt-editor-svg--readonly" viewBox={`0 0 ${naturalWidth} ${naturalHeight}`} preserveAspectRatio="none">
      {dim && <path d={`M0 0 H${naturalWidth} V${naturalHeight} H0 Z ${pathD}`} fillRule="evenodd" className="bpt-editor-dim" />}
      <path d={pathD} className="bpt-editor-outline bpt-editor-outline--static" />
    </svg>
  );
}
