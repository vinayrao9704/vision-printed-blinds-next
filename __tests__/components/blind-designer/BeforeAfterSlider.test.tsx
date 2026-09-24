import { render, screen, fireEvent } from '@testing-library/react';
import BeforeAfterSlider from '@/components/blind-designer/BeforeAfterSlider';

describe('BeforeAfterSlider', () => {
  const props = { beforeSrc: '/before.jpg', afterSrc: '/after.jpg', aspectRatio: 16 / 9 };

  it('renders both the before and after images with correct sources', () => {
    render(<BeforeAfterSlider {...props} />);
    expect(screen.getByAltText('Original room')).toHaveAttribute('src', '/before.jpg');
    expect(screen.getByAltText('Custom blind preview')).toHaveAttribute('src', '/after.jpg');
  });

  it('renders BEFORE and AFTER tags', () => {
    render(<BeforeAfterSlider {...props} />);
    expect(screen.getByText('BEFORE')).toBeInTheDocument();
    expect(screen.getByText('AFTER')).toBeInTheDocument();
  });

  it('starts the divider at the 50% midpoint', () => {
    const { container } = render(<BeforeAfterSlider {...props} />);
    const divider = container.querySelector('.bpt-compare__divider') as HTMLElement;
    expect(divider.style.left).toBe('50%');
  });

  it('dragging the divider moves it to the pointer position', () => {
    const { container } = render(<BeforeAfterSlider {...props} />);
    const wrap = container.querySelector('.bpt-compare') as HTMLElement;
    wrap.getBoundingClientRect = () => ({
      left: 0, right: 400, top: 0, bottom: 200, width: 400, height: 200, x: 0, y: 0, toJSON() {},
    });

    // Drag to 25% of the 400px-wide wrapper (x=100)
    fireEvent.pointerDown(wrap, { clientX: 100, pointerId: 1 });

    const divider = container.querySelector('.bpt-compare__divider') as HTMLElement;
    expect(divider.style.left).toBe('25%');
  });

  it('clamps the divider to 0-100% even if dragged past the edges', () => {
    const { container } = render(<BeforeAfterSlider {...props} />);
    const wrap = container.querySelector('.bpt-compare') as HTMLElement;
    wrap.getBoundingClientRect = () => ({
      left: 0, right: 400, top: 0, bottom: 200, width: 400, height: 200, x: 0, y: 0, toJSON() {},
    });

    fireEvent.pointerDown(wrap, { clientX: -200, pointerId: 1 });
    const divider = container.querySelector('.bpt-compare__divider') as HTMLElement;
    expect(divider.style.left).toBe('0%');
  });
});
