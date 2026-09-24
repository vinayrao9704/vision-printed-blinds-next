require('@testing-library/jest-dom');
const { toHaveNoViolations } = require('jest-axe');
expect.extend(toHaveNoViolations);

// jsdom doesn't implement these — several components use them (ScrollReveal's
// IntersectionObserver, PolygonEditor's ResizeObserver + SVG CTM math, canvas
// drawing in the blind preview tool). Lightweight stubs so components can
// mount and run their effects without crashing; tests that need specific
// callback behavior override these per-test.
global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom's SVG support doesn't implement getScreenCTM/createSVGPoint (used by
// PolygonEditor for pointer-to-viewBox coordinate math).
if (typeof SVGElement !== 'undefined') {
  SVGElement.prototype.getScreenCTM = SVGElement.prototype.getScreenCTM || (() => ({
    inverse: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
  }));
  SVGSVGElement.prototype.createSVGPoint = SVGSVGElement.prototype.createSVGPoint || (function () {
    return {
      x: 0,
      y: 0,
      matrixTransform() { return { x: this.x, y: this.y }; },
    };
  });
}

// jsdom has no canvas backend; stub the 2D context surface the app's drawing
// code calls so components that touch <canvas> don't throw during tests that
// don't specifically assert on pixel output.
// jsdom has no PointerEvent implementation at all (confirmed empirically —
// `typeof window.PointerEvent === 'undefined'`), so fireEvent.pointerDown/etc.
// in tests can't construct a real one and clientX/pointerId are lost. Polyfill
// it as a thin MouseEvent subclass so drag-based components (BeforeAfterSlider,
// PolygonEditor) receive the coordinates their handlers read from the event.
if (typeof window !== 'undefined' && typeof window.PointerEvent === 'undefined') {
  class PointerEventPolyfill extends MouseEvent {
    constructor(type, params = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 0;
      this.pointerType = params.pointerType ?? 'mouse';
      this.isPrimary = params.isPrimary ?? true;
    }
  }
  window.PointerEvent = PointerEventPolyfill;
  global.PointerEvent = PointerEventPolyfill;
}

// jsdom doesn't implement the Pointer Events capture API, used by the before/
// after slider and the window-outline polygon editor for drag interactions.
if (typeof Element !== 'undefined') {
  Element.prototype.setPointerCapture = Element.prototype.setPointerCapture || (() => {});
  Element.prototype.releasePointerCapture = Element.prototype.releasePointerCapture || (() => {});
  Element.prototype.hasPointerCapture = Element.prototype.hasPointerCapture || (() => false);
}

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = HTMLCanvasElement.prototype.getContext || (() => ({
    fillRect: () => {}, clearRect: () => {}, strokeRect: () => {},
    beginPath: () => {}, moveTo: () => {}, lineTo: () => {}, closePath: () => {},
    clip: () => {}, save: () => {}, restore: () => {}, stroke: () => {}, fill: () => {},
    arc: () => {}, ellipse: () => {}, quadraticCurveTo: () => {}, setLineDash: () => {},
    drawImage: () => {}, fillText: () => {}, translate: () => {}, scale: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    getImageData: () => ({ data: new Uint8ClampedArray(4), width: 1, height: 1 }),
    putImageData: () => {},
    measureText: () => ({ width: 0 }),
  }));
  HTMLCanvasElement.prototype.toDataURL = HTMLCanvasElement.prototype.toDataURL || (() => 'data:image/png;base64,');
}
