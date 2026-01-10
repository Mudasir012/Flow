import React, { useRef, useEffect, useState } from "react";
import { Users, Target, Heart, Award, Globe, TrendingUp, Sparkles, Zap, Shield, Camera, Clock, Check, Linkedin, Twitter, Instagram } from "lucide-react";
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

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

// Particle Background Component for About Page
const AboutParticleBackground = () => {
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
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.color = `rgba(${Math.floor(Math.random() * 50 + 0)}, ${Math.floor(
          Math.random() * 100 + 100
        )}, ${Math.floor(Math.random() * 200 + 200)}, ${Math.random() * 0.2 + 0.05})`;
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
      const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      const maxDistance = 80;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.strokeStyle = `rgba(0, 123, 255, ${0.1 * (1 - distance / maxDistance)})`;
            ctx.lineWidth = 0.3;
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
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
};

// Floating Elements for About Page
const AboutFloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Blue gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 animate-float-slow">
        <div className="w-full h-full bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 animate-float-medium">
        <div className="w-full h-full bg-gradient-to-r from-indigo-600/10 to-blue-600/10 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-1/3 right-1/3 w-64 h-64 animate-float-fast">
        <div className="w-full h-full bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

// Team Member Component with Tailwind
const TeamMember = ({ name, role, imageColor, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 4;
      const rotateX = -((y - centerY) / centerY) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        ref={cardRef}
        className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
      >
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500 group-hover:duration-200" />
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <div className="relative z-10">
          {/* Avatar */}
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center border-4"
            style={{ 
              borderColor: imageColor,
              background: `linear-gradient(135deg, ${imageColor}1A, ${imageColor}33)`
            }}
          >
            <span className="text-2xl font-bold text-gray-900">
              {name.charAt(0)}
            </span>
          </div>
          
          <h4 className="text-xl font-bold text-gray-900 text-center mb-1">
            {name}
          </h4>
          
          <p className="text-blue-600 text-center mb-6 text-sm font-medium">
            {role}
          </p>
          
          {/* Social Links */}
          <div className="flex justify-center gap-2">
            <a 
              href="#"
              className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group-hover:scale-110"
            >
              <Linkedin className="w-3 h-3" />
            </a>
            <a 
              href="#"
              className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group-hover:scale-110"
              style={{ transitionDelay: '50ms' }}
            >
              <Twitter className="w-3 h-3" />
            </a>
            <a 
              href="#"
              className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 group-hover:scale-110"
              style={{ transitionDelay: '100ms' }}
            >
              <Instagram className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Value Card Component with Tailwind
const ValueCard = ({ icon: Icon, title, description, color, index }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 3;
      const rotateX = -((y - centerY) / centerY) * 3;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0 rotate-y-0" : "opacity-0 translate-y-8 rotate-y-12"
      }`}
      style={{ 
        transitionDelay: `${index * 100}ms`,
        transformStyle: 'preserve-3d'
      }}
    >
      <div
        ref={cardRef}
        className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full -translate-y-16 translate-x-16" />
        
        {/* Icon Container */}
        <div 
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
          style={{ background: color }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl" />
          <Icon className="w-7 h-7 text-white relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
        
        {/* Animated underline */}
        <div className="mt-6 w-12 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transform transition-all duration-300 group-hover:w-20"></div>
      </div>
    </div>
  );
};

// Timeline Item Component with Tailwind
const TimelineItem = ({ year, title, description, color, index }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`relative mb-16 pl-20 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-x-0" : `opacity-0 ${index % 2 === 0 ? "-translate-x-8" : "translate-x-8"}`
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Timeline dot */}
      <div 
        className="absolute left-7 top-0 w-4 h-4 rounded-full border-4 border-white z-10 shadow-lg"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: color }} />
      </div>
      
      {/* Content Card */}
      <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
        {/* Gradient Border Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500" />
        
        <div className="relative z-10">
          <div className="text-blue-600 font-semibold mb-2">
            {year}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {title}
          </h3>
          
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
          
          {/* Year indicator line */}
          <div className="absolute -left-12 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Animated Counter Component with Tailwind
