import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  CheckCircle,
  X,
  Github,
  Chrome,
  Twitter,
  Loader2,
} from "lucide-react";

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.3 + Math.random() * 0.7,
          }}
        />
      ))}
    </div>
  );
};

// Input Component
const InputField = ({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
  error,
  showPasswordToggle,
  onTogglePassword,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500 ${isFocused ? 'opacity-20' : ''}`} />
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Icon className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-purple-600' : 'text-gray-400'}`} />
        </div>

        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full pl-12 pr-${showPasswordToggle ? '12' : '4'} py-4 bg-white/80 backdrop-blur-sm border ${error ? 'border-red-300' : 'border-gray-200'
            } rounded-xl focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/20' : 'focus:ring-purple-500/20'
            } focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500`}
          placeholder={placeholder}
          {...props}
        />

        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {type === 'password' ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>

      {error && (
        <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center space-x-1">
          <X className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// Social Login Button
const SocialButton = ({ icon: Icon, text, color, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group w-full"
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500`} />
      <div className="relative w-full px-6 py-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-transparent transition-all duration-300 flex items-center justify-center space-x-3 group-hover:shadow-lg">
        <Icon className={`w-5 h-5 ${isHovered ? 'scale-110' : ''} transition-transform duration-300`} />
        <span className="font-medium text-gray-700">{text}</span>
      </div>
    </button>
  );
};

// Feature Pill Component
const FeaturePill = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/20 group hover:bg-white/70 transition-all duration-300">
    <Icon className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
    <span className="text-sm font-medium text-gray-700">{text}</span>
  </div>
);

// Success Toast
const SuccessToast = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 z-50 animate-slide-in">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500" />
      <div className="relative bg-white rounded-xl p-4 pr-12 shadow-2xl border border-green-100">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-gray-800 font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

// Main Component
const SignInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);

  // Add custom animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      @keyframes slide-in {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
      .shimmer {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 1000px 100%;
        animation: shimmer 2s infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setSuccessMessage("Successfully signed in!");
      setIsLoading(false);

      // Show navigation modal
      setShowNavigationModal(true);
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      setErrors({
        submit: error.response?.data?.error || 'Login failed. Please check your credentials.'
      });
    }
  };

  const handleNavigate = (destination) => {
    setShowNavigationModal(false);
    navigate(destination);
  };

  const handleSocialLogin = (provider) => {
    setIsLoading(true);

    // Simulate social login
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(`Signed in with ${provider}!`);

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }, 1000);
  };

  const features = [
    { icon: Shield, text: "Enterprise Security" },
    { icon: Zap, text: "Lightning Fast" },
    { icon: Sparkles, text: "AI Powered" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-hidden">
      <AnimatedBackground />

      {/* Success Toast */}
      {successMessage && (
        <SuccessToast
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* Decorative Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500" />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative">
              <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full blur transition duration-500 ${isHovered ? 'opacity-75' : 'opacity-0'}`} />
              <div className="relative p-2 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Flow
            </span>
          </Link>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Form */}
            <div className="relative">
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Form Header */}
                <div className="p-8 border-b border-gray-100">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-gray-600">
                    Sign in to your account to continue
                  </p>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.submit && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {errors.submit}
                      </div>
                    )}

                    <div className="space-y-4">
                      <InputField
                        icon={Mail}
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        error={errors.email}
                        disabled={isLoading}
                      />

                      <InputField
                        icon={Lock}
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors({ ...errors, password: "" });
                        }}
                        error={errors.password}
                        showPasswordToggle
                        onTogglePassword={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="sr-only"
                            disabled={isLoading}
                          />
                          <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${rememberMe
                            ? 'bg-gradient-to-r from-purple-600 to-pink-500 border-transparent'
                            : 'border-gray-300 group-hover:border-purple-400'
                            }`}>
                            {rememberMe && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </div>
                        <span className="text-gray-700 select-none">Remember me</span>
                      </label>

                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="relative group w-full"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500" />
                      <div className="relative w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center space-x-2">
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Signing in...</span>
                          </>
                        ) : (
                          <>
                            <span>Sign In</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </div>
                    </button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white/90 backdrop-blur-sm text-gray-500">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <SocialButton
                        icon={Github}
                        text="GitHub"
                        color="from-gray-800 to-gray-900"
                        onClick={() => handleSocialLogin("GitHub")}
                      />
                      <SocialButton
                        icon={Chrome}
                        text="Google"
                        color="from-red-500 to-yellow-500"
                        onClick={() => handleSocialLogin("Google")}
                      />
                      <SocialButton
                        icon={Twitter}
                        text="Twitter"
                        color="from-blue-400 to-cyan-500"
                        onClick={() => handleSocialLogin("Twitter")}
                      />
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center pt-4">
                      <p className="text-gray-600">
                        Don't have an account?{" "}
                        <Link
                          to="/signup"
                          className="font-semibold text-purple-600 hover:text-purple-700 transition-colors hover:underline"
                        >
                          Sign up now
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>

                {/* Form Footer */}
                <div className="px-8 py-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-t border-gray-100">
                  <div className="flex items-center justify-center space-x-6">
                    {features.map((feature, index) => (
                      <FeaturePill key={index} {...feature} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative">
                {/* Floating Card 1 */}
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl animate-pulse" />

                {/* Main Visual Card */}
                <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                  <div className="p-12">
                    <div className="mb-8">
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-700">
                          Experience Magic
                        </span>
                      </div>

                      <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Join{" "}
                        <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                          50,000+
                        </span>{" "}
                        Creators
                      </h2>

                      <p className="text-gray-600 text-lg mb-8">
                        Discover why creative professionals choose our platform to bring their ideas to life.
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-6 mb-12">
                      {[
                        { value: "4.9/5", label: "User Rating" },
                        { value: "99.9%", label: "Uptime" },
                        { value: "50K+", label: "Projects" },
                        { value: "24/7", label: "Support" },
                      ].map((stat, index) => (
                        <div key={index} className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/70 transition-all duration-300 group hover:scale-105">
                          <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-500 group-hover:bg-clip-text transition-all duration-300">
                            {stat.value}
                          </div>
                          <div className="text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <div className="relative bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl p-6 border border-purple-100">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            S
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-700 italic mb-3">
                            "The authentication experience is seamless. I switched all my projects here!"
                          </p>
                          <div>
                            <div className="font-semibold text-gray-900">Mudasir Hussain</div>
                            <div className="text-sm text-gray-600">Creative Director</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -bottom-8 -right-8 w-56 h-56 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl animate-pulse delay-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-gray-500 text-sm">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="text-purple-600 hover:text-purple-700 hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-purple-600 hover:text-purple-700 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Navigation Modal */}
      {showNavigationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 rounded-3xl blur opacity-20" />
            <div className="relative bg-white rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Where would you like to go?
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Choose your destination to continue
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Dashboard Option */}
                <button
                  onClick={() => handleNavigate('/dashboard')}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 hover:border-transparent transition-all duration-300 group-hover:shadow-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard</h3>
                    <p className="text-gray-600 text-sm">
                      Share videos, connect with creators, and explore the community
                    </p>
                  </div>
                </button>

                {/* Video Editor Option */}
                <button
                  onClick={() => handleNavigate('/videoeditor')}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200 hover:border-transparent transition-all duration-300 group-hover:shadow-xl">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Video Editor</h3>
                    <p className="text-gray-600 text-sm">
                      Create and edit professional videos with powerful tools
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInPage;