import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Linkedin, Twitter, Github } from 'lucide-react';
import './Contact.css';

// Scroll Animation Hook
const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
};

// Animated Section Component
const AnimatedSection = ({ children, animation = "fade", className = "", delay = 0 }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`
        ${className}
        scroll-${animation}-in
        ${isVisible ? "visible" : ""}
      `}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
};

// Floating Label Input Component
const FloatingInput = ({ id, label, type = "text", required = false, value, onChange }) => {
  return (
    <div className="floating-form-group">
      <input
        type={type}
        id={id}
        className="floating-input"
        placeholder=" "
        value={value}
        onChange={onChange}
        required={required}
      />
      <label htmlFor={id} className="floating-label">
        {label}
      </label>
    </div>
  );
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@filmflow.com",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri from 9am to 6pm"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Creative Street, San Francisco, CA 94102",
      description: "Come say hello at our office"
    },
    {
      icon: Clock,
      title: "Response Time",
      content: "Within 24 hours",
      description: "We'll get back to you quickly"
    }
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", color: "#0077b5" },
    { icon: Twitter, href: "#", color: "#1da1f2" },
    { icon: Github, href: "#", color: "#333" }
  ];

  return (
    <div className="page-container">
      {/* Floating Background Elements */}
      <div className="floating-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>

      {/* Header Section */}
      <AnimatedSection animation="fade" delay={100}>
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with our team and let's create something amazing together.</p>
      </AnimatedSection>

      <div className="contact-content">
        {/* Contact Form */}
        <AnimatedSection animation="slide-right" delay={200} className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <FloatingInput
              id="name"
              label="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            
            <FloatingInput
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <FloatingInput
              id="subject"
              label="Subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
            />
            
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                className="form-input"
                rows="6"
                placeholder="Tell us about your project or inquiry..."
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send size={20} style={{ marginRight: '8px' }} />
                  Send Message
                </>
              )}
            </button>

            {isSubmitted && (
              <div className="success-message">
                <CheckCircle size={48} color="var(--accent-green)" />
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            )}
          </form>
        </AnimatedSection>

        {/* Contact Information */}
        <AnimatedSection animation="slide-left" delay={300} className="contact-info-container">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            
            {contactInfo.map((item, index) => (
              <div 
                key={index} 
                className="info-item"
                style={{ transitionDelay: `${index * 100 + 400}ms` }}
              >
                <div className="info-icon">
                  <item.icon size={24} color="white" />
                </div>
                <div className="info-content">
                  <h3>{item.title}</h3>
                  <p style={{ fontWeight: '600', marginBottom: '4px' }}>{item.content}</p>
                  <p style={{ fontSize: '0.9rem', opacity: '0.8' }}>{item.description}</p>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="social-section">
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Follow Us</h3>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ transitionDelay: `${index * 100 + 800}ms` }}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Map Section */}
      <AnimatedSection animation="fade" delay={500} className="map-section">
        <div className="map-container">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Our Location</h3>
          <div className="map-placeholder">
            <MapPin size={32} style={{ marginRight: '12px' }} />
            Interactive Map
          </div>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
            Visit our creative studio in the heart of San Francisco
          </p>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection animation="fade" delay={600} className="faq-section">
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Common Questions</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Can't find what you're looking for? Check out our{' '}
            <a href="/faq" style={{ color: 'var(--accent-purple)', textDecoration: 'none' }}>
              FAQ section
            </a>{' '}
            or reach out to us directly.
          </p>
        </div>
      </AnimatedSection>
    </div>
  );
}