const AnimatedCounter = ({ end, suffix = "", label, color }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);

  useEffect(() => {
    if (isVisible && count === 0) {
      let start = 0;
      const duration = 1500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
    }
  }, [isVisible, end, count]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div
        ref={counterRef}
        className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 text-center"
      >
        {/* Hover Effect Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div 
            className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
            style={{ color }}
          >
            {count}{suffix}
          </div>
          
          <div className="text-gray-600 font-semibold text-sm uppercase tracking-wider">
            {label}
          </div>
        </div>
        
        {/* Animated border on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-30 blur transition duration-500" />
      </div>
    </div>
  );
};

// Main About Page Component
export default function AboutPage() {
  // Add custom animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
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
      
      .animate-float-slow {
        animation: float-slow 25s ease-in-out infinite;
      }
      
      .animate-float-medium {
        animation: float-medium 20s ease-in-out infinite;
      }
      
      .animate-float-fast {
        animation: float-fast 15s ease-in-out infinite;
      }
      
      .rotate-y-12 {
        transform: rotateY(12deg);
      }
      
      .rotate-y-0 {
        transform: rotateY(0deg);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const values = [
    {
      icon: Heart,
      title: "User First",
      description: "Every decision starts with our users. We build tools that solve real problems for real creators.",
      color: "linear-gradient(135deg, #007bff, #0056b3)"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We push boundaries and embrace new technologies to stay ahead of the creative curve.",
      color: "linear-gradient(135deg, #17a2b8, #007bff)"
    },
    {
      icon: Shield,
      title: "Trust",
      description: "Your content is sacred. We provide enterprise-grade security and reliable infrastructure.",
      color: "linear-gradient(135deg, #0056b3, #004085)"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "We celebrate diversity and build tools that work for creators from every culture and background.",
      color: "linear-gradient(135deg, #007bff, #17a2b8)"
    }
  ];

  const teamMembers = [
    { name: "Alex Morgan", role: "CEO & Founder", imageColor: "#007bff", delay: 100 },
    { name: "Sophia Chen", role: "Head of Product", imageColor: "#0056b3", delay: 200 },
    { name: "Marcus Lee", role: "CTO", imageColor: "#17a2b8", delay: 300 },
    { name: "Isabella Rossi", role: "Creative Director", imageColor: "#004085", delay: 400 },
    { name: "David Kim", role: "Lead Engineer", imageColor: "#007bff", delay: 500 },
    { name: "Emma Wilson", role: "Head of Marketing", imageColor: "#0056b3", delay: 600 }
  ];

  const timelineData = [
    {
      year: "2020",
      title: "The Beginning",
      description: "Founded with a vision to democratize professional video editing",
      color: "#007bff"
    },
    {
      year: "2021",
      title: "First Launch",
      description: "Released Flow v1.0 to early adopters with basic AI editing features",
      color: "#0056b3"
    },
    {
      year: "2022",
      title: "Going Global",
      description: "Expanded to 50+ countries and reached 10K+ active users",
      color: "#17a2b8"
    },
    {
      year: "2023",
      title: "AI Revolution",
      description: "Introduced advanced AI features and reached 50K+ creators",
      color: "#004085"
    },
    {
      year: "2024",
      title: "The Future",
      description: "Launching next-gen features for collaborative video creation",
      color: "#007bff"
    }
  ];

  const stats = [
    { end: 50, suffix: "K+", label: "Active Creators", color: "#007bff" },
    { end: 100, suffix: "+", label: "Countries", color: "#0056b3" },
    { end: 1, suffix: "M+", label: "Videos Created", color: "#17a2b8" },
    { end: 99, suffix: "%", label: "Satisfaction", color: "#004085" }
  ];

  return (
    <div className="relative bg-gradient-to-b from-gray-50 to-white min-h-screen overflow-hidden">
      {/* Background Elements */}
      <AboutParticleBackground />
      <AboutFloatingElements />
      
      {/* Header */}
      <Header />
      
      {/* Custom scrollbar */}
      <style jsx global>{`
        ::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #f1f5f9, #ffffff);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #007bff, #0056b3);
        }
        
        ::selection {
          background: rgba(0, 123, 255, 0.3);
          color: white;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-full border border-blue-200 shadow-lg mb-8 animate-pulse">
                <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="text-sm font-semibold text-blue-700">
                  Our Story
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                  Empowering 
                </span>
                <span className="block bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                  Creators Worldwide
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                We're on a mission to democratize professional video editing and 
                empower creators of all skill levels to bring their visions to life.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16">
                {stats.map((stat, index) => (
                  <AnimatedCounter key={index} {...stat} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                Making professional video editing accessible to everyone
              </p>
            </div>
            
            {/* Mission Card */}
            <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 mb-8">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-10 blur transition duration-500" />
              
              <div className="flex items-start gap-4 md:gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl blur opacity-20"></div>
                  <Target className="relative w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                </div>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  At Flow, we believe that creativity should never be limited by 
                  technical complexity or budget constraints. We're building the 
                  tools that remove barriers between imagination and reality.
                </p>
              </div>
            </div>
            
            {/* Check List */}
            <div className="grid gap-3">
              {[
                "No technical expertise required",
                "Available on any device, anywhere",
                "Constantly evolving with user feedback"
              ].map((item, index) => (
                <div 
                  key={index}
                  className="group flex items-center gap-3 md:gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-5 border border-white/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
                    <Check className="relative w-5 h-5 md:w-6 md:h-6 text-green-500" />
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {values.map((value, index) => (
                <ValueCard key={index} {...value} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                From a simple idea to a global platform
              </p>
            </div>
            
            {/* Timeline Container */}
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-blue-400 to-cyan-200">
                {/* Animated dot on line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-20"></div>
              </div>
              
              {/* Timeline Items */}
              <div className="space-y-4">
                {timelineData.map((item, index) => (
                  <div 
                    key={index}
                    className={`relative ${index % 2 === 0 ? 'md:pr-1/2 md:pl-8 md:text-right' : 'md:pl-1/2 md:pr-8'}`}
                  >
                    <TimelineItem {...item} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg md:text-xl text-gray-600">
                Passionate people building the future of video editing
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {teamMembers.map((member) => (
                <TeamMember key={member.name} {...member} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600">
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')" }}
          />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float-medium"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Join Our Mission
            </h2>
            
            <p className="text-lg md:text-xl text-white/90 mb-10">
              Be part of the revolution in video creation
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="group relative px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <span className="relative">View Open Positions</span>
              </Link>
              
              <Link to="/contact" className="group relative px-8 py-4 bg-transparent text-white font-bold rounded-2xl border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-500 transform hover:-translate-y-1 flex items-center justify-center">
                <span className="relative">Partner With Us</span>
              </Link>
            </div>
            
            <p className="text-white/70 mt-8 text-sm md:text-base">
              We're hiring across engineering, design, and marketing
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
