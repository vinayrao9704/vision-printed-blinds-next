'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type FieldErrors = Partial<Record<'name' | 'email' | 'phone' | 'message' | 'consent' | 'designFile', string>>;

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf', '.svg', '.tiff', '.ai', '.eps'];
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
  if (phone && phone.replace(/[^0-9]/g, '').length < 7) errors.phone = 'Enter a valid phone number.';

  const message = String(data.get('message') ?? '').trim();
  if (!message) errors.message = 'Tell us a bit about your project.';
  else if (message.length < 10) errors.message = 'Please provide a bit more detail (at least 10 characters).';

  if (data.get('consent') !== 'on') errors.consent = 'Please confirm you agree to be contacted.';

  const file = data.get('designFile');
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

export default function QuoteForm() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState('');

  // Arriving from a product page's configurator (?product=...&color=...&mount=...&width=...&height=...)
  // prefills the relevant fields instead of dropping the customer's selections on the floor.
  const prefillProduct = searchParams.get('product') || '';
  const prefillColor = searchParams.get('color') || '';
  const prefillWidth = searchParams.get('width') || '';
  const prefillHeight = searchParams.get('height') || '';
  const prefillMount = searchParams.get('mount');
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
          <p>Thank you — we&apos;ve received your request and will be in touch within one business day. Keep an eye on your inbox (and spam folder, just in case).</p>
          <p>In the meantime, try our <Link href="/custom" style={{color:'var(--gold)'}}>Design Preview Tool</Link> to visualize your blind.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-form-card">
      <div className="quote-form-card__head">
        <h2>Request a Quote</h2>
        <p>Fill in as much detail as you can — the more we know, the more accurate your quote will be.</p>
      </div>

      <form className="quote-form" onSubmit={handleSubmit} noValidate>

        <fieldset className="qf-fieldset">
          <legend className="qf-legend">Your Contact Details</legend>
          <div className="qf-row qf-row--2">
            <div className="qf-field">
              <label className="qf-label" htmlFor="qfName">Full Name <span className="qf-req">*</span></label>
              <input
                className={`qf-input${errors.name ? ' is-error' : ''}`}
                type="text" id="qfName" name="name" placeholder="Jane Smith" autoComplete="name"
                aria-invalid={!!errors.name} aria-describedby={errors.name ? 'qfName-error' : undefined}
                onChange={() => clearError('name')}
              />
              {errors.name && <p className="qf-error-msg" id="qfName-error">{errors.name}</p>}
            </div>
            <div className="qf-field">
              <label className="qf-label" htmlFor="qfEmail">Email Address <span className="qf-req">*</span></label>
              <input
                className={`qf-input${errors.email ? ' is-error' : ''}`}
                type="email" id="qfEmail" name="email" placeholder="jane@example.com" autoComplete="email"
                aria-invalid={!!errors.email} aria-describedby={errors.email ? 'qfEmail-error' : undefined}
                onChange={() => clearError('email')}
              />
              {errors.email && <p className="qf-error-msg" id="qfEmail-error">{errors.email}</p>}
            </div>
          </div>
          <div className="qf-row qf-row--2">
            <div className="qf-field">
              <label className="qf-label" htmlFor="qfPhone">Phone Number</label>
              <input
                className={`qf-input${errors.phone ? ' is-error' : ''}`}
                type="tel" id="qfPhone" name="phone" placeholder="780-555-0100" autoComplete="tel"
                aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'qfPhone-error' : undefined}
                onChange={() => clearError('phone')}
              />
              {errors.phone && <p className="qf-error-msg" id="qfPhone-error">{errors.phone}</p>}
            </div>
            <div className="qf-field">
              <label className="qf-label" htmlFor="qfCity">City / Location</label>
              <input className="qf-input" type="text" id="qfCity" name="city" placeholder="Edmonton, AB" autoComplete="address-level2"/>
            </div>
          </div>
        </fieldset>

        <fieldset className="qf-fieldset">
          <legend className="qf-legend">Project Type</legend>
          <div className="qf-chips" role="group" aria-label="Project type">
            <label className="qf-chip"><input type="radio" name="projectType" value="residential" defaultChecked/><span>Residential</span></label>
            <label className="qf-chip"><input type="radio" name="projectType" value="commercial"/><span>Commercial</span></label>
            <label className="qf-chip"><input type="radio" name="projectType" value="rental"/><span>Rental Property</span></label>
            <label className="qf-chip"><input type="radio" name="projectType" value="new-build"/><span>New Build / Renovation</span></label>
          </div>
        </fieldset>

        <fieldset className="qf-fieldset">
          <legend className="qf-legend">What Type of Blind Are You Interested In?</legend>
          <div className="qf-chips" role="group" aria-label="Blind type">
            {['Roller Blinds','Blackout','Zebra Blinds','Solar Shades','Cellular Shades','Roman Shades','Vertical Blinds','Motorized','Not Sure Yet'].map(label => (
              <label className="qf-chip" key={label}><input type="checkbox" name="blindType" value={label}/><span>{label}</span></label>
            ))}
          </div>
        </fieldset>

        <fieldset className="qf-fieldset">
          <legend className="qf-legend">Custom Printing</legend>
          <div className="qf-chips" role="group" aria-label="Custom printing interest">
            <label className="qf-chip"><input type="radio" name="customPrint" value="yes"/><span>★ Yes, I want custom printing</span></label>
            <label className="qf-chip"><input type="radio" name="customPrint" value="maybe"/><span>Maybe — tell me more</span></label>
            <label className="qf-chip"><input type="radio" name="customPrint" value="no" defaultChecked/><span>No custom printing</span></label>
          </div>
        </fieldset>

        <fieldset className="qf-fieldset">
          <legend className="qf-legend">Window Details</legend>
          <p style={{fontSize:'13px',color:'var(--text-light)',marginBottom:'14px'}}>Not sure how to measure? Check our <Link href="/measure-guide" style={{color:'var(--gold-dark)'}}>step-by-step measuring guide</Link>.</p>
          <div className="qf-row qf-row--3">
            <div className="qf-field">
              <label className="qf-label" htmlFor="qfWindowCount">Number of Windows</label>
              <input className="qf-input" type="number" id="qfWindowCount" name="windowCount" placeholder="e.g. 4" min={1}/>
            </div>
            <div className="qf-field">
              <label className="qf-label" htmlFor="qfWidth">Approx. Width (each)</label>
              <input className="qf-input" type="text" id="qfWidth" name="width" placeholder='e.g. 36"' defaultValue={prefillWidth}/>
            </div>
            <div className="qf-field">
              <label className="qf-label" htmlFor="qfHeight">Approx. Height (each)</label>
              <input className="qf-input" type="text" id="qfHeight" name="height" placeholder='e.g. 60"' defaultValue={prefillHeight}/>
            </div>
          </div>
          <div className="qf-field" style={{marginTop:'16px'}}>
            <label className="qf-label">Mount Type</label>
            <div className="qf-chips qf-chips--inline" role="group">
              <label className="qf-chip"><input type="radio" name="mountType" value="inside" defaultChecked={prefillMount === 'inside'}/><span>Inside Mount</span></label>
              <label className="qf-chip"><input type="radio" name="mountType" value="outside" defaultChecked={prefillMount === 'outside'}/><span>Outside Mount</span></label>
              <label className="qf-chip"><input type="radio" name="mountType" value="unsure" defaultChecked={prefillMount !== 'inside' && prefillMount !== 'outside'}/><span>Not Sure</span></label>
            </div>
          </div>
        </fieldset>

        <fieldset className="qf-fieldset">
          <legend className="qf-legend">Upload Your Design <span style={{fontWeight:400,color:'var(--text-xlight)'}}>(optional)</span></legend>
          <p style={{fontSize:'13px',color:'var(--text-light)',marginBottom:'14px'}}>Have an image, logo, or design ready? Upload it here — JPG, PNG, PDF, SVG up to 20MB.</p>
          <div className="qf-upload" onClick={()=>document.getElementById('qfDesignFile')?.click()}>
            <input type="file" id="qfDesignFile" name="designFile" accept=".jpg,.jpeg,.png,.pdf,.svg,.tiff,.ai,.eps" className="qf-upload__input"
              aria-label="Upload your design file"
              aria-invalid={!!errors.designFile}
              onChange={e=>{
                clearError('designFile');
                setFileName(e.target.files?.[0]?.name ?? '');
              }}/>
            {!fileName ? (
              <div className="qf-upload__body">
                <div className="qf-upload__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                </div>
                <strong>Click to upload or drag &amp; drop</strong>
                <span>JPG, PNG, PDF, SVG, AI — max 20MB</span>
              </div>
            ) : (
              <div className="qf-upload__preview">
                <div className="qf-upload__file-info">{fileName}</div>
                <button type="button" className="qf-upload__remove" onClick={e=>{
                  e.stopPropagation();
                  setFileName('');
                  const input = document.getElementById('qfDesignFile') as HTMLInputElement | null;
                  if (input) input.value = '';
                }}>× Remove</button>
              </div>
            )}
          </div>
          {errors.designFile && <p className="qf-error-msg">{errors.designFile}</p>}
        </fieldset>

        <fieldset className="qf-fieldset">
          <legend className="qf-legend">Additional Details</legend>
          <div className="qf-field">
            <label className="qf-label" htmlFor="qfMessage">Tell us more about your project <span className="qf-req">*</span></label>
            <textarea
              className={`qf-input qf-textarea${errors.message ? ' is-error' : ''}`}
              id="qfMessage" name="message" rows={5}
              aria-invalid={!!errors.message} aria-describedby={errors.message ? 'qfMessage-error' : undefined}
              onChange={() => clearError('message')}
              defaultValue={prefillMessage}
              placeholder="Describe your windows, rooms, style preferences, timeline, budget considerations, or anything else that would help us put together the best quote for you..."/>
            {errors.message && <p className="qf-error-msg" id="qfMessage-error">{errors.message}</p>}
          </div>
        </fieldset>

        <fieldset className="qf-fieldset">
          <legend className="qf-legend">How Did You Find Us?</legend>
          <div className="qf-chips" role="group">
            {['Google Search','Social Media','Friend / Referral','Returning Customer','Other'].map(label => (
              <label className="qf-chip" key={label}><input type="radio" name="source" value={label}/><span>{label}</span></label>
            ))}
          </div>
        </fieldset>

        <div className="qf-submit-row">
          <div className="qf-consent">
            <label className="qf-consent__label">
              <input type="checkbox" id="qfConsent" name="consent" onChange={() => clearError('consent')}/>
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
