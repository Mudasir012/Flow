import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Film,
  Sparkles,
  Zap,
  Check,
  Star,
  Shield,
  Play,
  ChevronRight,
  Users,
  Clock,
  Award,
  Headphones,
  X,
  Menu,
} from "lucide-react";

import Header from './Header'; // use shared header component
import Footer from './Footer'; // use shared footer component

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

// Particle Background Component
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(
          Math.random() * 100 + 100
        )}, ${Math.floor(Math.random() * 100 + 200)}, ${Math.random() * 0.3 + 0.1})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      const maxDistance = 100;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.2 * (1 - distance / maxDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
};

// Using external Header component from `./Header.jsx` (removed inline header to avoid duplication)

// Typing text component for hero
const TypingText = ({ words = [], speed = 80, pause = 1100 }) => {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const current = words[index % words.length];

    if (!isDeleting) {
      timer = setTimeout(() => {
        setDisplay(current.slice(0, display.length + 1));
        if (display.length + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      }, speed);
    } else {
      timer = setTimeout(() => {
        setDisplay(current.slice(0, display.length - 1));
        if (display.length === 0) {
          setIsDeleting(false);
          setIndex((i) => i + 1);
        }
      }, speed / 2);
    }

    return () => clearTimeout(timer);
  }, [display, isDeleting, index, words, speed, pause]);

  return (
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 font-bold">
      {display}
      <span className="ml-1 animate-pulse">|</span>
    </span>
  );
};

// Count up component for stats
const CountUp = ({ target = "0", duration = 1200 }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = null;
    const numeric = parseFloat(String(target).replace(/[^0-9\.]/g, "")) || 0;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * numeric));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  const suffix = String(target).replace(/[0-9\.]/g, "");

  return (
    <div ref={ref}>
      <span>{value}{suffix}</span>
    </div>
  );
};

// Tilt effect for interactive cards
const useTilt = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 5;
      const rotateX = -((y - centerY) / centerY) * 5;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      el.style.boxShadow = `0 25px 50px -12px rgba(${147 + rotateY * 10}, ${51 + rotateX * 10}, ${234}, 0.25)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      el.style.boxShadow = '0 20px 40px -12px rgba(0, 0, 0, 0.1)';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ref]);
};

// Progress Scrollbar Component
const ProgressScrollbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 h-1 w-full z-50 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 transition-all duration-300 shadow-lg"
        style={{ width: `${scrollProgress}%` }}
      />
      <div className="absolute top-1/2 right-0 w-3 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 animate-pulse shadow-md"></div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  const cardRef = useRef(null);
  const [ref, isVisible] = useScrollAnimation(0.1);
  useTilt(cardRef);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        ref={cardRef}
        className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
      >
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500 group-hover:duration-200" />
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <div className="relative">
          {/* Icon with Floating Animation */}
          <div className="mb-8 relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition duration-500" />
            <div className="relative inline-flex p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4 relative">
            {title}
            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-300 group-hover:w-24"></span>
          </h3>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            {description}
          </p>
          
          <Link to="/documentation" className="flex items-center text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
            <span className="mr-2">Learn more</span>
            <ChevronRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Pricing Card Component
const PricingCard = ({ plan, price, features, highlighted = false, delay }) => {
  const cardRef = useRef(null);
  const [ref, isVisible] = useScrollAnimation(0.1);
  useTilt(cardRef);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative">
        {highlighted && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
            <div className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-full shadow-lg flex items-center space-x-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Most Popular</span>
            </div>
          </div>
        )}
        
        <div
          ref={cardRef}
          className={`relative rounded-3xl p-8 transition-all duration-500 overflow-hidden ${
            highlighted
              ? "bg-gradient-to-b from-white to-purple-50 border-2 border-purple-200 shadow-2xl"
              : "bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          }`}
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-full -translate-y-16 translate-x-16" />
          
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{plan}</h3>
            <div className="flex items-baseline mb-3">
              <span className="text-6xl font-bold text-gray-900">${price}</span>
              <span className="text-gray-500 ml-2 text-lg">/month</span>
            </div>
            
            {price === 0 && (
              <p className="text-gray-600">Perfect for getting started</p>
            )}
            {price === 29 && (
              <p className="text-gray-600">For professional creators</p>
            )}
            {price === 99 && (
              <p className="text-gray-600">For teams & studios</p>
            )}
          </div>
          
          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <Check className="relative w-6 h-6 text-green-500 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>
          
          <Link
            to="/signup"
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group flex items-center justify-center ${
              highlighted
                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-2xl hover:shadow-purple-500/50"
                : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl"
            }`}
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ number, label, suffix = "", delay, icon: Icon }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`text-center p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative inline-flex mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-30 animate-pulse"></div>
        <div className="relative p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl transform transition-transform duration-500 hover:rotate-12">
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-3">
        <CountUp target={`${number}${suffix}`} />
      </div>
      
      <div className="text-gray-600 font-medium text-lg">{label}</div>
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ text, author, role, rating, delay }) => {
  const cardRef = useRef(null);
  const [ref, isVisible] = useScrollAnimation(0.1);
  useTilt(cardRef);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        ref={cardRef}
        className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
      >
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 text-purple-100 text-6xl font-serif">"</div>
        
        {/* Background Pattern */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 rounded-full -translate-x-16 translate-y-16" />
        
        <div className="flex mb-6">
          {[...Array(rating)].map((_, i) => (
            <Star
              key={i}
              className="w-6 h-6 text-yellow-400 fill-current transform hover:scale-125 transition-transform duration-300"
            />
          ))}
        </div>
        
        <p className="text-gray-700 text-xl mb-10 italic leading-relaxed relative z-10">
          "{text}"
        </p>
        
        <div className="flex items-center relative z-10">
          <div className="relative mr-4">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur group-hover:blur-lg transition-all duration-300"></div>
            <div className="relative w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {author.charAt(0)}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">{author}</h4>
            <p className="text-gray-600">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Floating Elements Component
const FloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 animate-float-slow">
        <div className="w-full h-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 animate-float-medium">
        <div className="w-full h-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-1/3 right-1/3 w-64 h-64 animate-float-fast">
        <div className="w-full h-full bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

// Mouse Trailer Component
const MouseTrailer = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed w-96 h-96 rounded-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 blur-3xl pointer-events-none z-0 transition-all duration-300 ease-out"
      style={{
        transform: `translate(${position.x - 192}px, ${position.y - 192}px)`,
      }}
    />
  );
};

