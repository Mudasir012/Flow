import React, { useState, useRef, useEffect } from "react";
import {
  Code,
  Database,
  Cpu,
  Shield,
  Zap,
  Lock,
  Globe,
  Cloud,
  Terminal,
  BarChart,
  Server,
  Key,
  Clock,
  Check,
  ChevronRight,
  Play,
  Sparkles,
  Users,
  Award,
  Headphones,
  Image,
  Map,
} from "lucide-react";
import { Link } from 'react-router-dom';
import Header from './Header'; 
import Footer from './Footer';
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

const AnimatedSection = ({
  children,
  animation = "fade",
  className = "",
  delay = 0,
}) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  const animationClasses = {
    fade: "transition-all duration-700 ease-out",
    scale: "transition-all duration-700 ease-out transform",
    slide: "transition-all duration-700 ease-out transform",
  };

  const getAnimationStyle = () => {
    if (!isVisible) {
      if (animation === "fade") return "opacity-0";
      if (animation === "scale") return "opacity-0 scale-95";
      if (animation === "slide") return "opacity-0 translate-y-8";
    }
    if (animation === "fade") return "opacity-100";
    if (animation === "scale") return "opacity-100 scale-100";
    if (animation === "slide") return "opacity-100 translate-y-0";
    return "";
  };

  return (
    <div
      ref={ref}
      className={`${animationClasses[animation]} ${getAnimationStyle()} ${className}`}
      style={{
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
};

// Progress Scrollbar Component (same as landing page)
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
    <div
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-green-500 z-50 transition-all duration-300"
      style={{ width: `${scrollProgress}%` }}
    />
  );
};

// Feature Card Component (adapted for API)
const ApiFeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
}) => {
  return (
    <AnimatedSection animation="scale" delay={delay}>
      <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-500 hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative mb-6">
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 relative">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed relative">
          {description}
        </p>
        
        <div className="mt-6 relative">
          <ChevronRight className="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </AnimatedSection>
  );
};

