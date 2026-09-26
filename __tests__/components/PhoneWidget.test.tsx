import { render, screen } from '@testing-library/react';
import PhoneWidget from '@/components/PhoneWidget';

describe('PhoneWidget', () => {
  it('renders a tel: link with the phone number', () => {
    render(<PhoneWidget />);
    const link = screen.getByRole('link', { name: /647-949-5489/i });
    expect(link).toHaveAttribute('href', 'tel:+16479495489');
  });

  it('applies the fixed bottom-left widget class', () => {
    render(<PhoneWidget />);
    const link = screen.getByRole('link', { name: /647-949-5489/i });
    expect(link).toHaveClass('phone-widget');
  });
});