// Main Component
const LandingPage = () => {
  const features = [
    {
      icon: Film,
      title: "AI-Powered Editing",
      description: "Let artificial intelligence handle the tedious work while you focus on creativity. Smart cuts, auto-color grading, and intelligent scene detection.",
      delay: 100,
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Real-time preview and rendering powered by cutting-edge technology. Export your masterpiece in seconds, not hours.",
      delay: 200,
    },
    {
      icon: Sparkles,
      title: "Professional Effects",
      description: "Hollywood-grade effects and transitions at your fingertips. Create stunning visuals without the learning curve.",
      delay: 300,
    },
    {
      icon: Camera,
      title: "4K & Beyond",
      description: "Support for all modern formats including 4K, 8K, HDR, and ProRes. Your content deserves the best quality.",
      delay: 400,
    },
  ];

  const testimonials = [
    {
      text: "Flow completely transformed my workflow. What used to take hours now takes minutes. The AI features are genuinely impressive.",
      author: "Sarah Chen",
      role: "Content Creator",
      rating: 5,
      delay: 100,
    },
    {
      text: "As a professional editor, I was skeptical at first. But Flow's quality and speed have made it an essential tool in my arsenal.",
      author: "Marcus Johnson",
      role: "Film Editor",
      rating: 5,
      delay: 200,
    },
    {
      text: "The interface is beautiful and intuitive. I went from beginner to creating professional videos in just a few days.",
      author: "Emma Rodriguez",
      role: "YouTuber",
      rating: 5,
      delay: 300,
    },
  ];

  const statsData = [
    { number: "50", suffix: "K+", label: "Active Users", icon: Users, delay: 100 },
    { number: "1", suffix: "M+", label: "Videos Created", icon: Film, delay: 200 },
    { number: "99", suffix: "%", label: "Satisfaction Rate", icon: Award, delay: 300 },
    { number: "24", suffix: "/7", label: "Support Available", icon: Headphones, delay: 400 },
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
      delay: 100,
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
      delay: 200,
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
      delay: 300,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Custom styles for animations */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0px, 0px); }
          33% { transform: translate(-30px, 10px); }
          66% { transform: translate(20px, -10px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translate(0px, 0px); }
          33% { transform: translate(20px, -15px); }
          66% { transform: translate(-15px, 15px); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translate(0px, 0px); }
          50% { transform: translate(-15px, 8px); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 15s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 10s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s ease infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #f3f4f6, #ffffff);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #7c3aed, #3b82f6);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #6d28d9, #2563eb);
        }
        
        /* Selection styles */
        ::selection {
          background: rgba(147, 51, 234, 0.3);
          color: white;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <Header />
      <ProgressScrollbar />
      <ParticleBackground />
      <FloatingElements />
      <MouseTrailer />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="relative">
                  {/* Animated Badge */}
                  <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20 shadow-lg mb-8 animate-pulse">
                    <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
                    <span className="text-sm font-semibold text-gray-700">
                      Now with Advanced AI
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 mb-6 lg:mb-8 leading-tight">
                    Create Stunning Videos{" "}
                    <span className="block">
                      <TypingText 
                        words={["in Minutes", "Cinematic", "like a Pro"]} 
                        speed={100}
                      />
                    </span>
                  </h1>

                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 lg:mb-12 max-w-2xl leading-relaxed">
                    The next generation of online video editors. Create cinematic
                    masterpieces with AI-powered tools that understand your
                    creative vision.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 mb-12 lg:mb-16">
                    <Link to="/signup" className="group relative px-8 lg:px-10 py-4 lg:py-5 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-base lg:text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 transform hover:-translate-y-1 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <span className="relative">Start Creating Free</span>
                    </Link>
                    
                    <a href="#features" className="group relative px-8 lg:px-10 py-4 lg:py-5 bg-white text-gray-800 font-bold text-base lg:text-lg rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 inline-flex items-center justify-center space-x-3">
                      <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full opacity-0 group-hover:opacity-10 blur transition duration-500"></div>
                        <Play className="relative w-5 lg:w-6 h-5 lg:h-6 transform transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <span>Watch Demo</span>
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 lg:gap-12">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">50K+</div>
                      <div className="text-gray-600">Creators</div>
                    </div>
                    <div className="w-px h-8 lg:h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">4.9/5</div>
                      <div className="text-gray-600">Rating</div>
                    </div>
                    <div className="w-px h-8 lg:h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">99.9%</div>
                      <div className="text-gray-600">Uptime</div>
                    </div>
                  </div>
                </div>

                {/* Hero Visual */}
                <div className="relative mt-12 lg:mt-0">
                  <div className="relative bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl lg:rounded-4xl p-6 lg:p-8 backdrop-blur-sm border border-white/20 shadow-2xl">
                    {/* Animated Border */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl lg:rounded-4xl opacity-0 hover:opacity-30 blur transition duration-1000 hover:duration-200"></div>
                    
                    <div className="relative bg-white rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-700 hover:scale-105">
                      {/* Mac-style Window Controls */}
                      <div className="h-10 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center px-4">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors duration-300 cursor-pointer"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors duration-300 cursor-pointer"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors duration-300 cursor-pointer"></div>
                        </div>
                      </div>
                      
                      <div className="p-6 lg:p-10">
                        {/* Timeline Visualization */}
                        <div className="mb-6 lg:mb-8">
                          <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4 lg:mb-6"></div>
                          <div className="flex justify-between">
                            <div className="w-12 lg:w-16 h-6 lg:h-8 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-lg animate-pulse"></div>
                            <div className="w-16 lg:w-24 h-6 lg:h-8 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-lg animate-pulse delay-300"></div>
                            <div className="w-14 lg:w-20 h-6 lg:h-8 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-lg animate-pulse delay-600"></div>
                          </div>
                        </div>
                        
                        {/* AI Feature Visualization */}
                        <div className="text-center">
                          <div className="relative inline-flex mb-4">
                            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur-lg opacity-20 animate-ping"></div>
                            <div className="relative w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center transform transition-all duration-500 hover:rotate-12 hover:scale-110">
                              <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                            </div>
                          </div>
                          <div className="text-lg lg:text-xl font-semibold text-gray-800">
                            AI Magic in Progress
                          </div>
                          <div className="text-gray-600 mt-2 text-sm lg:text-base">
                            Rendering your masterpiece...
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl animate-bounce"></div>
                  <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 w-14 h-14 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-xl animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
                Powerful Features
              </h2>
              <p className="text-lg lg:text-xl xl:text-2xl text-gray-600">
                Everything you need to create stunning videos
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
                Trusted by Creators
              </h2>
              <p className="text-lg lg:text-xl xl:text-2xl text-gray-600">
                Join thousands of creators who trust Flow
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {statsData.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg lg:text-xl xl:text-2xl text-gray-600">
                Choose the perfect plan for your creative needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-16 lg:mb-20">
              {pricingPlans.map((plan, index) => (
                <PricingCard key={index} {...plan} />
              ))}
            </div>

            <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-purple-100">
              <div className="flex items-center space-x-3 lg:space-x-4 mb-6">
                <div className="p-2 lg:p-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg">
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900">All plans include</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 lg:gap-4">
                {[
                  "No credit card required to start",
                  "Free updates & new features",
                  "Cancel anytime",
                  "Secure cloud storage",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-12 lg:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6">
                Loved by Creators
              </h2>
              <p className="text-lg lg:text-xl xl:text-2xl text-gray-600">
                See what our community has to say
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto text-center">
              <div className="relative">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl lg:rounded-4xl blur-3xl opacity-30"></div>
                
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl lg:rounded-4xl p-8 lg:p-16 overflow-hidden">
                  {/* Floating Particles */}
                  <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 lg:w-2 lg:h-2 bg-white rounded-full animate-ping"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 lg:mb-8">
                    Ready to Create Magic?
                  </h2>
                  <p className="text-lg lg:text-xl xl:text-2xl text-white/90 mb-8 lg:mb-12 max-w-3xl mx-auto">
                    Join thousands of creators already using Flow
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center">
                    <Link to="/signup" className="relative px-8 lg:px-12 py-4 lg:py-6 bg-white text-gray-900 font-bold text-base lg:text-xl rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                      <span className="relative">Start Free Trial</span>
                    </Link>
                    <Link to="/contact" className="relative px-8 lg:px-12 py-4 lg:py-6 bg-white/20 text-white font-bold text-base lg:text-xl rounded-2xl border-2 border-white hover:bg-white/30 transition-all duration-500 transform hover:-translate-y-1 group flex items-center justify-center">
                      <span className="relative">Schedule Demo</span>
                    </Link>
                  </div>
                  <p className="text-white/70 mt-8 lg:mt-10 text-base lg:text-lg">
                    No credit card required · 14-day trial
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;