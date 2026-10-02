import { useRef, useEffect, useState } from 'react';
import { gsap } from '../../lib/animations';
import { useReducedMotion } from '../../hooks';
import { brand } from '../../data/brand';
import { ArrowUpRight, Send } from 'lucide-react';
import './Contact.css';

const serviceOptions = [
  'Social Media',
  'Web Development',
  'Branding',
  'Content',
  'Video',
  'Drone',
  'Events',
  'Other',
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
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission - needs backend integration
    console.log('Form data:', formData);
    setSubmitted(true);
  };

  return (
    <section ref={sectionRef} className="contact section" id="contact">
      <div className="container">
        <div className="contact-inner">
          {/* CTA Headline */}
          <div className="contact-cta">
            <h2 className="contact-headline heading-xl">
              <span className="contact-line-wrap"><span>HAVE AN</span></span>
              <span className="contact-line-wrap"><span>IDEA?</span></span>
              <span className="contact-line-wrap">
                <span className="contact-accent">LET'S MAKE</span>
              </span>
              <span className="contact-line-wrap">
                <span className="contact-accent">IT ICONIC.</span>
              </span>
            </h2>

            <div className="contact-info">
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
            {submitted ? (
              <div className="form-success">
                <h3 className="heading-sm">Message Received.</h3>
                <p className="body-md">We'll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="contact-name" className="form-label">Name</label>
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
                    <label htmlFor="contact-email" className="form-label">Email</label>
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
                    <label htmlFor="contact-company" className="form-label">Company</label>
                    <input
                      type="text"
                      id="contact-company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company"
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-service" className="form-label">Service</label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="form-input form-select"
                      required
                    >
                      <option value="">Select a service</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message" className="form-label">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    rows={4}
                    required
                    className="form-input form-textarea"
                  />
                </div>

                <button type="submit" className="btn btn-primary form-submit" data-cursor="link">
                  <span>Send Message</span>
                  <Send size={16} className="btn-icon" />
                </button>

                <p className="form-note body-sm">
                  {/* NOTE: This form currently logs to console. Backend integration needed. */}
                  We typically respond within 24 hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
