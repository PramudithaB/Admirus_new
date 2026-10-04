import { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from '../../lib/animations';
import { useReducedMotion } from '../../hooks';
import { brand } from '../../data/brand';
import {
  ArrowUpRight, Send, Loader2, CheckCircle2,
  Mail, AlertCircle, RefreshCw
} from 'lucide-react';
import './Contact.css';

const serviceOptions = [
  'Social Media Strategy & Production',
  'Web Development & Digital Platforms',
  'Hi Cloth / Custom Apparel & Streetwear',
  'Brand Identity & 3D Motion (Sugar Pixel)',
  'Drone Cinematography (Drone Mahaththaya)',
  'Events & Activation (The Events by Admirus)',
  'Creative Campaigns & Content',
  'Other Bespoke Project',
];

const budgetOptions = [
  'Under $1,000 / LKR 300K',
  '$1,000 – $3,000 / LKR 300K – 1M',
  '$3,000 – $10,000 / LKR 1M – 3M',
  '$10,000+ / LKR 3M+',
  'Flexible / To Be Discussed',
];

export default function Contact() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    message: '',
  });

  // 'idle' | 'sending' | 'success' | 'needs_activation' | 'error'
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-headline span', { y: 100, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power4.out',
        scrollTrigger: { trigger: '.contact-headline', start: 'top 85%' },
      });

      gsap.fromTo('.contact-form-wrap', { y: 60, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-form-wrap', start: 'top 85%' },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Pre-configured mailto link as direct fallback
  const mailtoUrl = useMemo(() => {
    const subject = encodeURIComponent(
      `Project Inquiry: ${formData.service || 'Creative Services'} — ${formData.name || 'Client'}`
    );
    const body = encodeURIComponent(
      `Hi Admirus Team,\n\nI would like to inquire about your services.\n\n` +
      `• Name: ${formData.name || 'N/A'}\n` +
      `• Email: ${formData.email || 'N/A'}\n` +
      `• Company / Brand: ${formData.company || 'N/A'}\n` +
      `• Selected Service: ${formData.service || 'N/A'}\n` +
      `• Budget Range: ${formData.budget || 'N/A'}\n\n` +
      `Project Details:\n${formData.message || 'N/A'}\n\n` +
      `Best regards,\n${formData.name || 'Sender'}`
    );
    return `mailto:info@admirus.lk?subject=${subject}&body=${body}`;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus('sending');
    setStatusMessage('');

    try {
      const response = await fetch('https://formsubmit.co/ajax/info@admirus.lk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          Name: formData.name,
          Email: formData.email,
          Company: formData.company || 'Not Specified',
          Service: formData.service || 'General Inquiry',
          Budget: formData.budget || 'Not Specified',
          Message: formData.message,
          _subject: `New Project Inquiry from ${formData.name} (${formData.company || 'Direct'}) — Admirus OS`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await response.json();

      if (data.success === 'true' || data.success === true) {
        setStatus('success');
      } else if (data.message && data.message.toLowerCase().includes('activation')) {
        // FormSubmit sent the initial 1-time activation email to info@admirus.lk
        setStatus('needs_activation');
        setStatusMessage(
          "We've sent the initial verification email to info@admirus.lk. Please check your inbox and click 'Activate Form'."
        );
      } else {
        setStatus('error');
        setStatusMessage(data.message || 'Submission could not be completed.');
      }
    } catch (err) {
      console.error('Error submitting to info@admirus.lk:', err);
      setStatus('error');
      setStatusMessage('Network request failed. You can email info@admirus.lk directly.');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      service: '',
      budget: '',
      message: '',
    });
    setStatus('idle');
    setStatusMessage('');
  };

  return (
    <section ref={sectionRef} className="contact section" id="contact">
      <div className="container">
        <div className="contact-inner">
          {/* CTA Headline */}
          <div className="contact-cta">
            <h2 className="contact-headline heading-xl">
              <span className="contact-line-wrap"><span>HAVE AN</span></span>
              <span className="contact-line-wrap"><span>CONCEPT?</span></span>
              <span className="contact-line-wrap">
                <span className="contact-accent">LET'S MAKE</span>
              </span>
              <span className="contact-line-wrap">
                <span className="contact-accent">IT ICONIC.</span>
              </span>
            </h2>

            <div className="contact-info">
              <div className="contact-info-item">
                <span className="label">Direct Inquiries</span>
                <a href="mailto:info@admirus.lk" className="contact-email-link">
                  <Mail size={16} />
                  <span>info@admirus.lk</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
              <div className="contact-info-item">
                <span className="label">Phone</span>
                <a href={`tel:${brand.phone.replace(/\s/g, '')}`}>{brand.phone}</a>
              </div>
              <div className="contact-info-item">
                <span className="label">WhatsApp</span>
                <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer">
                  Message Us <ArrowUpRight size={14} style={{ display: 'inline' }} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrap">
            {status === 'success' ? (
              <div className="form-success">
                <div className="form-success-icon-wrap">
                  <CheckCircle2 size={48} className="form-success-icon" />
                </div>
                <h3 className="heading-sm">Message Sent to info@admirus.lk</h3>
                <p className="body-md">
                  Thank you, <strong>{formData.name}</strong>. Your project inquiry has been dispatched to our team at <strong>info@admirus.lk</strong>. We typically review and respond within 24 hours.
                </p>
                <div className="form-success-actions">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn btn-ghost"
                    data-cursor="link"
                  >
                    <RefreshCw size={14} />
                    <span>Send Another Inquiry</span>
                  </button>
                </div>
              </div>
            ) : status === 'needs_activation' ? (
              <div className="form-success form-activation">
                <div className="form-activation-icon-wrap">
                  <Mail size={44} className="form-activation-icon" />
                </div>
                <h3 className="heading-sm">Almost Done! First-Time Activation</h3>
                <p className="body-md">
                  FormSubmit sent a one-time activation link to <strong>info@admirus.lk</strong>.
                  Please open your inbox at <strong>info@admirus.lk</strong> and click <em>"Activate Form"</em> to permanently enable direct email delivery.
                </p>
                <div className="form-success-actions">
                  <a
                    href={mailtoUrl}
                    className="btn btn-primary"
                    data-cursor="link"
                  >
                    <Mail size={15} />
                    <span>Send Directly via Email App</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn btn-ghost"
                    data-cursor="link"
                  >
                    <span>Back to Form</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                {status === 'error' && (
                  <div className="form-error-banner">
                    <AlertCircle size={18} />
                    <div>
                      <p><strong>Submission issue:</strong> {statusMessage}</p>
                      <a href={mailtoUrl} className="form-error-mailto-link">
                        Click here to send directly via email to info@admirus.lk ➔
                      </a>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="contact-name" className="form-label">Name *</label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-email" className="form-label">Email Address *</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="contact-company" className="form-label">Company / Brand</label>
                    <input
                      type="text"
                      id="contact-company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company or brand"
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-service" className="form-label">Service Required</label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="form-input form-select"
                    >
                      <option value="">Select a service / module</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-budget" className="form-label">Estimated Budget (Optional)</label>
                  <select
                    id="contact-budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="form-input form-select"
                  >
                    <option value="">Select budget range</option>
                    {budgetOptions.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message" className="form-label">Project Details & Vision *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project, timeline, deliverables, or apparel specifications..."
                    rows={4}
                    required
                    className="form-input form-textarea"
                  />
                </div>

                <div className="form-footer-row">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn btn-primary form-submit"
                    data-cursor="link"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 size={16} className="btn-icon animate-spin" />
                        <span>Sending to info@admirus.lk...</span>
                      </>
                    ) : (
                      <>
                        <span>Send to info@admirus.lk</span>
                        <Send size={15} className="btn-icon" />
                      </>
                    )}
                  </button>

                  <a
                    href={mailtoUrl}
                    className="form-direct-mail-btn"
                    title="Or open directly in your mail application"
                    data-cursor="link"
                  >
                    <Mail size={14} />
                    <span>Open Email Draft</span>
                  </a>
                </div>

                <p className="form-note body-sm">
                  Submissions are sent directly to <strong>info@admirus.lk</strong>. We sign NDAs upon request and reply within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

