import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Film,
  Sparkles,
  Zap,
  Users,
  Award,
  Play,
  Pause,
  Volume2,
  Check,
  Star,
  Clock,
  Globe,
  Shield,
} from "lucide-react";
import "./HomePage.css";
import TiltedCard from "./components/TitledCard";

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
const AnimatedSection = ({
  children,
  animation = "fade",
  className = "",
  delay = 0,
}) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`
        ${className}
        scroll-${animation}-in
        ${isVisible ? "visible" : ""}
      `}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
};

// Progress Scrollbar Component
const ProgressScrollbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div className="progress-scroll" style={{ width: `${scrollProgress}%` }} />
  );
};

// Feature Card Component
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color1,
  color2,
  delay,
}) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <AnimatedSection animation="scale" delay={delay}>
      <div
        ref={cardRef}
        className="feature-card"
        onMouseMove={handleMouseMove}
        style={{
          "--icon-color-1": color1,
          "--icon-color-2": color2,
        }}
      >
        <div className="feature-icon">
          <Icon size={28} color="white" />
        </div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
      </div>
    </AnimatedSection>
  );
};

// Pricing Card Component
const PricingCard = ({ plan, price, features, highlighted = false, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`pricing-card ${highlighted ? "highlighted" : ""} ${
        isVisible ? "visible" : ""
      }`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {highlighted && <div className="popular-badge">Most Popular</div>}
      <div className="pricing-header">
        <h3 className="plan-name">{plan}</h3>
        <div className="price-container">
          <span className="price">${price}</span>
          <span className="period">/month</span>
        </div>
        {price === 0 && (
          <p className="price-description">Perfect for getting started</p>
        )}
        {price === 29 && (
          <p className="price-description">For professional creators</p>
        )}
        {price === 99 && (
          <p className="price-description">For teams & studios</p>
        )}
      </div>
      <div className="pricing-features">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            <Check size={18} className="feature-check" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <button
        className={`pricing-button ${highlighted ? "highlighted-button" : ""}`}
      >
        Get Started
      </button>
      {price === 0 && (
        <p className="trial-text">14-day free trial on all paid plans</p>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ number, label, suffix = "", delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`stat-card ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      <span className="stat-number">
        {number}
        {suffix}
      </span>
      <div className="stat-label">{label}</div>
    </div>
  );
};

// Main Component
export default function HomePage() {
  const features = [
    {
      icon: Film,
      title: "AI-Powered Editing",
      description:
        "Let artificial intelligence handle the tedious work while you focus on creativity. Smart cuts, auto-color grading, and intelligent scene detection.",
      color1: "#b794f6",
      color2: "#7dd3fc",
      delay: 100,
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Real-time preview and rendering powered by cutting-edge technology. Export your masterpiece in seconds, not hours.",
      color1: "#7dd3fc",
      color2: "#86efac",
      delay: 200,
    },
    {
      icon: Sparkles,
      title: "Professional Effects",
      description:
        "Hollywood-grade effects and transitions at your fingertips. Create stunning visuals without the learning curve.",
      color1: "#f5a3d0",
      color2: "#b794f6",
      delay: 300,
    },
    {
      icon: Camera,
      title: "4K & Beyond",
      description:
        "Support for all modern formats including 4K, 8K, HDR, and ProRes. Your content deserves the best quality.",
      color1: "#86efac",
      color2: "#7dd3fc",
      delay: 400,
    },
  ];

  const testimonials = [
    {
      text: "Flow completely transformed my workflow. What used to take hours now takes minutes. The AI features are genuinely impressive.",
      author: "Sarah Chen",
      role: "Content Creator",
      rating: 5,
    },
    {
      text: "As a professional editor, I was skeptical at first. But Flow's quality and speed have made it an essential tool in my arsenal.",
      author: "Marcus Johnson",
      role: "Film Editor",
      rating: 5,
    },
    {
      text: "The interface is beautiful and intuitive. I went from beginner to creating professional videos in just a few days.",
      author: "Emma Rodriguez",
      role: "YouTuber",
      rating: 5,
    },
  ];

  const statsData = [
    { number: "50", suffix: "K+", label: "Active Users" },
    { number: "1", suffix: "M+", label: "Videos Created" },
    { number: "99", suffix: "%", label: "Satisfaction Rate" },
    { number: "24", suffix: "/7", label: "Support Available" },
  ];

  const pricingPlans = [
    {
      plan: "Free",
      price: 0,
      features: [
        "Up to 10 minutes of video",
        "Basic editing tools",
        "720p export",
        "Watermark on exports",
        "5GB cloud storage",
        "Community support",
      ],
    },
    {
      plan: "Pro",
      price: 29,
      features: [
        "Unlimited video length",
        "All AI editing features",
        "4K export",
        "No watermark",
        "100GB cloud storage",
        "Priority support",
        "Advanced effects library",
        "Team collaboration",
      ],
      highlighted: true,
    },
    {
      plan: "Enterprise",
      price: 99,
      features: [
        "Everything in Pro",
        "Custom video length",
        "8K & HDR support",
        "Unlimited storage",
        "Dedicated account manager",
        "SLA & custom contracts",
        "On-premise deployment",
        "Custom AI training",
      ],
    },
  ];

  return (
    <>
      <div className="Home">
        <ProgressScrollbar />

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>
        <div className="heropage">
          {/* Hero Section */}
          <AnimatedSection className="hero-section" animation="fade">
            <div
              className="info"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div className="left" style={{ flex: "1", minWidth: "300px" }}>
                <div className="hero-badge">
                  <Sparkles size={16} />
                  <span>Now with Advanced AI</span>
                </div>

                <h1 className="hero-title">Welcome to Flow</h1>

                <p className="hero-subtitle">
                  The next generation of online video editors. Create cinematic
                  masterpieces with AI-powered tools that understand your
                  creative vision.
                </p>

                <div className="hero-cta">
                  <button className="cta-button cta-primary">
                    Start Creating Free
                  </button>
                  <button className="cta-button cta-secondary">
                    Watch Demo
                  </button>
                </div>
              </div>
              <div className="right" style={{ flex: "1", minWidth: "300px" }}>
                <AnimatedSection animation="scale" delay={300}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TiltedCard
                      imageSrc="EditorImage.png"
                      altText="Video Editor Sneakpeek"
                      captionText="Video Editor Sneakpeek"
                      containerHeight="300px"
                      containerWidth="300px"
                      imageHeight="300px"
                      imageWidth="500px"
                      rotateAmplitude={6}
                      scaleOnHover={1.1}
                      showMobileWarning={false}
                      showTooltip={true}
                      displayOverlayContent={true}
                      overlayContent={
                        <p className="tilted-card-demo-text">Sneak Peak</p>
                      }
                    />
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </AnimatedSection>

          {/* Features Section */}
          <AnimatedSection className="features-section" animation="fade">
            <div className="section-header">
              <h2 className="section-title">Powerful Features</h2>
              <p className="section-subtitle">
                Everything you need to create stunning videos
              </p>
            </div>
            <div className="feature-cards stagger-children">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </AnimatedSection>

          {/* Stats Section */}
          <AnimatedSection className="stats-section" animation="fade">
            <div className="section-header">
              <h2 className="section-title">By the Numbers</h2>
              <p className="section-subtitle">Trusted by creators worldwide</p>
            </div>
            <div className="stats-grid">
              {statsData.map((stat, index) => (
                <StatCard
                  key={index}
                  number={stat.number}
                  suffix={stat.suffix}
                  label={stat.label}
                  delay={index * 100}
                />
              ))}
            </div>
          </AnimatedSection>

          {/* Pricing Section */}
          <AnimatedSection className="pricing-section" animation="fade">
            <div className="section-header">
              <h2 className="section-title">Simple, Transparent Pricing</h2>
              <p className="section-subtitle">
                Choose the perfect plan for your creative needs
              </p>
            </div>
            <div className="pricing-container">
              {pricingPlans.map((plan, index) => (
                <PricingCard
                  key={index}
                  plan={plan.plan}
                  price={plan.price}
                  features={plan.features}
                  highlighted={plan.highlighted}
                  delay={index * 150}
                />
              ))}
            </div>
            <div className="pricing-features-comparison">
              <div className="comparison-header">
                <Shield size={24} />
                <h3>All plans include</h3>
              </div>
              <div className="comparison-features">
                <div className="comparison-item">
                  <Check size={20} className="check-icon" />
                  <span>No credit card required to start</span>
                </div>
                <div className="comparison-item">
                  <Check size={20} className="check-icon" />
                  <span>Free updates & new features</span>
                </div>
                <div className="comparison-item">
                  <Check size={20} className="check-icon" />
                  <span>Cancel anytime</span>
                </div>
                <div className="comparison-item">
                  <Check size={20} className="check-icon" />
                  <span>Secure cloud storage</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Testimonials Section */}
          <AnimatedSection
            className="testimonials-section"
            animation="fade"
            delay={500}
          >
            <div className="section-header">
              <h2 className="section-title">Loved by Creators</h2>
              <p className="section-subtitle">
                Join thousands of creators who trust Flow
              </p>
            </div>
            <div className="testimonial-grid stagger-children">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={20} fill="#FFD700" color="#FFD700" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div className="author-info">
                      <h4>{testimonial.author}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Enhanced CTA Section */}
          <AnimatedSection className="cta-section" animation="scale">
            <div className="cta-background"></div>
            <div className="section-header">
              <h2 className="section-title">Ready to Create Magic?</h2>
              <p className="section-subtitle">
                Join thousands of creators already using Flow
              </p>
              <div className="hero-cta">
                <button className="cta-button cta-primary">
                  Start Free Trial
                </button>
                <button className="cta-button cta-secondary">
                  Schedule Demo
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Enhanced Footer */}
          <footer className="footer">
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">Use Cases</a>
                <a href="#">Updates</a>
              </div>
              <div className="footer-column">
                <h4>Resources</h4>
                <a href="#">Documentation</a>
                <a href="#">Tutorials</a>
                <a href="#">Blog</a>
                <a href="#">Community</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="/about">About</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
                <a href="#">Press</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Security</a>
                <a href="#">Compliance</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 Flow. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
