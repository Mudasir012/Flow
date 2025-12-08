import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  Trophy, 
  Star, 
  Heart, 
  Share2,
  Eye,
  MessageSquare,
  Clock,
  MapPin,
  Video,
  BookOpen,
  Zap,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import './Community.css';

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

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, link, delay }) => {
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
      >
        <div className="feature-icon">
          <Icon size={32} color="white" />
        </div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-description">{description}</p>
        <a href={link} className="feature-link">
          Learn More <ArrowRight size={16} />
        </a>
      </div>
    </AnimatedSection>
  );
};

// Member Card Component
const MemberCard = ({ name, role, bio, projects, likes, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`member-card ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      <div className="member-avatar"></div>
      <h3 className="member-name">{name}</h3>
      <div className="member-role">{role}</div>
      <p className="member-bio">{bio}</p>
      <div className="member-stats">
        <div className="member-stat">
          <span className="stat-value">{projects}</span>
          <div className="stat-label">Projects</div>
        </div>
        <div className="member-stat">
          <span className="stat-value">{likes}</span>
          <div className="stat-label">Likes</div>
        </div>
      </div>
      <div className="member-social">
        <a href="#" className="social-link">
          <MessageCircle size={16} />
        </a>
        <a href="#" className="social-link">
          <Share2 size={16} />
        </a>
        <a href="#" className="social-link">
          <Heart size={16} />
        </a>
      </div>
    </div>
  );
};

// Event Card Component
const EventCard = ({ date, title, description, type, location, attendees, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`event-card ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      <div className="event-date">
        <Calendar size={16} />
        {date}
      </div>
      <h3 className="event-title">{title}</h3>
      <p className="event-description">{description}</p>
      <div className="event-meta">
        <div className="event-meta-item">
          <Video size={16} />
          {type}
        </div>
        <div className="event-meta-item">
          <MapPin size={16} />
          {location}
        </div>
        <div className="event-meta-item">
          <Users size={16} />
          {attendees} attending
        </div>
      </div>
      <div className="event-actions">
        <button className="btn-primary">
          <Calendar size={16} />
          RSVP Now
        </button>
        <button className="btn-secondary">
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  );
};

export default function Community() {
  const features = [
    {
      icon: MessageCircle,
      title: "Community Forum",
      description: "Join discussions, ask questions, and share knowledge with fellow creators in our active community forum.",
      link: "#forum",
      delay: 100
    },
    {
      icon: Users,
      title: "Collaborate",
      description: "Find collaborators for your projects, join teams, and create amazing content together.",
      link: "#collaborate",
      delay: 200
    },
    {
      icon: Trophy,
      title: "Challenges",
      description: "Participate in weekly challenges, win prizes, and showcase your skills to the community.",
      link: "#challenges",
      delay: 300
    },
    {
      icon: BookOpen,
      title: "Learning Hub",
      description: "Access tutorials, courses, and resources shared by experienced community members.",
      link: "#learning",
      delay: 400
    }
  ];

  const members = [
    {
      name: "Sarah Chen",
      role: "Video Editor",
      bio: "Creating cinematic travel videos and tutorials for aspiring editors.",
      projects: 24,
      likes: 1420,
      delay: 100
    },
    {
      name: "Marcus Johnson",
      role: "Motion Designer",
      bio: "Specializing in animated explainer videos and visual effects.",
      projects: 18,
      likes: 892,
      delay: 200
    },
    {
      name: "Emma Rodriguez",
      role: "Content Creator",
      bio: "YouTube educator focused on video production techniques and workflows.",
      projects: 32,
      likes: 2150,
      delay: 300
    },
    {
      name: "Alex Thompson",
      role: "Visual Artist",
      bio: "Blending traditional art with digital video for unique visual experiences.",
      projects: 15,
      likes: 756,
      delay: 400
    }
  ];

  const events = [
    {
      date: "March 25, 2024",
      title: "Live Editing Workshop",
      description: "Join our senior editors for a live session on advanced color grading techniques and workflow optimization.",
      type: "Live Stream",
      location: "Online",
      attendees: "1.2K",
      delay: 100
    },
    {
      date: "April 2, 2024",
      title: "Community Challenge Kickoff",
      description: "New monthly challenge: 'Future Cities'. Create your vision of urban life in 2050 using any video style.",
      type: "Challenge",
      location: "Global",
      attendees: "3.4K",
      delay: 200
    },
    {
      date: "April 15, 2024",
      title: "Q&A with Industry Pros",
      description: "Get your questions answered by professional video editors working in film and advertising industries.",
      type: "Panel Discussion",
      location: "Discord",
      attendees: "890",
      delay: 300
    }
  ];

  const forumStats = [
    { value: "12.5K", label: "Active Members" },
    { value: "45.2K", label: "Forum Posts" },
    { value: "3.8K", label: "Tutorials" },
    { value: "156", label: "Online Now" }
  ];

  const recentPosts = [
    {
      title: "Best practices for 4K workflow optimization?",
      author: "Sarah Chen",
      time: "2 hours ago",
      replies: 24,
      views: 156
    },
    {
      title: "How to achieve this cinematic look?",
      author: "Marcus Johnson",
      time: "5 hours ago",
      replies: 18,
      views: 89
    },
    {
      title: "Collaboration tools for remote video teams",
      author: "Emma Rodriguez",
      time: "1 day ago",
      replies: 32,
      views: 210
    }
  ];

  return (
    <div className="community-container">
      {/* Floating Background Elements */}
      <div className="community-floating">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      {/* Hero Section */}
      <AnimatedSection className="community-hero" animation="fade" delay={100}>
        <div className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', borderRadius: '50px', fontSize: '14px', fontWeight: '500', color: 'var(--accent-purple)', marginBottom: '30px', transition: 'all 0.3s ease' }}>
          <Sparkles size={16} />
          <span>Join 50,000+ Creators</span>
        </div>
        <h1>Creative Community</h1>
        <p>Connect, collaborate, and grow with fellow video creators, editors, and visual artists from around the world.</p>
        
        <div className="community-stats">
          <div className="stat-card">
            <span className="stat-number">50K+</span>
            <div className="stat-label">Members</div>
          </div>
          <div className="stat-card">
            <span className="stat-number">1.2M</span>
            <div className="stat-label">Projects</div>
          </div>
          <div className="stat-card">
            <span className="stat-number">45K</span>
            <div className="stat-label">Discussions</div>
          </div>
          <div className="stat-card">
            <span className="stat-number">156</span>
            <div className="stat-label">Countries</div>
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="features-section" animation="fade" delay={200}>
        <div className="section-header">
          <h2 className="section-title">Community Features</h2>
          <p className="section-subtitle">Everything you need to connect and grow with fellow creators</p>
        </div>
        <div className="community-features stagger-children">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </AnimatedSection>

      {/* Featured Members Section */}
      <AnimatedSection className="members-section" animation="fade" delay={300}>
        <div className="section-header">
          <h2 className="section-title">Featured Creators</h2>
          <p className="section-subtitle">Meet some of our most active and inspiring community members</p>
        </div>
        <div className="members-grid">
          {members.map((member, index) => (
            <MemberCard key={index} {...member} />
          ))}
        </div>
      </AnimatedSection>

      {/* Events Section */}
      <AnimatedSection className="events-section" animation="fade" delay={400}>
        <div className="section-header">
          <h2 className="section-title">Upcoming Events</h2>
          <p className="section-subtitle">Join live sessions, workshops, and community challenges</p>
        </div>
        <div className="events-grid">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </AnimatedSection>

      {/* Forum Section */}
      <AnimatedSection className="forum-section" animation="fade" delay={500}>
        <div className="section-header">
          <h2 className="section-title">Community Forum</h2>
          <p className="section-subtitle">Join the conversation and get help from fellow creators</p>
        </div>
        
        <div className="forum-stats">
          {forumStats.map((stat, index) => (
            <div key={index} className="forum-stat">
              <div className="stat-number">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="forum-posts">
          {recentPosts.map((post, index) => (
            <div key={index} className="forum-post">
              <div className="post-avatar"></div>
              <div className="post-content">
                <div className="post-title">{post.title}</div>
                <div className="post-meta">
                  <span>by {post.author}</span>
                  <span>{post.time}</span>
                </div>
              </div>
              <div className="post-stats">
                <div className="post-stat">
                  <MessageSquare size={14} />
                  {post.replies}
                </div>
                <div className="post-stat">
                  <Eye size={14} />
                  {post.views}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="cta-section" animation="scale" delay={600}>
        <h2 className="cta-title">Ready to Join Our Community?</h2>
        <p className="cta-subtitle">
          Connect with thousands of creators, share your work, get feedback, and grow together in a supportive environment.
        </p>
        <div className="cta-buttons">
          <button className="btn-primary">
            <Users size={20} />
            Join Community
          </button>
          <button className="btn-secondary">
            <BookOpen size={20} />
            Browse Tutorials
          </button>
        </div>
      </AnimatedSection>
    </div>
  );
}