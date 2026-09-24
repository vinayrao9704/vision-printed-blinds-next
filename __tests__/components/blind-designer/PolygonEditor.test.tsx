import { render, fireEvent } from '@testing-library/react';
import PolygonEditor from '@/components/blind-designer/PolygonEditor';
import type { EditPoint } from '@/components/blind-designer/types';

// NOTE: the editor's handles/add-point markers are SVG <circle>/<g> elements
// with onClick handlers but no role or keyboard support (no tabIndex/keydown
// handler) — there's no accessible-role query that fits, and it's a real
// keyboard-accessibility gap worth fixing separately. Flagged in the test
// report rather than queried around silently.

function squarePoints(): EditPoint[] {
  return [
    { x: 10, y: 10, corner: true },
    { x: 90, y: 10, corner: true },
    { x: 90, y: 90, corner: true },
    { x: 10, y: 90, corner: true },
  ];
}

describe('PolygonEditor', () => {
  it('renders exactly one handle per point (4 for a plain quad)', () => {
    const { container } = render(
      <PolygonEditor points={squarePoints()} onChange={jest.fn()} naturalWidth={100} naturalHeight={100} />
    );
    expect(container.querySelectorAll('.bpt-editor-handle')).toHaveLength(4);
    expect(container.querySelectorAll('.bpt-editor-handle--corner')).toHaveLength(4);
  });

  it('renders one add-point marker per edge (4 for a quad)', () => {
    const { container } = render(
      <PolygonEditor points={squarePoints()} onChange={jest.fn()} naturalWidth={100} naturalHeight={100} />
    );
    expect(container.querySelectorAll('.bpt-editor-addpoint')).toHaveLength(4);
  });

  it('clicking an add-point marker calls onChange with 5 points (one new, non-corner)', () => {
    const onChange = jest.fn();
    const { container } = render(
      <PolygonEditor points={squarePoints()} onChange={onChange} naturalWidth={100} naturalHeight={100} />
    );
    const firstMidpoint = container.querySelectorAll('.bpt-editor-addpoint')[0];
    fireEvent.click(firstMidpoint);

    expect(onChange).toHaveBeenCalledTimes(1);
    const newPoints: EditPoint[] = onChange.mock.calls[0][0];
    expect(newPoints).toHaveLength(5);
    expect(newPoints.filter((p) => p.corner)).toHaveLength(4);
    expect(newPoints.filter((p) => !p.corner)).toHaveLength(1);
  });

  it('does not add a point beyond the 8-point cap', () => {
    const onChange = jest.fn();
    const eightPoints: EditPoint[] = [
      ...squarePoints(),
      { x: 50, y: 10, corner: false },
      { x: 90, y: 50, corner: false },
      { x: 50, y: 90, corner: false },
      { x: 10, y: 50, corner: false },
    ];
    const { container } = render(
      <PolygonEditor points={eightPoints} onChange={onChange} naturalWidth={100} naturalHeight={100} />
    );
    const firstMidpoint = container.querySelectorAll('.bpt-editor-addpoint')[0];
    fireEvent.click(firstMidpoint);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('double-clicking a corner handle does not remove it (corners are permanent)', () => {
    const onChange = jest.fn();
    const { container } = render(
      <PolygonEditor points={squarePoints()} onChange={onChange} naturalWidth={100} naturalHeight={100} />
    );
    const cornerHandle = container.querySelector('.bpt-editor-handle--corner')!;
    fireEvent.doubleClick(cornerHandle);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('double-clicking a non-corner (mask-only) point removes it', () => {
    const onChange = jest.fn();
    const withExtra: EditPoint[] = [...squarePoints(), { x: 50, y: 10, corner: false }];
    const { container } = render(
      <PolygonEditor points={withExtra} onChange={onChange} naturalWidth={100} naturalHeight={100} />
    );
    const nonCornerHandle = container.querySelectorAll('.bpt-editor-handle:not(.bpt-editor-handle--corner)')[0];
    fireEvent.doubleClick(nonCornerHandle);
    expect(onChange).toHaveBeenCalledWith(squarePoints());
  });
});
