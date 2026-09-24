import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RoomTabs from '@/components/RoomTabs';

describe('RoomTabs', () => {
  it('shows residential rooms by default', () => {
    render(<RoomTabs />);
    expect(screen.getByText('Living Room')).toBeInTheDocument();
    expect(screen.getByText('Bedroom')).toBeInTheDocument();
    expect(screen.queryByText('Boardroom')).not.toBeInTheDocument();
  });

  it('the Residential tab is marked active by default', () => {
    render(<RoomTabs />);
    expect(screen.getByRole('button', { name: 'Residential' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: 'Commercial' })).not.toHaveClass('active');
  });

  it('switches to commercial rooms when the Commercial tab is clicked', async () => {
    const user = userEvent.setup();
    render(<RoomTabs />);
    await user.click(screen.getByRole('button', { name: 'Commercial' }));
    expect(screen.getByText('Boardroom')).toBeInTheDocument();
    expect(screen.getByText('Hotel')).toBeInTheDocument();
    expect(screen.queryByText('Living Room')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Commercial' })).toHaveClass('active');
  });

  it('every room card links to the quote page', () => {
    render(<RoomTabs />);
    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('href', '/quote');
    });
  });
});
