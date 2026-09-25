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

  it('does not render a phone number (removed per business requirements)', () => {
    render(<Footer />);
    expect(screen.queryByText(/438-866-6867/)).not.toBeInTheDocument();
  });

  it('renders links to every main page', () => {
    render(<Footer />);
    ['Home', 'Shop All Blinds', 'Gallery', 'Get a Quote'].forEach((label) => {
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
