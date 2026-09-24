import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { detailRows } from '@/components/ShopCatalog';
import { products } from '@/lib/products';
import type { Product } from '@/lib/products';

// ShopCatalog reads the URL via useSearchParams (App Router). Rather than pull
// in a full router-mocking package, this stubs next/navigation directly and
// lets each test control the current search params.
let mockParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockParams,
}));

import ShopCatalog from '@/components/ShopCatalog';

describe('detailRows (pure helper)', () => {
  const base: Product = {
    id: 'x', category: ['roller'], name: 'X', scene: 'scene--x', badge: '', tags: [], desc: '',
  };

  it('describes a custom-printed, blackout, motorized product correctly', () => {
    const rows = detailRows({ ...base, tags: ['custom-print', 'blackout', 'motorized', 'custom-size'] });
    const labels = rows.map(([label]) => label);
    expect(labels).toContain('Print Type');
    expect(labels).toContain('Light Control');
    expect(labels).toContain('Operation');
    expect(labels).toContain('Smart Home');
    expect(labels).toContain('Sizing');
    const operation = rows.find(([label]) => label === 'Operation');
    expect(operation?.[1]).toMatch(/motorized/i);
  });

  it('describes a plain manual, light-filtering product correctly', () => {
    const rows = detailRows({ ...base, tags: ['light-filter'] });
    const operation = rows.find(([label]) => label === 'Operation');
    expect(operation?.[1]).toMatch(/manual/i);
    const light = rows.find(([label]) => label === 'Light Control');
    expect(light?.[1]).toMatch(/light filtering/i);
  });

  it('returns no rows for a product with no relevant tags', () => {
    const rows = detailRows({ ...base, tags: [] });
    // still gets the default "Operation: Manual" row even with zero tags
    expect(rows.some(([label]) => label === 'Operation')).toBe(true);
    expect(rows.some(([label]) => label === 'Print Type')).toBe(false);
  });
});

describe('ShopCatalog component', () => {
  beforeEach(() => {
    mockParams = new URLSearchParams();
  });

  // Several product names (e.g. "Zebra Blinds", "Roller Blinds") are also the
  // exact label text of the shop-tab filter buttons, so plain getByText is
  // ambiguous — product names render as <h3 className="pcard__name">, so
  // scoping to the heading role disambiguates them from the tab/filter chips.
  function productHeading(name: string) {
    return screen.getByRole('heading', { level: 3, name });
  }
  function queryProductHeading(name: string) {
    return screen.queryByRole('heading', { level: 3, name });
  }

  it('renders all products by default (tab=all, filter=all)', () => {
    render(<ShopCatalog />);
    products.forEach((p) => {
      expect(productHeading(p.name)).toBeInTheDocument();
    });
  });

  it('filters to only Zebra products when the URL has ?tab=zebra', () => {
    mockParams = new URLSearchParams('tab=zebra');
    render(<ShopCatalog />);
    expect(productHeading('Zebra Blinds')).toBeInTheDocument();
    expect(productHeading('Custom Design Zebra Blinds')).toBeInTheDocument();
    expect(queryProductHeading('Roller Blinds')).not.toBeInTheDocument();
  });

  it('ignores an unrecognized ?tab value and falls back to "all"', () => {
    mockParams = new URLSearchParams('tab=not-a-real-tab');
    render(<ShopCatalog />);
    // falls back to showing everything rather than an empty/broken state
    expect(productHeading('Custom Printed Roller Blinds')).toBeInTheDocument();
  });

  it('clicking a tab button filters the visible products', async () => {
    const user = userEvent.setup();
    render(<ShopCatalog />);
    await user.click(screen.getByRole('button', { name: 'Zebra Blinds' }));
    expect(queryProductHeading('Roller Blinds')).not.toBeInTheDocument();
    expect(productHeading('Zebra Blinds')).toBeInTheDocument();
  });

  it('shows the "no products match" empty state and can clear filters', async () => {
    const user = userEvent.setup();
    render(<ShopCatalog />);
    // Combine a tab and filter that share no products
    await user.click(screen.getByRole('button', { name: 'Zebra Blinds' }));
    await user.click(screen.getByRole('button', { name: 'Large Windows' }));
    expect(screen.getByText(/no products match/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /clear all filters/i }));
    expect(productHeading('Custom Printed Roller Blinds')).toBeInTheDocument();
  });

  it('"View Details" links to that product\'s dedicated detail page', () => {
    render(<ShopCatalog />);
    const links = screen.getAllByRole('link', { name: 'View Details' });
    expect(links.length).toBe(products.length);
    // Spot-check one specific product resolves to its own URL, not a shared modal.
    const zebraCard = productHeading('Zebra Blinds').closest('.pcard')!;
    expect(within(zebraCard).getByRole('link', { name: 'View Details' })).toHaveAttribute('href', '/shop/zebra-plain');
  });
});
