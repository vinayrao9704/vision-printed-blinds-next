import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB, matches the form's stated limit
const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.svg', '.tiff', '.ai', '.eps'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fieldErrors(form: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const name = String(form.get('name') ?? '').trim();
  if (!name) errors.name = 'Full name is required.';

  const email = String(form.get('email') ?? '').trim();
  if (!email) errors.email = 'Email address is required.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';

  const phone = String(form.get('phone') ?? '').trim();
  if (phone && phone.replace(/[^0-9]/g, '').length < 7) errors.phone = 'Enter a valid phone number.';

  const message = String(form.get('message') ?? '').trim();
  if (!message) errors.message = 'Tell us a bit about your project.';
  else if (message.length < 10) errors.message = 'Please provide a bit more detail (at least 10 characters).';

  if (form.get('consent') !== 'on') errors.consent = 'Consent is required to submit this form.';

  const file = form.get('designFile');
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      errors.designFile = 'File is too large — max 20MB.';
    } else {
      const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
      if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
        errors.designFile = 'Unsupported file type.';
      }
    }
  }

  return errors;
}

function buildSummary(form: FormData): string {
  const get = (key: string) => String(form.get(key) ?? '').trim();
  const lines = [
    `Name: ${get('name')}`,
    `Email: ${get('email')}`,
    `Phone: ${get('phone') || '—'}`,
    `City/Location: ${get('city') || '—'}`,
    '',
    `Project type: ${get('projectType') || '—'}`,
    `Blind type(s): ${form.getAll('blindType').map(String).join(', ') || '—'}`,
    `Custom printing: ${get('customPrint') || '—'}`,
    '',
    `Window count: ${get('windowCount') || '—'}`,
    `Width (each): ${get('width') || '—'}`,
    `Height (each): ${get('height') || '—'}`,
    `Mount type: ${get('mountType') || '—'}`,
    '',
    `Message:`,
    get('message'),
    '',
    `Found us via: ${get('source') || '—'}`,
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

  const attachments: { filename: string; content: Buffer }[] = [];
  const file = form.get('designFile');
  if (file instanceof File && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    attachments.push({ filename: file.name, content: buffer });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: `Vision Printed Blinds Website <${RESEND_FROM_EMAIL}>`,
      to: toEmail,
      replyTo: `${fromName} <${fromEmail}>`,
      subject: `New Quote Request — ${fromName}`,
      text: buildSummary(form),
      attachments,
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
