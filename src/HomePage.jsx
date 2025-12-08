import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import * as THREE from "three";
import "./HomePage.css";
import TiltedCard from "./components/TitledCard";
import LiquidEther from "./pages/LiquidEther";
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
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
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

// Video Timeline Visualization Component
const VideoTimelineScene = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create NLE-style timeline
    const timelineGroup = new THREE.Group();

    // Main timeline track
    const trackGeometry = new THREE.BoxGeometry(12, 0.2, 0.1);
    const trackMaterial = new THREE.MeshPhongMaterial({
      color: 0x2a2a2a,
      emissive: 0x1a1a1a,
      emissiveIntensity: 0.1,
    });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    timelineGroup.add(track);

    // Video clips on timeline
    const clips = [];
    const clipData = [
      { position: -4.5, width: 1.8, color: 0xc9a9ff, type: "video" },
      { position: -2.2, width: 1.2, color: 0x93d5ff, type: "audio" },
      { position: -0.5, width: 2.0, color: 0xffb3d9, type: "video" },
      { position: 2.0, width: 1.5, color: 0xa3f5b5, type: "effect" },
      { position: 4.0, width: 1.3, color: 0xffd893, type: "title" },
    ];

    clipData.forEach((data, i) => {
      const clipGeometry = new THREE.BoxGeometry(data.width, 0.4, 0.2);
      const clipMaterial = new THREE.MeshPhongMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.9,
      });
      const clip = new THREE.Mesh(clipGeometry, clipMaterial);
      clip.position.x = data.position;
      clip.position.y = 0.3;
      clip.userData = {
        type: data.type,
        originalY: 0.3,
        index: i,
      };
      clips.push(clip);
      timelineGroup.add(clip);
    });

    // Playhead with glow
    const playheadGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 8);
    const playheadMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.8,
    });
    const playhead = new THREE.Mesh(playheadGeometry, playheadMaterial);
    playhead.rotation.x = Math.PI / 2;
    timelineGroup.add(playhead);

    scene.add(timelineGroup);

    // Floating editing tools around timeline
    const toolsGroup = new THREE.Group();
    const tools = ["cut", "transform", "color", "text"].map((type, i) => {
      const tool = createEditingTool(type);
      tool.position.set(
        Math.cos((i * Math.PI) / 2) * 3,
        Math.sin((i * Math.PI) / 2) * 3,
        0
      );
      tool.userData = { index: i };
      toolsGroup.add(tool);
      return tool;
    });
    scene.add(toolsGroup);

    // Store animation objects
    scene.userData.animationObjects = {
      clips,
      playhead,
      toolsGroup,
      tools,
      timelineGroup,
      startTime: Date.now(),
    };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xc9a9ff, 1.5, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const rimLight = new THREE.DirectionalLight(0x93d5ff, 0.8);
    rimLight.position.set(-5, 5, 5);
    scene.add(rimLight);

    camera.position.z = 8;
    camera.position.y = 2;
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time =
        (Date.now() - scene.userData.animationObjects.startTime) * 0.001;
      const { clips, playhead, toolsGroup, tools, timelineGroup } =
        scene.userData.animationObjects;

      // Animate playhead movement
      if (playhead) {
        playhead.position.x = Math.sin(time * 0.3) * 5;
      }

      // Animate clips with gentle floating
      if (clips) {
        clips.forEach((clip, i) => {
          clip.position.y =
            clip.userData.originalY + Math.sin(time * 2 + i) * 0.1;
          clip.rotation.z = Math.sin(time * 1.5 + i) * 0.05;
        });
      }

      // Animate tools orbiting around timeline
      if (toolsGroup && tools) {
        toolsGroup.rotation.y = time * 0.2;
        tools.forEach((tool, i) => {
          tool.rotation.y = time;
          tool.scale.setScalar(1 + Math.sin(time * 3 + i) * 0.1);
        });
      }

      // Gentle timeline rotation
      if (timelineGroup) {
        timelineGroup.rotation.y = Math.sin(time * 0.1) * 0.1;
      }

      renderer.render(scene, camera);
    };

    // Start animation
    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="timeline-scene-container"
      style={{ width: "100%", height: "400px", minHeight: "200px" }}
    />
  );
};

