'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type FieldErrors = Partial<Record<'name' | 'email' | 'phone' | 'message' | 'consent', string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: HTMLFormElement): FieldErrors {
  const data = new FormData(form);
  const errors: FieldErrors = {};

  const name = String(data.get('name') ?? '').trim();
  if (!name) errors.name = 'Full name is required.';

  const email = String(data.get('email') ?? '').trim();
  if (!email) errors.email = 'Email address is required.';
  else if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email address.';

  const phone = String(data.get('phone') ?? '').trim();
  if (!phone) errors.phone = 'Phone number is required.';
  else if (phone.replace(/[^0-9]/g, '').length < 7) errors.phone = 'Enter a valid phone number.';

  const message = String(data.get('message') ?? '').trim();
  if (!message) errors.message = 'Tell us a bit about your project.';
  else if (message.length < 10) errors.message = 'Please provide a bit more detail (at least 10 characters).';

  if (data.get('consent') !== 'on') errors.consent = 'Please confirm you agree to be contacted.';

  return errors;
}

export default function QuoteForm() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');

  // Arriving from a product page's configurator (?product=...&color=...) prefills
  // the message instead of dropping the customer's selection on the floor.
  const prefillProduct = searchParams.get('product') || '';
  const prefillColor = searchParams.get('color') || '';
  const prefillMessage = prefillProduct
    ? `Interested in: ${prefillProduct}${prefillColor ? ` (${prefillColor})` : ''}\n\n`
    : '';

  function clearError(field: keyof FieldErrors) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitError('');

    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      const firstField = Object.keys(clientErrors)[0];
      form.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch('/api/quote', { method: 'POST', body: new FormData(form) });
      const result = await res.json();

      if (res.ok && result.ok) {
        setSubmitted(true);
      } else if (result.errors) {
        setErrors(result.errors);
      } else {
        setSubmitError(result.error || 'Something went wrong sending your request. Please try again.');
      }
    } catch {
      setSubmitError('Could not reach the server. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="quote-form-card">
        <div className="qf-success">
          <div className="qf-success__icon">✓</div>
          <h3>Quote Request Sent!</h3>
          <p>Thank you. We&apos;ve received your request and will be in touch within one business day. Keep an eye on your inbox (and spam folder, just in case).</p>
          <p>In the meantime, browse our <Link href="/custom-printed-blinds" style={{color:'#8A5A00',textDecoration:'underline'}}>custom printed blinds</Link> for inspiration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-form-card">
      <div className="quote-form-card__head">
        <h2>Request a Quote</h2>
        <p>Fill in your details below and we&apos;ll get back to you within one business day.</p>
      </div>

      <form className="quote-form" onSubmit={handleSubmit} noValidate>

        <div className="qf-row qf-row--2">
          <div className="qf-field">
            <label className="qf-label" htmlFor="qfName">Full Name <span className="qf-req">*</span></label>
            <input
              className={`qf-input${errors.name ? ' is-error' : ''}`}
              type="text" id="qfName" name="name" placeholder="Jane Smith" autoComplete="name" required
              aria-invalid={!!errors.name} aria-describedby={errors.name ? 'qfName-error' : undefined}
              onChange={() => clearError('name')}
            />
            {errors.name && <p className="qf-error-msg" id="qfName-error">{errors.name}</p>}
          </div>
          <div className="qf-field">
            <label className="qf-label" htmlFor="qfPhone">Phone Number <span className="qf-req">*</span></label>
            <input
              className={`qf-input${errors.phone ? ' is-error' : ''}`}
              type="tel" id="qfPhone" name="phone" placeholder="780-555-0100" autoComplete="tel" required
              aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'qfPhone-error' : undefined}
              onChange={() => clearError('phone')}
            />
            {errors.phone && <p className="qf-error-msg" id="qfPhone-error">{errors.phone}</p>}
          </div>
        </div>

        <div className="qf-row qf-row--2">
          <div className="qf-field">
            <label className="qf-label" htmlFor="qfEmail">Email Address <span className="qf-req">*</span></label>
            <input
              className={`qf-input${errors.email ? ' is-error' : ''}`}
              type="email" id="qfEmail" name="email" placeholder="jane@example.com" autoComplete="email" required
              aria-invalid={!!errors.email} aria-describedby={errors.email ? 'qfEmail-error' : undefined}
              onChange={() => clearError('email')}
            />
            {errors.email && <p className="qf-error-msg" id="qfEmail-error">{errors.email}</p>}
          </div>
          <div className="qf-field">
            <label className="qf-label" htmlFor="qfArea">Location</label>
            <input className="qf-input" type="text" id="qfArea" name="area" placeholder="Edmonton, AB" autoComplete="address-level2"/>
          </div>
        </div>

        <div className="qf-field">
          <label className="qf-label">Type of Property</label>
          <div className="qf-chips" role="group" aria-label="Type of property">
            <label className="qf-chip"><input type="radio" name="propertyType" value="residential" defaultChecked/><span>Residential</span></label>
            <label className="qf-chip"><input type="radio" name="propertyType" value="commercial"/><span>Commercial</span></label>
          </div>
        </div>

        <div className="qf-field">
          <label className="qf-label" htmlFor="qfMessage">Message <span className="qf-req">*</span></label>
          <textarea
            className={`qf-input qf-textarea${errors.message ? ' is-error' : ''}`}
            id="qfMessage" name="message" rows={5} required
            aria-invalid={!!errors.message} aria-describedby={errors.message ? 'qfMessage-error' : undefined}
            onChange={() => clearError('message')}
            defaultValue={prefillMessage}
            placeholder="Tell us about your windows, style preferences, and timeline..."/>
          {errors.message && <p className="qf-error-msg" id="qfMessage-error">{errors.message}</p>}
        </div>

        <div className="qf-submit-row">
          <div className="qf-consent">
            <label className="qf-consent__label">
              <input type="checkbox" id="qfConsent" name="consent" required onChange={() => clearError('consent')}/>
              <span>I agree to be contacted by Vision Printed Blinds regarding my quote request. We respect your privacy and will never share your information. <span className="qf-req">*</span></span>
            </label>
            {errors.consent && <p className="qf-error-msg">{errors.consent}</p>}
          </div>

          {submitError && (
            <div className="pt-upload-error">
              <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M8 5v3M8 10.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span>{submitError}</span>
            </div>
          )}

          <button type="submit" className="btn btn--gold btn--xl qf-submit" disabled={submitting}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:'20px',height:'20px',marginRight:'8px'}}><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
            {submitting ? 'Sending…' : 'Send My Quote Request'}
          </button>
          <p className="qf-note">We respond within 1 business day. No obligation whatsoever.</p>
        </div>
      </form>
    </div>
  );
}