// API Endpoint Component
const ApiEndpoint = ({ method, endpoint, description, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  const methodColors = {
    GET: "bg-green-100 text-green-800 border-green-200",
    POST: "bg-blue-100 text-blue-800 border-blue-200",
    PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
    DELETE: "bg-red-100 text-red-800 border-red-200",
    PATCH: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${methodColors[method]}`}>
            {method}
          </span>
          <code className="font-mono text-gray-800 bg-gray-50 px-3 py-1 rounded-lg text-sm">
            {endpoint}
          </code>
        </div>
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
          Try it <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Pricing Card Component (adapted for API)
const ApiPricingCard = ({ plan, price, features, highlighted = false, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`relative rounded-2xl p-8 border transition-all duration-700 ${
        highlighted
          ? "border-blue-500 bg-gradient-to-b from-blue-50 to-white shadow-xl scale-105"
          : "border-gray-200 bg-white shadow-sm"
      } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold rounded-full">
            Most Popular
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan}</h3>
        <div className="flex items-baseline mb-3">
          <span className="text-5xl font-bold text-gray-900">${price}</span>
          <span className="text-gray-500 ml-2">/month</span>
        </div>
        
        {price === 0 && (
          <p className="text-gray-600">Perfect for getting started</p>
        )}
        {price === 49 && (
          <p className="text-gray-600">For growing applications</p>
        )}
        {price === 199 && (
          <p className="text-gray-600">For enterprise solutions</p>
        )}
      </div>
      
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>
      
      <button
        className={`w-full py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 ${
          highlighted
            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25"
            : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
      >
        Get Started
      </button>
      
      {price === 0 && (
        <p className="text-center text-gray-500 text-sm mt-4">
          Includes 10,000 free API calls/month
        </p>
      )}
    </div>
  );
};

// Stat Card Component (same as landing page, adjusted colors)
const ApiStatCard = ({ number, label, suffix = "", delay, icon: Icon }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {Icon && (
        <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-6">
          <Icon className="w-6 h-6 text-white" />
        </div>
      )}
      
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
        {number}
        {suffix}
      </div>
      
      <div className="text-gray-600 font-medium">{label}</div>
    </div>
  );
};

// Code Example Component
const CodeExample = ({ language, code, delay }) => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`bg-gray-900 rounded-xl p-6 font-mono text-sm transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm">{language}</span>
        <button className="text-gray-400 hover:text-white transition-colors text-sm">
          Copy
        </button>
      </div>
      <pre className="text-gray-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const ApiPage = () => {
  const apiFeatures = [
    {
      icon: Zap,
      title: "Real-time Interactions",
      description: "Experience zero-latency feed updates, instant messaging, and live notifications powered by our optimized backend.",
      delay: 100,
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "State-of-the-art JWT authentication with secure HTTP-only cookies and robust rate limiting to protect your data.",
      delay: 200,
    },
    {
      icon: Image,
      title: "Media Processing",
      description: "Advanced upload handling for images and videos with automatic optimization for the best viewing experience.",
      delay: 300,
    },
    {
      icon: Map,
      title: "Geo Integration",
      description: "Seamless Leaflet integration for location-based storytelling and artwork discovery across the globe.",
      delay: 400,
    },
  ];

  const endpoints = [
    {
      method: "POST",
      endpoint: "/api/auth/register",
      description: "Register a new user account with username, email, and password",
      delay: 100,
    },
    {
      method: "POST",
      endpoint: "/api/auth/login",
      description: "Authenticate user and receive a secure JWT access token",
      delay: 150,
    },
    {
      method: "GET",
      endpoint: "/api/posts/feed",
      description: "Retrieve a personalized feed of artwork and hub posts",
      delay: 200,
    },
    {
      method: "POST",
      endpoint: "/api/posts",
      description: "Create a new post with media (image/video), caption, and location",
      delay: 250,
    },
    {
      method: "GET",
      endpoint: "/api/notifications",
      description: "Get real-time notifications for likes, comments, and follows",
      delay: 300,
    },
    {
      method: "POST",
      endpoint: "/api/messages",
      description: "Send instant messages to other artists in the community",
      delay: 350,
    },
  ];

  const statsData = [
    { number: "99.9", suffix: "%", label: "Uptime SLA", icon: Shield },
    { number: "50", suffix: "ms", label: "Avg Response Time", icon: Zap },
    { number: "10", suffix: "B+", label: "API Calls/Day", icon: Database },
    { number: "100", suffix: "+", label: "Countries Served", icon: Globe },
  ];

  const codeExamples = [
    {
      language: "JavaScript",
      code: `// Fetch your FlowGram feed
const response = await fetch('http://localhost:5000/api/posts/feed', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

const { posts } = await response.json();
console.log('Latest artwork:', posts);`,
      delay: 100,
    },
    {
      language: "Python",
      code: `# Authenticate with FlowGram
import requests

payload = {
    'email': 'artist@example.com',
    'password': 'secure_password'
}

response = requests.post(
    'http://localhost:5000/api/auth/login',
    json=payload
)

auth_data = response.json()
token = auth_data['token']`,
      delay: 200,
    },
    {
      language: "cURL",
      code: `# Create a new masterpiece post
curl -X POST http://localhost:5000/api/posts \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -F "media=@painting.jpg" \\
  -F "caption=My latest oil painting!" \\
  -F "postType=artwork" \\
  -F "location=New York, NY"`,
      delay: 300,
    },
  ];

  const pricingPlans = [
    {
      plan: "Free",
      price: 0,
      features: [
        "10,000 requests/month",
        "Basic rate limiting",
        "Community support",
        "3-day data retention",
        "1 webhook endpoint",
        "Email/SMS notifications",
      ],
    },
    {
      plan: "Pro",
      price: 49,
      features: [
        "100,000 requests/month",
        "Advanced rate limiting",
        "Priority support",
        "30-day data retention",
        "10 webhook endpoints",
        "Real-time analytics",
        "Custom domains",
        "Team collaboration",
      ],
      highlighted: true,
    },
    {
      plan: "Enterprise",
      price: 199,
      features: [
        "Unlimited requests",
        "Custom rate limits",
        "24/7 dedicated support",
        "Unlimited data retention",
        "Unlimited webhooks",
        "Advanced analytics",
        "SLA guarantee",
        "Custom integrations",
        "On-premise deployment",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <ProgressScrollbar />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl" />
      </div>

      <main className="pt-20">
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <AnimatedSection animation="fade">
                  <div>
                    <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-100 mb-8">
                      <Code className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Powerful REST & GraphQL APIs
                      </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                      Empower Your{" "}
                      <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                        Creativity
                      </span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
                      Scalable, secure, and developer-friendly APIs that power the world's
                      best applications. Enterprise-grade infrastructure with simple pricing.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                      <Link to="/signup" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-full hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center">
                        Get API Keys
                      </Link>
                      <Link to="/documentation" className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center space-x-2">
                        <Play className="w-5 h-5" />
                        <span>View Documentation</span>
                      </Link>
                    </div>

                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">99.9%</div>
                        <div className="text-gray-600">Uptime SLA</div>
                      </div>
                      <div className="w-px h-12 bg-gray-200" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">50ms</div>
                        <div className="text-gray-600">Avg Response</div>
                      </div>
                      <div className="w-px h-12 bg-gray-200" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">24/7</div>
                        <div className="text-gray-600">Support</div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection animation="scale" delay={300}>
                  <div className="relative">
                    <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl p-8 backdrop-blur-md border border-white/20 shadow-2xl">
                      <div className="bg-gray-950 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                        {/* Simulated API dashboard */}
                        <div className="h-10 bg-gray-900 flex items-center px-4 border-b border-gray-800">
                          <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                          </div>
                          <div className="ml-4 text-xs font-mono text-gray-500">api.flowgram.io — terminal</div>
                        </div>
                        <div className="p-8">
                          <div className="font-mono text-sm">
                            <div className="text-green-400 mb-2 flex items-center gap-2">
                              <span className="text-gray-600">$</span> 
                              <span>curl https://api.flowgram.io/v1/posts/feed \</span>
                            </div>
                            <div className="text-purple-400 ml-6 mb-8">-H "Authorization: Bearer fk_live_..."</div>
                            <div className="mt-6 text-gray-300">
                              <div className="text-blue-400">{"{"}</div>
                              <div className="ml-6 flex items-center gap-2">
                                <span className="text-pink-400">"status":</span> 
                                <span className="text-green-400">"success"</span>,
                              </div>
                              <div className="ml-6 flex items-center gap-2">
                                <span className="text-pink-400">"posts":</span> 
                                <span className="text-gray-400">[</span>
                              </div>
                              <div className="ml-12 flex items-center gap-2">
                                <span className="text-blue-400">{"{"}</span>
                              </div>
                              <div className="ml-18 flex items-center gap-2">
                                <span className="text-pink-400">"id":</span> 
                                <span className="text-yellow-400">"post_creative_99"</span>,
                              </div>
                              <div className="ml-18 flex items-center gap-2">
                                <span className="text-pink-400">"author":</span> 
                                <span className="text-yellow-400">"ArtVinci"</span>,
                              </div>
                              <div className="ml-12 flex items-center gap-2">
                                <span className="text-blue-400">{"}"}</span>
                              </div>
                              <div className="ml-6 text-gray-400">]</div>
                              <div className="text-blue-400">{"}"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <AnimatedSection animation="fade">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Developer First
                </h2>
                <p className="text-xl text-gray-600">
                  Everything you need to build amazing applications
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {apiFeatures.map((feature, index) => (
                <ApiFeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>
      
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-6">
            <AnimatedSection animation="fade">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Comprehensive API
                </h2>
                <p className="text-xl text-gray-600">
                  RESTful endpoints with consistent, predictable responses
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
              {endpoints.map((endpoint, index) => (
                <ApiEndpoint key={index} {...endpoint} />
              ))}
            </div>

            <AnimatedSection animation="fade" delay={200}>
              <div className="text-center">
                <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg">
                  View All Endpoints
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <AnimatedSection animation="fade">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Get Started in Minutes
                </h2>
                <p className="text-xl text-gray-600">
                  Easy integration with your favorite programming languages
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {codeExamples.map((example, index) => (
                <CodeExample key={index} {...example} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <AnimatedSection animation="fade">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Trusted by Developers
                </h2>
                <p className="text-xl text-gray-600">
                  Powering thousands of applications worldwide
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {statsData.map((stat, index) => (
                <ApiStatCard
                  key={index}
                  number={stat.number}
                  suffix={stat.suffix}
                  label={stat.label}
                  icon={stat.icon}
                  delay={index * 100}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <AnimatedSection animation="fade">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-xl text-gray-600">
                  Pay only for what you use. No hidden fees.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
              {pricingPlans.map((plan, index) => (
                <ApiPricingCard
                  key={index}
                  plan={plan.plan}
                  price={plan.price}
                  features={plan.features}
                  highlighted={plan.highlighted}
                  delay={index * 150}
                />
              ))}
            </div>

            <AnimatedSection animation="fade" delay={200}>
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">All plans include</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "SSL encryption",
                    "DDoS protection",
                    "Rate limiting",
                    "Comprehensive logs",
                    "Webhook support",
                    "Developer dashboard",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6">
            <AnimatedSection animation="scale">
              <div className="max-w-4xl mx-auto text-center">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Start Building Today
                  </h2>
                  <p className="text-xl text-white/90 mb-10">
                    Get your API keys and start integrating in minutes
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/signin" className="px-10 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center">
                      Get API Keys
                    </Link>
                    <Link to="/contact" className="px-10 py-4 bg-white/20 text-white font-bold rounded-full border-2 border-white hover:bg-white/30 transition-colors duration-300 flex items-center justify-center">
                      Contact Sales
                    </Link>
                  </div>
                  <p className="text-white/70 mt-8">
                    No credit card required · Free tier includes 10,000 requests/month
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ApiPage;
