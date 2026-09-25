import { render, screen, within } from '@testing-library/react';
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

  it('renders the header nav items in the required order, with no Shop Blinds or Contact item', () => {
    render(<Nav />);
    const nav = document.getElementById('navLinks')!;
    const labels = Array.from(nav.querySelectorAll(':scope > li')).map(
      (li) => li.querySelector(':scope > a, :scope > button')?.textContent?.trim()
    );
    expect(labels).toEqual(['Blinds', 'Shades', 'Curtains & Drapes', 'Custom Printed Blinds', 'Gallery', 'Measuring Guide', 'About']);
    expect(screen.queryByText('Shop Blinds')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Contact' })).not.toBeInTheDocument();
  });

  it('shows a dropdown trigger button (not a link) for each category with children', () => {
    render(<Nav />);
    ['Blinds', 'Shades', 'Curtains & Drapes', 'Custom Printed Blinds'].forEach((label) => {
      expect(screen.getByRole('button', { name: new RegExp(`^${label}`) })).toBeInTheDocument();
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

    await user.click(screen.getByRole('link', { name: 'Home' }));
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

  it('the Blinds dropdown contains its sub-category links', () => {
    render(<Nav />);
    const zebraLink = screen.getByRole('link', { name: 'Zebra Blinds' });
    expect(zebraLink).toHaveAttribute('href', '/products/zebra-blinds');
  });

  it('clicking a dropdown trigger opens it, and clicking one of its links closes it again', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const blindsTrigger = screen.getByRole('button', { name: /^Blinds/ });
    await user.click(blindsTrigger);
    expect(blindsTrigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('link', { name: 'Zebra Blinds' }));
    expect(blindsTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('only one dropdown is open at a time', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const blindsTrigger = screen.getByRole('button', { name: /^Blinds/ });
    const shadesTrigger = screen.getByRole('button', { name: /^Shades/ });

    await user.click(blindsTrigger);
    expect(blindsTrigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(shadesTrigger);
    expect(shadesTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(blindsTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking outside an open dropdown closes it', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const blindsTrigger = screen.getByRole('button', { name: /^Blinds/ });
    await user.click(blindsTrigger);
    expect(blindsTrigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(document.body);
    expect(blindsTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('mobile accordion: tapping an open section\'s header again actually closes it', async () => {
    const user = userEvent.setup();
    render(<Nav />);
    await user.click(screen.getByRole('button', { name: /toggle menu/i }));

    const mobileNav = document.querySelector('.nav__mobile') as HTMLElement;
    const blindsHeader = within(mobileNav).getByRole('button', { name: /^Blinds/ });

    await user.click(blindsHeader);
    expect(blindsHeader).toHaveAttribute('aria-expanded', 'true');

    await user.click(blindsHeader);
    expect(blindsHeader).toHaveAttribute('aria-expanded', 'false');
  });
});
