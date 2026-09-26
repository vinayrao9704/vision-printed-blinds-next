import { render, screen, within } from '@testing-library/react';
import ProductCategoryPage from '@/components/ProductCategoryPage';
import { getProductCategory } from '@/lib/productCategories';

describe('ProductCategoryPage (zebra-shades)', () => {
  const category = getProductCategory('zebra-shades')!;

  it('renders the hero title, tagline, and intro copy', () => {
    render(<ProductCategoryPage category={category} />);
    expect(screen.getByRole('heading', { level: 1, name: category.name })).toBeInTheDocument();
    expect(screen.getByText(category.heroIntro)).toBeInTheDocument();
  });

  it('renders a Get Your Free Estimate CTA in the hero linking to /quote', () => {
    render(<ProductCategoryPage category={category} />);
    const ctas = screen.getAllByRole('link', { name: 'Get Your Free Estimate' });
    expect(ctas.length).toBeGreaterThanOrEqual(2); // hero + closing CTA
    ctas.forEach((cta) => expect(cta).toHaveAttribute('href', '/quote'));
  });

  it('renders every type card with its title and description', () => {
    render(<ProductCategoryPage category={category} />);
    category.types.forEach((t) => {
      expect(screen.getByRole('heading', { name: t.title })).toBeInTheDocument();
      expect(screen.getByText(t.desc)).toBeInTheDocument();
    });
  });

  it('renders a colour swatch and label for every sample colour', () => {
    render(<ProductCategoryPage category={category} />);
    category.colours.forEach((c) => {
      expect(within(document.querySelector('.colour-swatches') as HTMLElement).getByText(c.name)).toBeInTheDocument();
    });
    expect(screen.getByText(/Many more colours and textures available/)).toBeInTheDocument();
  });

  it('renders every hardware/operating option group and its items', () => {
    render(<ProductCategoryPage category={category} />);
    category.hardware.forEach((h) => {
      const heading = screen.getByRole('heading', { name: h.title });
      const card = heading.closest('.vp-card') as HTMLElement;
      h.items.forEach((item) => expect(within(card).getByText(item)).toBeInTheDocument());
    });
  });

  it('renders the warranty heading and text', () => {
    render(<ProductCategoryPage category={category} />);
    expect(screen.getByRole('heading', { name: category.warrantyHeading })).toBeInTheDocument();
    expect(screen.getByText(category.warrantyText)).toBeInTheDocument();
  });

  it('renders the closing CTA banner heading', () => {
    render(<ProductCategoryPage category={category} />);
    expect(screen.getByRole('heading', { name: category.closingHeading })).toBeInTheDocument();
  });

  it('renders an image carousel with one slide per gallery image', () => {
    render(<ProductCategoryPage category={category} />);
    category.gallery.forEach((g) => {
      expect(screen.getByRole('img', { name: g.alt })).toBeInTheDocument();
    });
  });
});
