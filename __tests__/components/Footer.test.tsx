import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  it('renders the brand logo and tagline', () => {
    render(<Footer />);
    expect(screen.getByAltText('Vision Printed Blinds')).toBeInTheDocument();
    expect(screen.getByText('PRINT. COVER. TRANSFORM.')).toBeInTheDocument();
  });

  it('renders a working email contact link', () => {
    render(<Footer />);
    const email = screen.getByRole('link', { name: /info@visionprintedblinds\.ca/i });
    expect(email).toHaveAttribute('href', 'mailto:info@visionprintedblinds.ca');
  });

  it('renders a working phone contact link', () => {
    render(<Footer />);
    const phone = screen.getByRole('link', { name: /647-949-5489/i });
    expect(phone).toHaveAttribute('href', 'tel:+16479495489');
  });

  it('renders links to every main page', () => {
    render(<Footer />);
    ['Home', 'Blinds & Shades', 'Gallery', 'Get a Quote'].forEach((label) => {
      expect(screen.getByRole('link', { name: new RegExp(label, 'i') })).toBeInTheDocument();
    });
  });

  it('renders the current year in the copyright line', () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('matches its snapshot', () => {
    const { container } = render(<Footer />);
    expect(container).toMatchSnapshot();
  });
});
