import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductConfigurator from '@/components/ProductConfigurator';
import { products } from '@/lib/products';

const zebraPlain = products.find((p) => p.id === 'zebra-plain')!;

describe('ProductConfigurator', () => {
  it('renders the product name, overview, and spec rows', () => {
    render(<ProductConfigurator product={zebraPlain} />);
    expect(screen.getByRole('heading', { level: 1, name: zebraPlain.name })).toBeInTheDocument();
    expect(screen.getByText(zebraPlain.desc)).toBeInTheDocument();
    expect(screen.getByText('Product Overview')).toBeInTheDocument();
  });

  it('never mentions live pricing, a cart, or WhatsApp — this business only offers free quotes', () => {
    render(<ProductConfigurator product={zebraPlain} />);
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/live pricing/i);
    expect(text).not.toMatch(/add to cart/i);
    expect(text).not.toMatch(/whatsapp/i);
    expect(screen.getByRole('link', { name: /get your free estimate/i })).toBeInTheDocument();
  });

  it('defaults to the first color and Inside Mount', () => {
    render(<ProductConfigurator product={zebraPlain} />);
    expect(screen.getByText(/selected color:/i)).toHaveTextContent('Black');
    expect(screen.getByRole('button', { name: /inside mount/i })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /outside mount/i })).toHaveAttribute('aria-pressed', 'false');
  });

  it('switching color and mount type updates the selection and the quote link', async () => {
    const user = userEvent.setup();
    render(<ProductConfigurator product={zebraPlain} />);

    await user.click(screen.getByRole('button', { name: 'Sand' }));
    expect(screen.getByText(/selected color:/i)).toHaveTextContent('Sand');

    await user.click(screen.getByRole('button', { name: /outside mount/i }));
    expect(screen.getByRole('button', { name: /outside mount/i })).toHaveAttribute('aria-pressed', 'true');

    const quoteLink = screen.getByRole('link', { name: /get your free estimate/i });
    const href = quoteLink.getAttribute('href')!;
    expect(href).toContain(`product=${encodeURIComponent(zebraPlain.name)}`);
    expect(href).toContain('color=Sand');
    expect(href).toContain('mount=outside');
  });

  it('entered width/height are carried into the quote link', async () => {
    const user = userEvent.setup();
    render(<ProductConfigurator product={zebraPlain} />);

    await user.type(screen.getByLabelText(/width/i), '24');
    await user.type(screen.getByLabelText(/height/i), '36');

    const href = screen.getByRole('link', { name: /get your free estimate/i }).getAttribute('href')!;
    expect(href).toContain('width=24');
    expect(href).toContain('height=36');
  });

  it('falls back to the CSS scene illustration when the product has no photo', () => {
    const noPhotoProduct = { ...zebraPlain, image: undefined };
    render(<ProductConfigurator product={noPhotoProduct} />);
    expect(document.querySelector(`.${noPhotoProduct.scene}`)).toBeInTheDocument();
  });
});
