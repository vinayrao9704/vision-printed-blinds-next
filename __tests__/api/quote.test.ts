/**
 * @jest-environment node
 */
import { POST } from '@/app/api/quote/route';

const sendMock = jest.fn().mockResolvedValue({ data: { id: 'test' }, error: null });

jest.mock('resend', () => ({
  __esModule: true,
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

function buildRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  return new Request('http://localhost/api/quote', { method: 'POST', body: form });
}

const validFields = {
  name: 'Jane Smith',
  phone: '780-555-0100',
  email: 'jane@example.com',
  area: 'Edmonton, AB',
  propertyType: 'residential',
  message: 'Looking for blackout blinds for two bedroom windows.',
  consent: 'on',
};

describe('POST /api/quote', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    sendMock.mockResolvedValue({ data: { id: 'test' }, error: null });
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('rejects a submission missing all required fields', async () => {
    const res = await POST(buildRequest({}));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      phone: expect.any(String),
      message: expect.any(String),
      consent: expect.any(String),
    });
  });

  it('rejects a malformed email address', async () => {
    const res = await POST(buildRequest({ ...validFields, email: 'not-an-email' }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.errors.email).toMatch(/valid email/i);
  });

  it('rejects a message that is too short', async () => {
    const res = await POST(buildRequest({ ...validFields, message: 'hi' }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.errors.message).toMatch(/more detail/i);
  });

  it('rejects a submission without consent', async () => {
    const res = await POST(buildRequest({ ...validFields, consent: '' }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.errors.consent).toMatch(/consent/i);
  });

  it('rejects a submission missing a phone number', async () => {
    const res = await POST(buildRequest({ ...validFields, phone: '' }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.errors.phone).toMatch(/phone number/i);
  });

  it('returns a clear error when Resend is not configured, without crashing', async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;

    const res = await POST(buildRequest(validFields));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/not configured/i);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('sends an email with the submitted details when Resend is configured', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.RESEND_FROM_EMAIL = 'quotes@visionprintedblinds.ca';

    const res = await POST(buildRequest(validFields));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);

    const call = sendMock.mock.calls[0][0];
    expect(call.to).toBe('info@visionprintedblinds.ca');
    expect(call.replyTo).toContain('jane@example.com');
    expect(call.text).toContain('Jane Smith');
    expect(call.text).toContain('Edmonton, AB');
    expect(call.text).toContain('residential');
  });

  it('respects CONTACT_TO_EMAIL when set', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.RESEND_FROM_EMAIL = 'quotes@visionprintedblinds.ca';
    process.env.CONTACT_TO_EMAIL = 'orders@visionprintedblinds.ca';

    await POST(buildRequest(validFields));

    const call = sendMock.mock.calls[0][0];
    expect(call.to).toBe('orders@visionprintedblinds.ca');
  });

  it('returns a 500 with a friendly error if Resend reports an error', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.RESEND_FROM_EMAIL = 'quotes@visionprintedblinds.ca';
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'domain not verified' } });

    const res = await POST(buildRequest(validFields));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/try again/i);
  });

  it('returns a 500 with a friendly error if sending throws unexpectedly', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    process.env.RESEND_FROM_EMAIL = 'quotes@visionprintedblinds.ca';
    sendMock.mockRejectedValueOnce(new Error('network error'));

    const res = await POST(buildRequest(validFields));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(body.error).toMatch(/try again/i);
  });
});
