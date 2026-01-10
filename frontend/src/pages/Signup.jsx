import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
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
    UserPlus,
    Check
} from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Animated Background Component
const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

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

// Password Strength Indicator
const PasswordStrength = ({ password }) => {
    const getStrength = () => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        return strength;
    };

    const strength = getStrength();
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex space-x-1 mb-1">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? colors[strength - 1] : 'bg-gray-200'
                            }`}
                    />
                ))}
            </div>
            <p className={`text-xs ${strength > 2 ? 'text-green-600' : 'text-orange-600'}`}>
                {labels[strength - 1] || 'Enter password'}
            </p>
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
const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullName: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

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
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!agreedToTerms) {
            newErrors.terms = "You must agree to the terms and conditions";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName || formData.username
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            setSuccessMessage("Account created successfully! Redirecting...");

            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({
                submit: error.response?.data?.error || 'Registration failed. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialSignup = (provider) => {
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            setSuccessMessage(`Signed up with ${provider}!`);

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
        }, 1000);
    };

    const features = [
        { icon: Shield, text: "Secure & Private" },
        { icon: Zap, text: "Instant Setup" },
        { icon: Sparkles, text: "Free Forever" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-hidden">
            <AnimatedBackground />

            {successMessage && (
                <SuccessToast
                    message={successMessage}
                    onClose={() => setSuccessMessage("")}
                />
            )}

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
                                        Create Account
                                    </h1>
                                    <p className="text-gray-600">
                                        Join thousands of creators today
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
                                                icon={User}
                                                type="text"
                                                name="username"
                                                placeholder="Choose a username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                error={errors.username}
                                                disabled={isLoading}
                                            />

                                            <InputField
                                                icon={User}
                                                type="text"
                                                name="fullName"
                                                placeholder="Full name (optional)"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                disabled={isLoading}
                                            />

                                            <InputField
                                                icon={Mail}
                                                type="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                error={errors.email}
                                                disabled={isLoading}
                                            />

                                            <div>
                                                <InputField
                                                    icon={Lock}
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    placeholder="Create a password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    error={errors.password}
                                                    showPasswordToggle
                                                    onTogglePassword={() => setShowPassword(!showPassword)}
                                                    disabled={isLoading}
                                                />
                                                <PasswordStrength password={formData.password} />
                                            </div>

                                            <InputField
                                                icon={Lock}
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                error={errors.confirmPassword}
                                                showPasswordToggle
                                                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                                                disabled={isLoading}
                                            />
                                        </div>

                                        {/* Terms & Conditions */}
                                        <div>
                                            <label className="flex items-start space-x-3 cursor-pointer group">
                                                <div className="relative mt-1">
                                                    <input
                                                        type="checkbox"
                                                        checked={agreedToTerms}
                                                        onChange={() => setAgreedToTerms(!agreedToTerms)}
                                                        className="sr-only"
                                                        disabled={isLoading}
                                                    />
                                                    <div className={`w-5 h-5 rounded border-2 transition-all duration-300 flex items-center justify-center ${agreedToTerms
                                                            ? 'bg-gradient-to-r from-purple-600 to-pink-500 border-transparent'
                                                            : 'border-gray-300 group-hover:border-purple-400'
                                                        }`}>
                                                        {agreedToTerms && <Check className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-700 select-none">
                                                    I agree to the{" "}
                                                    <Link to="/terms" className="text-purple-600 hover:text-purple-700 hover:underline">
                                                        Terms of Service
                                                    </Link>{" "}
                                                    and{" "}
                                                    <Link to="/privacy" className="text-purple-600 hover:text-purple-700 hover:underline">
                                                        Privacy Policy
                                                    </Link>
                                                </span>
                                            </label>
                                            {errors.terms && (
                                                <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                                                    <X className="w-4 h-4" />
                                                    <span>{errors.terms}</span>
                                                </p>
                                            )}
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
                                                        <span>Creating account...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus className="w-5 h-5" />
                                                        <span>Create Account</span>
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
                                                    Or sign up with
                                                </span>
                                            </div>
                                        </div>

                                        {/* Social Logins */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <SocialButton
                                                icon={Github}
                                                text="GitHub"
                                                color="from-gray-800 to-gray-900"
                                                onClick={() => handleSocialSignup("GitHub")}
                                            />
                                            <SocialButton
                                                icon={Chrome}
                                                text="Google"
                                                color="from-red-500 to-yellow-500"
                                                onClick={() => handleSocialSignup("Google")}
                                            />
                                            <SocialButton
                                                icon={Twitter}
                                                text="Twitter"
                                                color="from-blue-400 to-cyan-500"
                                                onClick={() => handleSocialSignup("Twitter")}
                                            />
                                        </div>

                                        {/* Sign In Link */}
                                        <div className="text-center pt-4">
                                            <p className="text-gray-600">
                                                Already have an account?{" "}
                                                <Link
                                                    to="/signin"
                                                    className="font-semibold text-purple-600 hover:text-purple-700 transition-colors hover:underline"
                                                >
                                                    Sign in
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
                                <div className="absolute -top-8 -left-8 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl animate-pulse" />

                                <div className="relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                                    <div className="p-12">
                                        <div className="mb-8">
                                            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 rounded-full mb-6">
                                                <Sparkles className="w-4 h-4 text-purple-600" />
                                                <span className="text-sm font-semibold text-purple-700">
                                                    Start Creating Today
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
                                                Create, edit, and share amazing videos with our powerful platform. No credit card required.
                                            </p>
                                        </div>

                                        {/* Benefits List */}
                                        <div className="space-y-4 mb-12">
                                            {[
                                                "Professional video editing tools",
                                                "Unlimited cloud storage",
                                                "Share with your community",
                                                "Real-time collaboration",
                                                "Export in any format"
                                            ].map((benefit, index) => (
                                                <div key={index} className="flex items-center space-x-3 group">
                                                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                        <Check className="w-4 h-4 text-white" />
                                                    </div>
                                                    <span className="text-gray-700">{benefit}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Testimonial */}
                                        <div className="relative bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl p-6 border border-purple-100">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                                        M
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-gray-700 italic mb-3">
                                                        "Best video platform I've ever used. The editor is incredibly powerful yet easy to use!"
                                                    </p>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">Mike Johnson</div>
                                                        <div className="text-sm text-gray-600">Content Creator</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-8 -right-8 w-56 h-56 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl animate-pulse delay-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
