import React from 'react';
import { Users, Target, Globe, Award, Heart } from 'lucide-react';
import './About.css';

const AboutPage = () => {
  const teamData = [
    {
      name: "Alex Johnson",
      role: "Lead Developer",
      description: "Former Google engineer with 10+ years in video technology",
      expertise: ["Video Processing", "Cloud Infrastructure", "Real-time Systems"]
    },
    {
      name: "Maria Garcia",
      role: "AI Research Lead",
      description: "PhD in Computer Vision from Stanford University",
      expertise: ["Machine Learning", "Computer Vision", "Neural Networks"]
    },
    {
      name: "David Kim",
      role: "Product Designer",
      description: "Award-winning designer focused on creative tools",
      expertise: ["UX Design", "Creative Tools", "User Research"]
    },
    {
      name: "Sarah Williams",
      role: "Community Manager",
      description: "Connecting with creators to build amazing features",
      expertise: ["Community Building", "User Feedback", "Content Strategy"]
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "Democratize professional video editing by making advanced tools accessible to everyone, everywhere.",
      color: "#667eea"
    },
    {
      icon: Heart,
      title: "Our Values",
      description: "We believe in creativity without boundaries, quality without compromise, and innovation with purpose.",
      color: "#f56565"
    },
    {
      icon: Globe,
      title: "Our Vision",
      description: "To become the world's most intuitive and powerful video editing platform for creators of all levels.",
      color: "#48bb78"
    },
    {
      icon: Users,
      title: "Our Community",
      description: "Empowering millions of creators worldwide to tell their stories through compelling visual content.",
      color: "#ed8936"
    }
  ];

  const timelineData = [
    {
      year: "2023",
      title: "Foundation",
      description: "Flow was born from a simple idea: video editing should be accessible, intuitive, and powerful for everyone."
    },
    {
      year: "2024",
      title: "First Release",
      description: "Launched our beta version with basic editing tools, quickly gaining 10,000+ active users."
    },
    {
      year: "2025",
      title: "AI Integration",
      description: "Introduced AI-powered features that revolutionized how creators edit videos."
    },
    {
      year: "2026",
      title: "Global Expansion",
      description: "Expanded to 50+ countries with localization and regional feature sets."
    }
  ];

  const stats = [
    { number: "500K+", label: "Active Creators" },
    { number: "10M+", label: "Videos Created" },
    { number: "150+", label: "Countries" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">About Flow</h1>
          <p className="about-hero-subtitle">
            We're on a mission to revolutionize video editing for creators worldwide.
            From beginners to professionals, Flow provides the tools to bring your
            creative vision to life.
          </p>
          <div className="about-stats">
            {stats.map((stat, index) => (
              <div key={index} className="about-stat-item">
                <span className="about-stat-number">{stat.number}</span>
                <span className="about-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-subtitle">Our core principles guide everything we do</p>
          </div>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon" style={{ backgroundColor: `${value.color}20`, color: value.color }}>
                  <value.icon size={32} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="journey-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">Milestones in revolutionizing video editing</p>
          </div>
          <div className="timeline-container">
            {timelineData.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker">
                  <div className="timeline-year">{item.year}</div>
                  <div className="timeline-dot"></div>
                </div>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">The passionate people behind Flow</p>
          </div>
          <div className="team-grid">
            {teamData.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <div className="avatar-initial">{member.name.charAt(0)}</div>
                </div>
                <h3>{member.name}</h3>
                <div className="team-role">{member.role}</div>
                <p className="team-description">{member.description}</p>
                <div className="team-expertise">
                  {member.expertise.map((skill, idx) => (
                    <span key={idx} className="expertise-tag">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="section-container">
          <Award size={48} className="cta-icon" />
          <h2>Join Our Creative Community</h2>
          <p>Be part of the revolution in video editing. Whether you're creating your first video or your hundredth, Flow is here to help you succeed.</p>
          <div className="cta-buttons">
            <a href="/editor"><button className="cta-button primary">Start Creating Free</button></a>
            <button className="cta-button secondary">Join Our Discord</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;