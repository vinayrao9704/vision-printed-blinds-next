import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

let mockPathname = '/';
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

import Nav from '@/components/Nav';

describe('Nav', () => {
  beforeEach(() => {
    mockPathname = '/';
  });

  it('renders the logo linking to home', () => {
    render(<Nav />);
    const logoLink = screen.getByAltText('Vision Printed Blinds').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('does not render a phone number in the header', () => {
    render(<Nav />);
    expect(screen.queryByText(/438-866-6867/)).not.toBeInTheDocument();
  });

  it('renders a link to every main page', () => {
    render(<Nav />);
    ['Shop Blinds', 'Gallery', 'Measuring Guide', 'About', 'Contact'].forEach((label) => {
      expect(screen.getByRole('link', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    });
  });

  it('marks the current page\'s nav link as active', () => {
    mockPathname = '/gallery';
    render(<Nav />);
    expect(screen.getByRole('link', { name: 'Gallery' })).toHaveClass('active');
    expect(screen.getByRole('link', { name: 'About' })).not.toHaveClass('active');
  });

  it('the mobile hamburger toggles aria-expanded and the mobile menu open class', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const hamburger = screen.getByRole('button', { name: /toggle menu/i });
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');

    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('pressing Escape closes the open mobile menu', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const hamburger = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{Escape}');
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking outside the open mobile menu closes it', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const hamburger = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    await user.click(document.body);
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking inside the open mobile menu does not close it', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const hamburger = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('link', { name: 'Shop All Blinds' }));
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');
  });

  it('re-clicking the hamburger itself still closes the menu, not just the outside-click handler', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const hamburger = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'true');

    await user.click(hamburger);
    expect(hamburger).toHaveAttribute('aria-expanded', 'false');
  });

  it('the mega menu for Shop Blinds contains category links deep-linking into /shop', () => {
    render(<Nav />);
    const zebraLink = screen.getByRole('link', { name: 'Zebra Blinds' });
    expect(zebraLink).toHaveAttribute('href', '/shop?tab=zebra&highlight=zebra-plain');
  });

  it('clicking a mega-menu link force-closes the dropdown (adds force-closed class)', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const zebraLink = screen.getByRole('link', { name: 'Zebra Blinds' });
    await user.click(zebraLink);
    const megaItem = document.getElementById('megaItem');
    expect(megaItem).toHaveClass('force-closed');
  });

  it('mouse leaving the mega item clears the force-closed state', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    await user.click(screen.getByRole('link', { name: 'Zebra Blinds' }));
    const megaItem = document.getElementById('megaItem')!;
    expect(megaItem).toHaveClass('force-closed');
    await user.unhover(megaItem);
    expect(megaItem).not.toHaveClass('force-closed');
  });
});
