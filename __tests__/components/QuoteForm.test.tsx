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
  await user.type(screen.getByLabelText(/email address/i), 'jane@example.com');
  await user.type(screen.getByLabelText(/tell us more about your project/i), 'Two bedroom windows, blackout preferred.');
  await user.click(screen.getByLabelText(/i agree to be contacted/i));
}

describe('QuoteForm', () => {
  beforeEach(() => {
    mockParams = new URLSearchParams();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the required contact fields (marked with a visible asterisk, validated on submit)', () => {
    render(<QuoteForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tell us more about your project/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i agree to be contacted/i)).toBeInTheDocument();
  });

  it('blocks submission and shows field errors when required fields are empty', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn();
    render(<QuoteForm />);

    await user.click(screen.getByRole('button', { name: /send my quote request/i }));

    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
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
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
    await user.type(screen.getByLabelText(/tell us more about your project/i), 'Two bedroom windows, blackout preferred.');
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

  it('lets the user pick a design file and shows its name, then remove it', async () => {
    const user = userEvent.setup();
    render(<QuoteForm />);
    const fileInput = screen.getByLabelText(/upload your design file/i) as HTMLInputElement;
    const file = new File(['x'], 'my-design.png', { type: 'image/png' });
    await user.upload(fileInput, file);
    expect(screen.getByText('my-design.png')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove/i }));
    expect(screen.queryByText('my-design.png')).not.toBeInTheDocument();
  });

  // NOTE ON SCOPE: the client-side file size/extension checks in validate()
  // can't be reliably exercised here. jsdom's `new FormData(form)` always
  // returns a zero-byte File clone for file inputs (losing real content
  // regardless of what user.upload() attached), and @testing-library's
  // upload() itself respects the input's `accept` attribute, silently
  // declining to attach files with a disallowed extension — both real
  // jsdom/tooling limitations, not gaps in the component. The same checks
  // are duplicated and unit-tested server-side in
  // __tests__/api/quote.test.ts, which is the actual enforcement boundary.

  describe('prefilling from a product page (?product=&color=&mount=&width=&height=)', () => {
    it('prefills width, height, and the message when arriving from a product configurator', () => {
      mockParams = new URLSearchParams('product=Zebra+Blinds&color=Black&mount=inside&width=24&height=36');
      render(<QuoteForm />);

      expect(screen.getByLabelText(/approx\. width/i)).toHaveValue('24');
      expect(screen.getByLabelText(/approx\. height/i)).toHaveValue('36');
      expect(screen.getByLabelText(/tell us more about your project/i)).toHaveValue('Interested in: Zebra Blinds (Black)\n\n');
    });

    it('pre-selects the matching mount type radio', () => {
      mockParams = new URLSearchParams('mount=outside');
      render(<QuoteForm />);
      expect(screen.getByRole('radio', { name: /outside mount/i })).toBeChecked();
      expect(screen.getByRole('radio', { name: /not sure/i })).not.toBeChecked();
    });

    it('falls back to "Not Sure" and leaves fields blank with no query params', () => {
      render(<QuoteForm />);
      expect(screen.getByRole('radio', { name: /not sure/i })).toBeChecked();
      expect(screen.getByLabelText(/approx\. width/i)).toHaveValue('');
      expect(screen.getByLabelText(/tell us more about your project/i)).toHaveValue('');
    });
  });
});