// Film Reel Background Component
const FilmReelBackground = () => {
  const containerRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create film reels
    const reelsGroup = new THREE.Group();

    // Left reel
    const leftReel = createFilmReel();
    leftReel.position.set(-3, 0, 0);
    reelsGroup.add(leftReel);

    // Right reel
    const rightReel = createFilmReel();
    rightReel.position.set(3, 0, 0);
    reelsGroup.add(rightReel);

    // Film strip connecting reels
    const filmStrip = createFilmStrip();
    reelsGroup.add(filmStrip);

    scene.add(reelsGroup);

    // Floating frame particles
    const framesGroup = new THREE.Group();
    const frameCount = 8;

    const frames = [];
    for (let i = 0; i < frameCount; i++) {
      const frame = createFilmFrame();
      frame.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3
      );
      frame.userData = {
        speed: Math.random() * 0.02 + 0.01,
        originalY: frame.position.y,
      };
      frames.push(frame);
      framesGroup.add(frame);
    }
    scene.add(framesGroup);

    // Store animation objects
    scene.userData.animationObjects = {
      leftReel,
      rightReel,
      filmStrip,
      frames,
      framesGroup,
      reelsGroup,
      startTime: Date.now(),
    };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const reelLight = new THREE.PointLight(0xc9a9ff, 0.8, 10);
    reelLight.position.set(0, 0, 3);
    scene.add(reelLight);

    camera.position.z = 7;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time =
        (Date.now() - scene.userData.animationObjects.startTime) * 0.001;
      const { leftReel, rightReel, frames, reelsGroup } =
        scene.userData.animationObjects;

      // Animate reels spinning
      if (leftReel) leftReel.rotation.z -= 0.01;
      if (rightReel) rightReel.rotation.z += 0.01;

      // Animate floating frames
      if (frames) {
        frames.forEach((frame, i) => {
          frame.rotation.y += frame.userData.speed;
          frame.position.y =
            frame.userData.originalY + Math.sin(time + i) * 0.2;
        });
      }

      // Gentle overall rotation
      if (reelsGroup) {
        reelsGroup.rotation.y = Math.sin(time * 0.1) * 0.1;
      }

      renderer.render(scene, camera);
    };

    // Start animation
    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="film-reel-container"
      style={{ width: "100%", height: "300px", minHeight: "150px" }}
    />
  );
};

// Audio Waveform Visualization Component
const AudioWaveformScene = () => {
  const containerRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create audio waveform visualization
    const waveformGroup = new THREE.Group();
    const bars = [];
    const barCount = 32;

    for (let i = 0; i < barCount; i++) {
      const barGeometry = new THREE.BoxGeometry(0.08, 1, 0.1);
      const barMaterial = new THREE.MeshPhongMaterial({
        color: 0x93d5ff,
        emissive: 0xc9a9ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
      });
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      bar.position.x = (i - barCount / 2) * 0.12;
      bar.position.y = -1;
      bar.userData = {
        baseHeight: 1,
        frequency: 0.02 + (i / barCount) * 0.1,
        phase: i * 0.3,
        index: i,
      };
      bars.push(bar);
      waveformGroup.add(bar);
    }

    scene.add(waveformGroup);

    // Store animation objects
    scene.userData.animationObjects = {
      bars,
      waveformGroup,
      startTime: Date.now(),
    };

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x93d5ff, 1, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    camera.position.z = 8;

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const time =
        (Date.now() - scene.userData.animationObjects.startTime) * 0.001;
      const { bars, waveformGroup } = scene.userData.animationObjects;

      // Animate waveform bars
      if (bars) {
        bars.forEach((bar, i) => {
          const height =
            bar.userData.baseHeight +
            Math.sin(time * 3 + bar.userData.phase) * 2;
          bar.scale.y = height;
          bar.position.y = -1 + height * 0.5;

          // Color variation based on height
          const colorValue = Math.min(1, height / 3);
          bar.material.color.setHSL(0.6, 0.8, 0.3 + colorValue * 0.4);
        });
      }

      // Gentle overall animation
      if (waveformGroup) {
        waveformGroup.rotation.y = Math.sin(time * 0.2) * 0.1;
      }

      renderer.render(scene, camera);
    };

    // Start animation
    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="audio-waveform-container"
      style={{ width: "100%", height: "300px", minHeight: "150px" }}
    />
  );
};

