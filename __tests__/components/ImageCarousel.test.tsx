import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageCarousel from '@/components/ImageCarousel';

const slides = [
  { alt: 'Slide one', scene: 'scene--room-living' },
  { alt: 'Slide two', scene: 'scene--room-bedroom' },
  { alt: 'Slide three', scene: 'scene--room-office' },
];

describe('ImageCarousel', () => {
  it('renders one slide per image and a dot indicator per slide', () => {
    render(<ImageCarousel slides={slides} />);
    slides.forEach((s) => expect(screen.getByRole('img', { name: s.alt })).toBeInTheDocument());
    expect(screen.getAllByRole('tab')).toHaveLength(slides.length);
  });

  it('the first dot is active by default and the previous arrow is disabled', () => {
    render(<ImageCarousel slides={slides} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('button', { name: /previous image/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next image/i })).not.toBeDisabled();
  });

  it('clicking a dot calls scrollIntoView on the matching slide', async () => {
    const user = userEvent.setup();
    render(<ImageCarousel slides={slides} />);
    const scrollIntoView = jest.fn();
    document.querySelectorAll('.img-carousel__slide').forEach((el) => {
      (el as HTMLElement).scrollIntoView = scrollIntoView;
    });

    await user.click(screen.getAllByRole('tab')[2]);
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it('clicking the next arrow scrolls toward the next slide', async () => {
    const user = userEvent.setup();
    render(<ImageCarousel slides={slides} />);
    const scrollIntoView = jest.fn();
    document.querySelectorAll('.img-carousel__slide').forEach((el) => {
      (el as HTMLElement).scrollIntoView = scrollIntoView;
    });

    await user.click(screen.getByRole('button', { name: /next image/i }));
    expect(scrollIntoView).toHaveBeenCalled();
  });
});
