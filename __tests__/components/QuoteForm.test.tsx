import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// QuoteForm reads the URL via useSearchParams (App Router) to prefill fields
// when arriving from a product page's configurator. Same stubbing approach
// as ShopCatalog.test.tsx: mock next/navigation directly and let each test
// control the current search params.
let mockParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockParams,
}));

import QuoteForm from '@/components/QuoteForm';

function mockFetchOnce(response: unknown, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => response,
  }) as jest.Mock;
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), 'Jane Smith');
  await user.type(screen.getByLabelText(/phone number/i), '780-555-0100');
  await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
  await user.type(screen.getByLabelText(/^message/i), 'Two bedroom windows, blackout preferred.');
  await user.click(screen.getByLabelText(/i agree to be contacted/i));
}

describe('QuoteForm', () => {
  beforeEach(() => {
    mockParams = new URLSearchParams();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders exactly the minimal field set: name, phone, email, type of property, area, message', () => {
    render(<QuoteForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByText(/type of property/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /residential/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /commercial/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i agree to be contacted/i)).toBeInTheDocument();
  });

  it('does not render the fields removed from the old, longer form', () => {
    render(<QuoteForm />);
    expect(screen.queryByLabelText(/upload your design/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/number of windows/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/how did you find us/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/what type of blind/i)).not.toBeInTheDocument();
  });

  it('blocks submission and shows field errors when required fields are empty', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn();
    render(<QuoteForm />);

    await user.click(screen.getByRole('button', { name: /send my quote request/i }));

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/tell us a bit about your project/i)).toBeInTheDocument();
    expect(screen.getByText(/please confirm you agree to be contacted/i)).toBeInTheDocument();
    expect(screen.queryByText(/quote request sent/i)).not.toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('shows an error for a malformed email address without submitting', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn();
    render(<QuoteForm />);
    await user.type(screen.getByLabelText(/full name/i), 'Jane Smith');
    await user.type(screen.getByLabelText(/phone number/i), '780-555-0100');
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
    await user.type(screen.getByLabelText(/^message/i), 'Two bedroom windows, blackout preferred.');
    await user.click(screen.getByLabelText(/i agree to be contacted/i));
    await user.click(screen.getByRole('button', { name: /send my quote request/i }));

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('clears a field error as soon as the user edits that field', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn();
    render(<QuoteForm />);
    await user.click(screen.getByRole('button', { name: /send my quote request/i }));
    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/full name/i), 'J');
    expect(screen.queryByText(/full name is required/i)).not.toBeInTheDocument();
  });

  it('submits the form data to /api/quote and shows the success confirmation', async () => {
    const user = userEvent.setup();
    mockFetchOnce({ ok: true });
    render(<QuoteForm />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /send my quote request/i }));

    expect(await screen.findByText(/quote request sent/i)).toBeInTheDocument();
    expect(screen.getByText(/we've received your request/i)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith('/api/quote', expect.objectContaining({
      method: 'POST',
      body: expect.any(FormData),
    }));
  });

  it('shows a disabled, "Sending…" button state while the request is in flight', async () => {
    const user = userEvent.setup();
    let resolveFetch: (v: unknown) => void = () => {};
    global.fetch = jest.fn().mockReturnValue(new Promise((resolve) => { resolveFetch = resolve; })) as jest.Mock;
    render(<QuoteForm />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /send my quote request/i }));

    const button = screen.getByRole('button', { name: /sending/i });
    expect(button).toBeDisabled();

    resolveFetch({ ok: true, json: async () => ({ ok: true }) });
    await waitFor(() => expect(screen.getByText(/quote request sent/i)).toBeInTheDocument());
  });

  it('shows a server-provided error message and stays on the form when the API reports failure', async () => {
    const user = userEvent.setup();
    mockFetchOnce({ ok: false, error: 'Email delivery is not configured yet. Please email info@visionprintedblinds.ca directly for now.' }, false);
    render(<QuoteForm />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /send my quote request/i }));

    expect(await screen.findByText(/email delivery is not configured yet/i)).toBeInTheDocument();
    expect(screen.queryByText(/quote request sent/i)).not.toBeInTheDocument();
  });

  it('shows a generic error message when the network request itself fails', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockRejectedValue(new Error('network down')) as jest.Mock;
    render(<QuoteForm />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: /send my quote request/i }));

    expect(await screen.findByText(/could not reach the server/i)).toBeInTheDocument();
  });

  describe('prefilling from a product page (?product=&color=)', () => {
    it('prefills the message when arriving from a product configurator', () => {
      mockParams = new URLSearchParams('product=Zebra+Blinds&color=Black');
      render(<QuoteForm />);
      expect(screen.getByLabelText(/^message/i)).toHaveValue('Interested in: Zebra Blinds (Black)\n\n');
    });

    it('leaves the message blank with no query params', () => {
      render(<QuoteForm />);
      expect(screen.getByLabelText(/^message/i)).toHaveValue('');
    });
  });
});