// Helper functions for creating 3D objects
const createEditingTool = (type) => {
  const group = new THREE.Group();
  let geometry, material;

  switch (type) {
    case "cut":
      geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 6);
      material = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
      break;
    case "transform":
      geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      material = new THREE.MeshPhongMaterial({ color: 0x4ecdc4 });
      break;
    case "color":
      geometry = new THREE.SphereGeometry(0.2, 16, 16);
      material = new THREE.MeshPhongMaterial({ color: 0x45b7d1 });
      break;
    case "text":
      geometry = new THREE.PlaneGeometry(0.3, 0.2);
      material = new THREE.MeshPhongMaterial({ color: 0x96ceb4 });
      break;
  }

  const tool = new THREE.Mesh(geometry, material);
  group.add(tool);

  return group;
};

const createFilmReel = () => {
  const group = new THREE.Group();

  // Reel hub
  const hubGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 16);
  const hubMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const hub = new THREE.Mesh(hubGeometry, hubMaterial);
  group.add(hub);

  // Reel flanges
  const flangeGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.1, 16);
  const flangeMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });

  const topFlange = new THREE.Mesh(flangeGeometry, flangeMaterial);
  topFlange.position.y = 0.15;
  group.add(topFlange);

  const bottomFlange = new THREE.Mesh(flangeGeometry, flangeMaterial);
  bottomFlange.position.y = -0.15;
  group.add(bottomFlange);

  return group;
};

const createFilmStrip = () => {
  const stripLength = 6;
  const stripGeometry = new THREE.PlaneGeometry(stripLength, 0.3);

  const stripMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
  });

  const strip = new THREE.Mesh(stripGeometry, stripMaterial);
  strip.rotation.x = Math.PI / 2;

  return strip;
};

const createFilmFrame = () => {
  const group = new THREE.Group();

  // Frame border
  const frameGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.02);
  const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  group.add(frame);

  // Film content
  const contentGeometry = new THREE.PlaneGeometry(0.35, 0.25);
  const contentMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
  });
  const content = new THREE.Mesh(contentGeometry, contentMaterial);
  content.position.z = 0.015;
  group.add(content);

  return group;
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

// Timeline Item Component
const TimelineItem = ({ date, title, description, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`timeline-item ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      <div className="timeline-content">
        <div className="timeline-date">{date}</div>
        <h3 className="timeline-title">{title}</h3>
        <p className="timeline-description">{description}</p>
      </div>
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

// Team Member Component
const TeamMember = ({ name, role, description, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`team-card ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      <div className="team-avatar"></div>
      <h3 className="team-name">{name}</h3>
      <div className="team-role">{role}</div>
      <p className="team-description">{description}</p>
    </div>
  );
};

