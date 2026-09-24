import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MeasureGuideInteractive from '@/components/MeasureGuideInteractive';

describe('MeasureGuideInteractive', () => {
  it('defaults to the Inside Mount guide', () => {
    render(<MeasureGuideInteractive />);
    expect(screen.getByRole('tab', { name: /inside mount guide/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /outside mount guide/i })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('heading', { name: /measuring for inside mount/i })).toBeInTheDocument();
    expect(screen.getByText(/measure casing width/i)).toBeInTheDocument();
  });

  it('switches to the Outside Mount guide on click', async () => {
    const user = userEvent.setup();
    render(<MeasureGuideInteractive />);
    await user.click(screen.getByRole('tab', { name: /outside mount guide/i }));

    expect(screen.getByRole('tab', { name: /outside mount guide/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { name: /measuring for outside mount/i })).toBeInTheDocument();
    expect(screen.getByText(/decide your overlap/i)).toBeInTheDocument();
  });

  it('only shows the casing depth checker on the Inside Mount guide', async () => {
    const user = userEvent.setup();
    render(<MeasureGuideInteractive />);
    expect(screen.getByText(/verify casing depth requirements/i)).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /outside mount guide/i }));
    expect(screen.queryByText(/verify casing depth requirements/i)).not.toBeInTheDocument();
  });

  it('shows a depth-confirmation message (not a fabricated number) once a blind type is picked', async () => {
    const user = userEvent.setup();
    render(<MeasureGuideInteractive />);

    expect(screen.queryByText(/request a free quote/i)).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText(/select your blind type/i), 'Roller Blinds');

    const result = screen.getByText(/minimum casing depth for/i);
    expect(result).toHaveTextContent('Roller Blinds');
    expect(screen.getByRole('link', { name: /request a free quote/i })).toHaveAttribute('href', '/quote');
  });

  it('renders the general measuring rules', () => {
    render(<MeasureGuideInteractive />);
    expect(screen.getByText(/steel tape measure/i)).toBeInTheDocument();
    expect(screen.getByText(/nearest 1\/8th of an inch/i)).toBeInTheDocument();
    expect(screen.getByText(/width x height/i)).toBeInTheDocument();
  });
});
