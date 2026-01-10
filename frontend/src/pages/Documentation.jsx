import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/Scrolltrigger";
import {
  BookOpen,
  Search,
  FileText,
  Video,
  Code,
  Settings,
  Download,
  Upload,
  Users,
  Globe,
  Lock,
  Zap,
  ChevronRight,
  ExternalLink,
  Camera,
  Check,
  Copy,
  Terminal,
  Key,
  Server,
  Database,
  Cloud,
  Cpu,
  Shield,
  AlertCircle,
  Clock,
  Mail,
  MessageSquare,
  Book,
  Layers,
  Grid,
  ArrowRight
} from "lucide-react";
import Header from './Header';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

const DocumentationPage = () => {
  const sidebarRef = useRef(null);
  
  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Zap size={18} />,
      subsections: [
        { id: "intro", title: "Introduction to FlowGram" },
        { id: "account", title: "Creating your Account" },
        { id: "navigation", title: "Dashboard Overview" }
      ]
    },
    {
      id: "social-core",
      title: "Social Core",
      icon: <Users size={18} />,
      subsections: [
        { id: "feed", title: "Personalized Feed" },
        { id: "stories", title: "Stories & Moments" },
        { id: "interactions", title: "Likes & Comments" }
      ]
    },
    {
      id: "creation-tools",
      title: "Creation Tools",
      icon: <Camera size={18} />,
      subsections: [
        { id: "create-post", title: "Creating a Post" },
        { id: "media-types", title: "Images vs Videos" },
        { id: "location-art", title: "Location Discovery" }
      ]
    },
    {
      id: "communication",
      title: "Communication",
      icon: <MessageSquare size={18} />,
      subsections: [
        { id: "messaging", title: "Instant Messaging" },
        { id: "inbox", title: "Inbox Management" },
        { id: "alerts", title: "Notifications Feed" }
      ]
    },
    {
      id: "developer-api",
      title: "Developer API",
      icon: <Terminal size={18} />,
      subsections: [
        { id: "auth-jwt", title: "JWT Authentication" },
        { id: "rest-endpoints", title: "REST Endpoints" },
        { id: "rate-limits", title: "Rate Limiting" }
      ]
    },
    {
      id: "support",
      title: "Community & Support",
      icon: <Shield size={18} />,
      subsections: [
        { id: "help-center", title: "Help Center" },
        { id: "guidelines", title: "Community Guidelines" }
      ]
    }
  ];

  useEffect(() => {
    // Animate sections on scroll
    gsap.utils.toArray(".doc-section").forEach((section, index) => {
      gsap.fromTo(section,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-purple-500/30">
      <Header />
      
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="pt-32 pb-16 text-center border-b border-white/5">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 px-4 py-2 rounded-full mb-8 animate-pulse">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-semibold text-purple-300">Official Guides</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-6">
            FlowGram Knowledge Base
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Master the art of social creation with FlowGram. From your first post to integrating our advanced REST APIs, find everything you need here.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 py-16">
          {/* Sidebar */}
          <aside className="lg:w-64 lg:shrink-0">
            <div className="sticky top-28 space-y-8">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <div key={section.id} className="space-y-1">
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
                    >
                      <span className="text-purple-500 group-hover:scale-110 transition-transform">
                        {section.icon}
                      </span>
                      {section.title}
                    </button>
                    <div className="ml-9 space-y-1 border-l border-white/5">
                      {section.subsections.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => scrollToSection(sub.id)}
                          className="block w-full text-left pl-4 py-1.5 text-xs text-slate-500 hover:text-purple-400 transition-colors"
                        >
                          {sub.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  Stuck?
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Our community and support teams are here to help.
                </p>
                <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-2 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors">
                  Contact Support
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content Areas */}
          <main className="flex-1 space-y-24 pb-32">
            {/* Getting Started */}
            <section id="getting-started" className="doc-section scroll-mt-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Getting Started</h2>
              </div>
              
              <div id="intro" className="prose prose-invert max-w-none bg-white/5 border border-white/10 p-8 rounded-2xl mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Introduction to FlowGram</h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  FlowGram is a next-generation social platform designed for creators, artists, and storytellers. We combine high-performance social networking with advanced media tools and location-based discovery.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <Check className="w-5 h-5 text-green-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Interactive Maps</h4>
                      <p className="text-xs text-slate-500">Discover art where it was created using our Leaflet integration.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <Check className="w-5 h-5 text-green-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Secure Messaging</h4>
                      <p className="text-xs text-slate-500">End-to-end community interaction with real-time notifications.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div id="account" className="prose prose-invert max-w-none mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Creating your Account</h3>
                <p className="text-slate-400 mb-4">1. Visit the <Link to="/signup" className="text-purple-400 hover:underline">Signup Page</Link> and enter your unique username, email, and password.</p>
                <p className="text-slate-400 mb-4">2. Verify your email to unlock all features, including high-resolution uploads.</p>
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/80">Make sure to use a strong password and keep your credentials secure. We use encrypted JWT storage for all sessions.</p>
                </div>
              </div>
            </section>

            {/* Creation Tools */}
            <section id="creation-tools" className="doc-section scroll-mt-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20">
                  <Camera className="w-8 h-8 text-pink-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Creation Tools</h2>
              </div>
              
              <div id="create-post" className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Creating a Post</h3>
                <p className="text-slate-400 mb-6 font-medium">Click the "+" icon in the sidebar to open the creation modal.</p>
                <div className="space-y-4">
                  {[
                    { step: 1, label: "Select Media", desc: "Drag and drop or click to upload images and videos." },
                    { step: 2, label: "Add Caption", desc: "Express your creativity with text and hashtags." },
                    { step: 3, label: "Tag Location", desc: "Use the interactive map selector to mark where your art was born." }
                  ].map((s) => (
                    <div key={s.step} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 items-center">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm border border-purple-500/30">
                        {s.step}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{s.label}</h4>
                        <p className="text-xs text-slate-500">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Developer API */}
            <section id="developer-api" className="doc-section scroll-mt-32">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <Terminal className="w-8 h-8 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Developer API</h2>
              </div>

              <div id="auth-jwt" className="mb-12">
                <h3 className="text-xl font-bold text-white mb-4">JWT Authentication</h3>
                <p className="text-slate-400 mb-6">FlowGram uses JSON Web Tokens (JWT) for secure API communication. Include your token in the authorization header of every request.</p>
                <div className="bg-slate-950 rounded-xl p-6 border border-white/10 font-mono text-xs">
                  <div className="flex justify-between items-center mb-4 text-slate-500 border-b border-white/5 pb-2">
                    <span>HTTP Request Header</span>
                    <button className="hover:text-white transition-colors">Copy</button>
                  </div>
                  <div className="text-blue-400">Authorization: <span className="text-purple-400">Bearer {"<your_access_token>"}</span></div>
                </div>
              </div>

              <div id="rest-endpoints" className="overflow-hidden border border-white/10 rounded-2xl bg-white/5">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Method</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Endpoint</th>
                      <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      { m: "POST", e: "/api/posts", d: "Upload new media and metadata" },
                      { m: "GET", e: "/api/posts/feed", d: "Fetch authenticated user's feed" },
                      { m: "POST", e: "/api/messages", d: "Deliver real-time text message" },
                      { m: "GET", e: "/api/notifications", d: "Retrieve user activity alerts" }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            row.m === "GET" ? "bg-green-500/10 text-green-400 border border-green-500/20" : 
                            "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>{row.m}</span>
                        </td>
                        <td className="p-4 font-mono text-xs text-slate-200">{row.e}</td>
                        <td className="p-4 text-xs text-slate-400">{row.d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Support CTA */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-[#1e293b] p-12 rounded-2xl border border-white/10 text-center">
                <h3 className="text-3xl font-bold text-white mb-4">Still have questions?</h3>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                  Our developer relations and community management teams are active 24/7 to support your FlowGram journey.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/contact" className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors">
                    Get in Touch
                  </Link>
                  <a href="https://discord.gg/flowgram" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white/10 text-white font-bold rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                    Join Discord
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DocumentationPage;