import { useState } from 'react';
import { motion } from 'framer-motion';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="tbm-contact" id="contact">
      <div className="tbm-container">

        {/* Contact Split Grid */}
        <div className="tbm-contact__grid">
          {/* Left Column: Direct Outreach & Location */}
          <div className="tbm-contact__info">
            <span className="tbm-sectionEyebrow">
              <span className="tbm-eyebrowLine" />
              005 — START A CONVERSATION
            </span>

            <h2 className="tbm-contact__title">
              Let’s Produce Your<br />
              Next Masterpiece.
            </h2>
            <p className="tbm-contact__desc">
              Have a commercial brief, brand film campaign, or production requirement? Reach out directly to our production desk in Mumbai.
            </p>


            {/* Quick Action Badges */}
            <div className="tbm-contact__channels">
              <a
                href="mailto:production@theboredmonkey.com"
                className="tbm-channelBtn"
                title="Send Email"
              >
                <span className="tbm-channelIcon">✉</span>
                <span>production@theboredmonkey.com</span>
              </a>

              <a
                href="tel:+919876543210"
                className="tbm-channelBtn"
                title="Call Studio"
              >
                <span className="tbm-channelIcon">✆</span>
                <span>+91 98200 00000</span>
              </a>

              <a
                href="https://wa.me/919820000000"
                target="_blank"
                rel="noreferrer"
                className="tbm-channelBtn"
                title="WhatsApp Direct"
              >
                <span className="tbm-channelIcon">💬</span>
                <span>WhatsApp Production Desk</span>
              </a>
            </div>

            <div className="tbm-contact__address">
              <span className="tbm-addressLabel">STUDIO HEADQUARTERS</span>
              <p>TheBoredMonkey Studios, Film City Link Rd, Goregaon East, Mumbai, Maharashtra 400065</p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="tbm-contact__formWrap">
            {submitted ? (
              <motion.div
                className="tbm-contact__success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="tbm-successIcon">✓</div>
                <h3>Message Received</h3>
                <p>Our production team will review your brief and get back to you within 24 hours.</p>
                <button
                  type="button"
                  className="tbm-resetBtn"
                  onClick={() => setSubmitted(false)}
                >
                  SEND ANOTHER MESSAGE
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="tbm-form">
                <div className="tbm-formField">
                  <label htmlFor="contact-name">Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Your Name or Brand"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="tbm-formField">
                  <label htmlFor="contact-email">Email *</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="brand@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="tbm-formField">
                  <label htmlFor="contact-mobile">Mobile Number *</label>
                  <input
                    id="contact-mobile"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>

                <div className="tbm-formField">
                  <label htmlFor="contact-message">Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Tell us about the project, expected dates, and deliverables..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="tbm-submitBtn">
                  <span>SUBMIT NOW</span>
                  <span className="tbm-submitArrow">→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ─── High-Fashion / Cinematic Studio Footer (Kookie Kollective Style) ─── */}
      <footer className="tbm-footer">
        <div className="tbm-container">
          {/* Large Studio Name Monolith with Official Logo */}
          <div className="tbm-footer__monolith">
            <div className="tbm-footer__logoWrap">
              <img
                src="/tbm-logo.png"
                alt="TheBoredMonkey Studios"
                className="tbm-footer__logo"
              />
            </div>
            <span className="tbm-footer__brandName">THEBOREDMONKEY</span>
            <span className="tbm-footer__brandSub">STUDIOS · PRODUCTION & POST · MUMBAI</span>
          </div>


          <div className="tbm-footer__grid">
            {/* Col 1: Divisions */}
            <div className="tbm-footer__col">
              <span className="tbm-footer__colHeader">DIVISIONS</span>
              <ul className="tbm-footer__list">
                <li>Commercial Production</li>
                <li>Brand Films & DVCs</li>
                <li>4K High-Speed Food & Macro</li>
                <li>Color Grading & Mastering</li>
                <li>VFX & Motion Design</li>
              </ul>
            </div>

            {/* Col 2: Inquiries */}
            <div className="tbm-footer__col">
              <span className="tbm-footer__colHeader">DIRECT INQUIRIES</span>
              <ul className="tbm-footer__list">
                <li>
                  <span className="tbm-dimLabel">New Business:</span>
                  <a href="mailto:production@theboredmonkey.com">production@theboredmonkey.com</a>
                </li>
                <li>
                  <span className="tbm-dimLabel">Careers & Crew:</span>
                  <a href="mailto:crew@theboredmonkey.com">crew@theboredmonkey.com</a>
                </li>
                <li>
                  <span className="tbm-dimLabel">Agency Desk:</span>
                  <a href="mailto:agency@theboredmonkey.com">agency@theboredmonkey.com</a>
                </li>
              </ul>
            </div>

            {/* Col 3: Social & Press */}
            <div className="tbm-footer__col">
              <span className="tbm-footer__colHeader">FOLLOW</span>
              <ul className="tbm-footer__list">
                <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram ↗</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn ↗</a></li>
                <li><a href="https://vimeo.com" target="_blank" rel="noreferrer">Vimeo ↗</a></li>
                <li><a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube ↗</a></li>
              </ul>
            </div>

            {/* Col 4: Location */}
            <div className="tbm-footer__col">
              <span className="tbm-footer__colHeader">LOCATIONS</span>
              <p className="tbm-footer__text">
                Mumbai Studio & Soundstage<br />
                Pan-India & International Production Network
              </p>
              <div className="tbm-footer__localTime">
                <span className="tbm-footer__timeDot" />
                <span>MUMBAI IST (UTC+05:30)</span>
              </div>
            </div>
          </div>

          {/* Bottom Hairline & Legal Bar */}
          <div className="tbm-footer__bottomBar">
            <span className="tbm-footer__copy">
              © {new Date().getFullYear()} TheBoredMonkey Studios Pvt. Ltd. All rights reserved.
            </span>
            <div className="tbm-footer__legalLinks">
              <a href="#home">Back To Top ↑</a>
              <span>·</span>
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Terms of Production</span>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