// Blog Post Component
const BlogPost = ({ date, title, excerpt, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`blog-card ${isVisible ? "visible" : ""}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      <div className="blog-image"></div>
      <div className="blog-content">
        <div className="blog-date">{date}</div>
        <h3 className="blog-title">{title}</h3>
        <p className="blog-excerpt">{excerpt}</p>
        <a href="#" className="blog-read-more">
          Read More →
        </a>
      </div>
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
    },
    {
      text: "As a professional editor, I was skeptical at first. But Flow's quality and speed have made it an essential tool in my arsenal.",
      author: "Marcus Johnson",
      role: "Film Editor",
    },
    {
      text: "The interface is beautiful and intuitive. I went from beginner to creating professional videos in just a few days.",
      author: "Emma Rodriguez",
      role: "YouTuber",
    },
  ];

  const timelineData = [
    {
      date: "Q1 2025",
      title: "AI Editing Launch",
      description:
        "Revolutionary AI-powered editing tools released to the public",
    },
    {
      date: "Q2 2025",
      title: "Mobile App Release",
      description: "Native iOS and Android apps with full feature parity",
    },
    {
      date: "Q3 2025",
      title: "Collaboration Features",
      description: "Real-time team editing and project sharing capabilities",
    },
    {
      date: "Q4 2025",
      title: "Enterprise Launch",
      description: "Advanced features for studios and production companies",
    },
  ];

  const statsData = [
    { number: "50", suffix: "K+", label: "Active Users" },
    { number: "1", suffix: "M+", label: "Videos Created" },
    { number: "99", suffix: "%", label: "Satisfaction Rate" },
    { number: "24", suffix: "/7", label: "Support Available" },
  ];

  const teamData = [
    {
      name: "Alex Johnson",
      role: "Lead Developer",
      description: "Former Google engineer with 10+ years in video technology",
    },
    {
      name: "Maria Garcia",
      role: "AI Research Lead",
      description: "PhD in Computer Vision from Stanford University",
    },
    {
      name: "David Kim",
      role: "Product Designer",
      description: "Award-winning designer focused on creative tools",
    },
    {
      name: "Sarah Williams",
      role: "Community Manager",
      description: "Connecting with creators to build amazing features",
    },
  ];

  const blogData = [
    {
      date: "March 15, 2025",
      title: "The Future of AI in Video Editing",
      excerpt:
        "How machine learning is transforming creative workflows and empowering creators worldwide.",
    },
    {
      date: "February 28, 2025",
      title: "5 Tips for Better Color Grading",
      excerpt:
        "Professional techniques to make your videos pop with stunning color and mood.",
    },
    {
      date: "February 12, 2025",
      title: "Collaborative Editing Best Practices",
      excerpt:
        "Learn how teams can work together seamlessly on video projects in real-time.",
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

          {/* Timeline Section */}
          <AnimatedSection className="timeline-section" animation="fade">
            <div className="section-header">
              <h2 className="section-title">Our Journey</h2>
              <p className="section-subtitle">
                Milestones in revolutionizing video editing
              </p>
            </div>
            <div className="timeline">
              {timelineData.map((item, index) => (
                <TimelineItem
                  key={index}
                  date={item.date}
                  title={item.title}
                  description={item.description}
                  delay={index * 200}
                />
              ))}
            </div>
          </AnimatedSection>

          {/* Video Timeline Scene */}
          <AnimatedSection animation="slide-left" delay={200}>
            <div className="background-scene">
              <VideoTimelineScene />
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

          {/* Film Reel Background */}
          <AnimatedSection animation="slide-right" delay={400}>
            <div className="background-scene">
              <FilmReelBackground />
            </div>
          </AnimatedSection>

          {/* Team Section */}
          <AnimatedSection className="team-section" animation="fade">
            <div className="section-header">
              <h2 className="section-title">Meet Our Team</h2>
              <p className="section-subtitle">
                The passionate people behind Flow
              </p>
            </div>
            <div className="team-grid">
              {teamData.map((member, index) => (
                <TeamMember
                  key={index}
                  name={member.name}
                  role={member.role}
                  description={member.description}
                  delay={index * 150}
                />
              ))}
            </div>
          </AnimatedSection>

          {/* Audio Waveform Visualization */}
          <AnimatedSection animation="slide-left" delay={300}>
            <div className="audio-scene">
              <AudioWaveformScene />
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
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar"></div>
                    <div className="author-info">
                      <h4>{testimonial.author}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Blog Section */}
          <AnimatedSection className="blog-section" animation="fade">
            <div className="section-header">
              <h2 className="section-title">From Our Blog</h2>
              <p className="section-subtitle">Latest insights and tutorials</p>
            </div>
            <div className="blog-grid">
              {blogData.map((post, index) => (
                <BlogPost
                  key={index}
                  date={post.date}
                  title={post.title}
                  excerpt={post.excerpt}
                />
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
                <a href="#">About</a>
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
