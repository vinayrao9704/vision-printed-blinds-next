import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GalleryGrid from '@/components/GalleryGrid';

describe('GalleryGrid', () => {
  it('renders all 17 gallery items by default', () => {
    render(<GalleryGrid />);
    expect(screen.getByText('Rocky Mountain Sunrise')).toBeInTheDocument();
    expect(screen.getByText('Solar Shade Living Room')).toBeInTheDocument();
    expect(screen.getByText('Radha Krishna Devotional Print')).toBeInTheDocument();
    expect(screen.getByText('A Little Angel')).toBeInTheDocument();
    expect(screen.getByText('A Whole Lot of Love')).toBeInTheDocument();
  });

  it('filters to the Spiritual & Religious category', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);
    await user.click(screen.getByRole('button', { name: 'Spiritual & Religious' }));
    expect(screen.getByText('Radha Krishna Devotional Print')).toBeInTheDocument();
    expect(screen.queryByText('Rocky Mountain Sunrise')).not.toBeInTheDocument();
  });

  it('renders a real photo (not the CSS scene illustration) for items with an uploaded image', () => {
    render(<GalleryGrid />);
    const img = screen.getByAltText('Custom Kids Name Design');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', expect.stringContaining('kids-graffiti-boy.jpg'));
  });

  it('sizes a photo box to the image\'s own aspect ratio instead of cropping it (no fixed height, no fill)', () => {
    render(<GalleryGrid />);
    const img = screen.getByAltText('A Little Angel') as HTMLImageElement;
    // next/image only sets width/height attributes when NOT using `fill` —
    // their presence here confirms the box grows to the photo instead of
    // being force-cropped into the placeholder's fixed 200px/300px height.
    expect(img).toHaveAttribute('width', '1024');
    expect(img).toHaveAttribute('height', '1536');
    expect(img.closest('.gallery-item__visual')).toHaveClass('gallery-item__visual--photo');
  });

  it('portals the lightbox to document.body (stays visible above the masonry grid regardless of stacking quirks there)', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);
    await user.click(screen.getByText('Sunflower Field'));
    const dialog = screen.getByRole('dialog');
    expect(dialog.closest('.gallery-masonry')).toBeNull();
    expect(dialog.parentElement).toBe(document.body);
  });

  it('filters items by category', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);
    await user.click(screen.getByRole('button', { name: 'Mountain & Nature' }));
    expect(screen.getByText('Rocky Mountain Sunrise')).toBeInTheDocument();
    expect(screen.getByText('Lake Louise')).toBeInTheDocument();
    expect(screen.getByText('Canadian Rockies')).toBeInTheDocument();
    expect(screen.queryByText('Tropical Paradise')).not.toBeInTheDocument();
  });

  it('the lightbox is closed (aria-hidden) until an item is clicked', () => {
    render(<GalleryGrid />);
    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toHaveAttribute('aria-hidden', 'true');
  });

  it('clicking a gallery item opens the lightbox with that item', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);
    await user.click(screen.getByText('Sunflower Field'));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByText('Sunflower Field', { selector: '.lightbox__caption' })).toBeInTheDocument();
  });

  it('the close button closes the lightbox', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);
    await user.click(screen.getByText('Sunflower Field'));
    await user.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
  });

  it('next/prev buttons cycle through the currently filtered items and wrap around', async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);
    await user.click(screen.getByText('Rocky Mountain Sunrise')); // first item overall
    await user.click(screen.getByRole('button', { name: /previous image/i })); // wraps to last item
    expect(screen.getByText('A Whole Lot of Love', { selector: '.lightbox__caption' })).toBeInTheDocument();
  });
});
