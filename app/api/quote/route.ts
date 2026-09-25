import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fieldErrors(form: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const name = String(form.get('name') ?? '').trim();
  if (!name) errors.name = 'Full name is required.';

  const email = String(form.get('email') ?? '').trim();
  if (!email) errors.email = 'Email address is required.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';

  const phone = String(form.get('phone') ?? '').trim();
  if (!phone) errors.phone = 'Phone number is required.';
  else if (phone.replace(/[^0-9]/g, '').length < 7) errors.phone = 'Enter a valid phone number.';

  const message = String(form.get('message') ?? '').trim();
  if (!message) errors.message = 'Tell us a bit about your project.';
  else if (message.length < 10) errors.message = 'Please provide a bit more detail (at least 10 characters).';

  if (form.get('consent') !== 'on') errors.consent = 'Consent is required to submit this form.';

  return errors;
}

function buildSummary(form: FormData): string {
  const get = (key: string) => String(form.get(key) ?? '').trim();
  const lines = [
    `Name: ${get('name')}`,
    `Email: ${get('email')}`,
    `Phone: ${get('phone') || '—'}`,
    `Location: ${get('area') || '—'}`,
    `Type of property: ${get('propertyType') || '—'}`,
    '',
    `Message:`,
    get('message'),
  ];
  return lines.join('\n');
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not read form submission.' }, { status: 400 });
  }

  const errors = fieldErrors(form);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const { RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_TO_EMAIL } = process.env;
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL) {
    console.error('[api/quote] Resend env vars are not configured — email not sent.');
    return NextResponse.json(
      { ok: false, error: 'Email delivery is not configured yet. Please email info@visionprintedblinds.ca directly for now.' },
      { status: 500 }
    );
  }

  const toEmail = CONTACT_TO_EMAIL || 'info@visionprintedblinds.ca';
  const fromName = String(form.get('name') ?? '').trim();
  const fromEmail = String(form.get('email') ?? '').trim();

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: `Vision Printed Blinds Website <${RESEND_FROM_EMAIL}>`,
      to: toEmail,
      replyTo: `${fromName} <${fromEmail}>`,
      subject: `New Quote Request — ${fromName}`,
      text: buildSummary(form),
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[api/quote] Failed to send email:', err);
    return NextResponse.json(
      { ok: false, error: 'Something went wrong sending your request. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}
