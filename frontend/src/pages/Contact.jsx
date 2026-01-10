import React, { useRef, useEffect, useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, User, CheckCircle, Shield, Zap, HelpCircle, AlertCircle, Plus } from "lucide-react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Contact Form Component
const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Prepare data for backend (include subject and category in message)
      const messageWithContext = `Category: ${formData.category}\nSubject: ${formData.subject}\n\n${formData.message}`;
      
      const response = await axios.post(`${API_URL}/contact`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        message: messageWithContext
      });
      
      if (response.data.ok) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
          category: "general"
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.error || 'Failed to send message. Please try again.');
      console.error('Contact form error:', err);
    }
  };

  const formRef = useRef(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          form.style.opacity = "1";
          form.style.transform = "translateY(0)";
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={formRef}
      className="bg-slate-800/50 backdrop-blur-2xl rounded-[32px] p-12 border border-white/10 shadow-2xl transition-all duration-700 opacity-0 translate-y-8"
    >
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold mb-3 text-slate-100 italic tracking-tight">Send Us a Message</h3>
        <p className="text-slate-400 text-lg">We typically respond within 24 hours</p>
      </div>

      {isSubmitted ? (
        <div className="text-center p-10 bg-green-500/10 border border-green-500/30 rounded-2xl mb-8 animate-[fadeIn_0.5s_ease]">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h4 className="text-2xl font-bold mb-3 text-slate-100">Message Sent Successfully!</h4>
          <p className="text-slate-400 max-w-md mx-auto">
            Thank you for reaching out. Our team will get back to you shortly.
          </p>
        </div>
      ) : null}

      {error && (
        <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-2xl mb-8">
          <AlertCircle size={32} className="text-red-500 mx-auto mb-3" />
          <p className="text-red-400 font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">
              First Name *
            </label>
            <div className="relative group">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                placeholder="John"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-300">
              Last Name *
            </label>
            <div className="relative group">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                placeholder="Doe"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Email *
          </label>
          <div className="relative group">
            <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-3">
            Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "general", label: "General", icon: HelpCircle },
              { value: "support", label: "Support", icon: Shield },
              { value: "sales", label: "Sales", icon: Zap },
              { value: "feedback", label: "Feedback", icon: MessageSquare }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = formData.category === item.value;
              
              return (
                <label
                  key={item.value}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isActive 
                      ? "bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]" 
                      : "bg-slate-900/30 border-slate-700 hover:border-slate-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={item.value}
                    checked={isActive}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Icon size={20} className={`mb-2 ${isActive ? "text-purple-400" : "text-slate-400"}`} />
                  <span className={`text-sm font-semibold ${isActive ? "text-purple-300" : "text-slate-400"}`}>
                    {item.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Subject *
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 rounded-xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            placeholder="How can we help?"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Message *
          </label>
          <div className="relative group">
            <MessageSquare size={20} className="absolute left-4 top-4 text-slate-500 group-focus-within:text-purple-500 transition-colors" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-100 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
              placeholder="Tell us more about your project..."
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Shield size={14} className="text-purple-500" />
            Your information is secure and encrypted
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              isSubmitting 
                ? "bg-slate-700 text-slate-500" 
                : "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 active:scale-95"
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Message
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Contact Card Component
const ContactCard = ({ icon: Icon, title, value, description, delay }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, delay || 0);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(card);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className="p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-white/10 text-center shadow-2xl transition-all duration-500 opacity-0 translate-y-5"
      style={{ transitionDelay: `${delay || 0}ms` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
        e.currentTarget.style.borderColor = "rgba(124, 58, 237, 0.5)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(124, 58, 237, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-500 shadow-lg shadow-purple-500/20">
        <Icon size={32} color="white" />
      </div>
      <h4 className="text-xl font-bold mb-2 text-slate-100">
        {title}
      </h4>
      <p className="text-lg font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        {value}
      </p>
      <p className="text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    const item = itemRef.current;
    if (!item) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          }, index * 100);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(item);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div 
      ref={itemRef}
      className={`bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/5 mb-4 shadow-xl transition-all duration-500 opacity-0 translate-y-5 ${
        isOpen ? "ring-2 ring-purple-500/20 border-purple-500/30" : "hover:bg-slate-800/60"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex justify-between items-center text-left"
      >
        <span className={`text-lg font-semibold transition-colors ${isOpen ? "text-purple-400" : "text-slate-100"}`}>
          {question}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? "bg-purple-600 rotate-45" : "bg-slate-700"
        }`}>
          <Plus size={16} className="text-white" />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-[500px] opacity-100 p-6 pt-0" : "max-h-0 opacity-0"
      }`}>
        <p className="text-slate-400 leading-relaxed text-base border-t border-white/5 pt-4">
          {answer}
        </p>
      </div>
    </div>
  );
};

// Main Contact Page Component
export default function ContactPage() {
  const faqs = [
    {
      question: "How quickly can I expect a response?",
      answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please indicate 'URGENT' in your subject line."
    },
    {
      question: "Do you offer enterprise pricing?",
      answer: "Yes, we offer custom enterprise plans with additional features, dedicated support, and volume discounts. Please contact our sales team for a personalized quote."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide email support for all users, priority support for Pro users, and dedicated account managers for Enterprise customers."
    },
    {
      question: "Can I schedule a product demo?",
      answer: "Absolutely! Our team would be happy to provide a personalized demo of our platform. Please contact our sales team to schedule a session."
    },
    {
      question: "Do you have an affiliate program?",
      answer: "Yes, we have an affiliate program that rewards creators for referring new users to Flow. Contact our partnerships team for more information."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 relative overflow-hidden font-inter">
      <Header />
      
      {/* Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 z-10">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full mb-8">
              <Mail size={16} className="text-purple-400" />
              <span className="text-purple-300 font-semibold text-sm">Get in Touch</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Let's <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent underline decoration-purple-500/30">Connect</span> & Create
            </h1>
            
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              Have questions, feedback, or partnership ideas? We'd love to hear from you. 
              Our team is here to help you succeed in your creative journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section style={{
        padding: "80px 0",
        position: "relative",
        zIndex: "2",
        background: "#ffffff"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px",
            marginBottom: "60px"
          }}>
            <ContactCard
              icon={Mail}
              title="Email Us"
              value="mudasirj839@gmail.com"
              description="For general inquiries and support"
              delay={0}
            />
            <ContactCard
              icon={Phone}
              title="Call Us"
              value="0314-111111111"
              description="Mon-Fri, 9AM-6PM EST"
              delay={100}
            />
            <ContactCard
              icon={MapPin}
              title="Visit Us"
              value="Abbottabad, KP, Pakistan"
              description="Schedule an in-person meeting"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="relative py-20 z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <ContactForm />
            </div>

            {/* Additional Info */}
            <div className="order-1 lg:order-2 space-y-12">
              <div>
                <h3 className="text-3xl font-bold mb-8 text-slate-100 italic tracking-tight underline decoration-purple-500/30">Why Contact Us?</h3>
                
                <div className="space-y-8">
                  {[
                    { icon: MessageSquare, title: "Product Support", desc: "Get help with features, troubleshooting, or account issues." },
                    { icon: Zap, title: "Sales & Partnerships", desc: "Inquire about enterprise plans, partnerships, or custom solutions." },
                    { icon: HelpCircle, title: "Feedback & Ideas", desc: "Share your thoughts, suggestions, or feature requests." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-6 group">
                      <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600/20 transition-all duration-300">
                        <item.icon size={24} className="text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2 text-slate-100 group-hover:text-purple-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-slate-400 text-base leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-all duration-700" />
                
                <h4 className="text-2xl font-bold mb-8 text-slate-100 flex items-center gap-3">
                  <Clock size={24} className="text-purple-400" />
                  Business Hours
                </h4>
                
                <div className="space-y-4">
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
                    { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
                    { day: "Sunday", hours: "Email Support Only" }
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                      <span className="text-slate-300 font-medium">{item.day}</span>
                      <span className="text-purple-400 font-bold">{item.hours}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-purple-600/10 border border-purple-500/20 rounded-xl">
                  <p className="text-purple-300 text-sm text-center font-medium">
                    ✨ Emergency support available 24/7 for Enterprise
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 z-10">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-100">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-lg">
              Quick answers to common questions about FlowGram
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} {...faq} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 z-10">
        <div className="container mx-auto px-6">
          <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-[40px] p-12 md:p-20 overflow-hidden shadow-2xl shadow-purple-500/20">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
                Need Immediate Help?
              </h2>
              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                Check our comprehensive documentation and community forums for quick answers and peer support.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/documentation" 
                  className="px-10 py-4 bg-white text-purple-600 font-bold rounded-xl hover:shadow-xl hover:shadow-white/20 transition-all duration-300 hover:-translate-y-1 active:scale-95"
                >
                  Visit Help Center
                </Link>
                <a 
                  href="https://discord.gg/flowgram" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-10 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 hover:-translate-y-1 active:scale-95"
                >
                  Join Community
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}