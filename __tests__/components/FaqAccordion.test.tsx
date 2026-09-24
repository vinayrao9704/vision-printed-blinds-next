import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FaqAccordion from '@/components/FaqAccordion';

describe('FaqAccordion', () => {
  it('renders more than one question', () => {
    render(<FaqAccordion />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(1);
  });

  it('opens the first question by default', () => {
    render(<FaqAccordion />);
    const firstButton = screen.getAllByRole('button')[0];
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles a question open and closed on click', async () => {
    const user = userEvent.setup();
    render(<FaqAccordion />);
    const buttons = screen.getAllByRole('button');
    const second = buttons[1];
    expect(second).toHaveAttribute('aria-expanded', 'false');

    await user.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');

    await user.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'false');
  });

  it('is a single-open accordion: opening a new question closes the previously open one', async () => {
    const user = userEvent.setup();
    render(<FaqAccordion />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[1]);
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
  });

  it('every question button has non-empty accessible text', () => {
    render(<FaqAccordion />);
    screen.getAllByRole('button').forEach((btn) => {
      expect(btn.textContent?.trim().length).toBeGreaterThan(0);
    });
  });
});
