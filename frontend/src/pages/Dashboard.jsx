import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Home, Search, PlusSquare, Heart, MessageCircle, Send, Bookmark,
    LogOut, MoreVertical, MoreHorizontal, Grid, Bell, Menu, X, Image as ImageIcon,
    Play, Pause, Volume2, VolumeX, MapPin, Map, Share2, Trash2,
    Settings, Star, CheckCircle2, Trophy, Flame, Newspaper, 
    Compass, Loader2, ArrowRight, UserPlus, Paperclip, Smile, 
    Search as SearchIcon, Filter, TrendingUp, Film, User, Video as VideoIcon,
    Eye, EyeOff, Tag, Verified, Check, AtSign, Hash, ChevronLeft, ChevronRight,
    Award, Lock, Globe, UserMinus, ThumbsUp, ThumbsDown, Reply, Flag,
    Copy, ExternalLink, RefreshCw, SortDesc, Calendar, Clock, BarChart,
    PieChart, Activity, DollarSign, ShoppingCart, CreditCard, Package,
    Truck, Gift, Zap, Sparkles, Crown, Shield, Target, TrendingDown,
    ArrowUp, ArrowDown, Minus, Plus, Users, Download, Edit, Camera
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const makeSrc = (url, fallback) => {
    if (!url) return fallback || '';
    return url.startsWith('http') ? url : `${API_URL}${url}`;
};

const getCount = (val) => {
    if (!val) return 0;
    if (Array.isArray(val)) return val.length;
    if (typeof val === 'number') return val;
    // If it's an object like { count: number } or similar, try to find length-like properties
    if (typeof val === 'object') return val.length || val.count || 0;
    return 0;
};

// ==================== UTILITY FUNCTIONS ====================
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
};

const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) return new Date(date).toLocaleDateString();
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
};
const StarRating = ({ rating, setRating, readOnly = false }) => {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => !readOnly && setRating(star)}
                    disabled={readOnly}
                    className={`focus:outline-none transition-transform ${!readOnly ? 'hover:scale-110' : ''}`}
                >
                    <Star
                        className={`w-5 h-5 ${star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
};

const MapEvents = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            onMapClick(e);
        },
    });
    return null;
};

const LocationPicker = ({ location, setLocation, isOpen, onClose }) => {
    const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default NYC
    const [selectedPos, setSelectedPos] = useState(null);

    const onMapClick = (e) => {
        const { lat, lng } = e.latlng;
        setSelectedPos([lat, lng]);
        setLocation(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl h-[600px] flex flex-col overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold">Select Location (Leaflet)</h3>
                    <button onClick={onClose}><X className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 relative">
                    <MapContainer 
                        center={mapCenter} 
                        zoom={10} 
                        scrollWheelZoom={true}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapEvents onMapClick={onMapClick} />
                        {selectedPos && <Marker position={selectedPos} />}
                    </MapContainer>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold"
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>
    );
};

// ==================== COMPONENTS ====================

// Story Component
const Story = ({ story, onClick, isOwn }) => {
    const hasViewed = story.viewed;

    return (
        <div
            onClick={onClick}
            className="flex flex-col items-center space-y-1 cursor-pointer group"
        >
            <div className={`relative p-0.5 rounded-full ${hasViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
                } group-hover:scale-110 transition-transform duration-300`}>
                <div className="bg-white p-0.5 rounded-full">
                    <img
                        src={makeSrc(story.user.profileImage, `https://ui-avatars.com/api/?name=${story.user.username}`)}
                        alt={story.user.username}
                        crossOrigin="anonymous"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                </div>
                {isOwn && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Plus className="w-3 h-3 text-white" />
                    </div>
                )}
            </div>
            <span className="text-xs text-gray-700 truncate w-16 text-center">
                {isOwn ? 'Your Story' : story.user.username}
            </span>
        </div>
    );
};

// Post Component
const Post = ({ post, onLike, onComment, onSave, onShare, onDelete, currentUserId }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [userRating, setUserRating] = useState(0); // My rating
    const [avgRating, setAvgRating] = useState(post.rating || 0); // Avg rating
    const [ratingCount, setRatingCount] = useState(post.ratingCount || 0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [showOptions, setShowOptions] = useState(false);
    const videoRef = useRef(null);

    const isLiked = post.likes?.includes(currentUserId);
    const isSaved = post.saves?.includes(currentUserId);
    const isOwn = post.userId._id === currentUserId;

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleMuteToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleRate = (stars) => {
        setUserRating(stars);
        // Simulate API call
        // In real app: POST /posts/:id/rate { stars }
        // Update avg optimistically
        const newCount = ratingCount + 1;
        const newAvg = ((avgRating * ratingCount) + stars) / newCount;
        setAvgRating(newAvg);
        setRatingCount(newCount);
    };

    const handleComment = () => {
        if (commentText.trim()) {
            onComment(post._id, commentText);
            setCommentText('');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                    <img
                        src={makeSrc(post.userId.profileImage, `https://ui-avatars.com/api/?name=${post.userId.username}`)}
                        alt={post.userId.username}
                        crossOrigin="anonymous"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{post.userId.username}</span>
                            {post.userId.verified && (
                                <Verified className="w-4 h-4 text-blue-500 fill-current" />
                            )}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                post.postType === 'artwork' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {post.postType === 'artwork' ? 'Artwork' : 'Personal'}
                            </span>
                        </div>
                        {post.location && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                <span>{post.location}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    </button>
                    {showOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                            {isOwn ? (
                                <>
                                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => onDelete(post._id)}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span>Delete</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                                        <Flag className="w-4 h-4" />
                                        <span>Report</span>
                                    </button>
                                    <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                                        <EyeOff className="w-4 h-4" />
                                        <span>Hide</span>
                                    </button>
                                </>
                            )}
                            <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                                <Copy className="w-4 h-4" />
                                <span>Copy Link</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2">
                                <ExternalLink className="w-4 h-4" />
                                <span>Open in New Tab</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Post Media */}
            <div className="relative bg-black">
                {post.type === 'video' ? (
                    <div className="relative">
                        <video
                            ref={videoRef}
                            src={post.mediaUrl && (post.mediaUrl.startsWith('http') ? post.mediaUrl : `${API_URL}${post.mediaUrl}`)}
                            className="w-full max-h-[600px] object-contain"
                            loop
                            muted={isMuted}
                            onClick={handlePlayPause}
                        />
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <button
                                onClick={handlePlayPause}
                                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                                className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                            >
                                {isPlaying ? (
                                    <Pause className="w-5 h-5 text-white" />
                                ) : (
                                    <Play className="w-5 h-5 text-white" />
                                )}
                            </button>
                            <button
                                onClick={handleMuteToggle}
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                                className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                            >
                                {isMuted ? (
                                    <VolumeX className="w-5 h-5 text-white" />
                                ) : (
                                    <Volume2 className="w-5 h-5 text-white" />
                                )}
                            </button> 
                        </div>
                    </div>
                ) : post.type === 'image' ? (
                    <img
                        src={post.mediaUrl && (post.mediaUrl.startsWith('http') ? post.mediaUrl : `${API_URL}${post.mediaUrl}`)}
                        alt="Post"
                        crossOrigin="anonymous"
                        className="w-full max-h-[600px] object-contain"
                    />
                ) : null}
            </div>

            {/* Post Actions */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => onLike(post._id)}
                            aria-pressed={isLiked}
                            aria-label={isLiked ? 'Unlike' : 'Like'}
                            className="group flex items-center space-x-1 hover:opacity-70 transition-opacity"
                        >
                            <Heart
                                className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-900'
                                    } group-hover:scale-110 transition-transform`}
                            />
                        </button>
                        <button
                            onClick={() => setShowComments(!showComments)}
                            aria-label="Toggle comments"
                            className="group hover:opacity-70 transition-opacity"
                        >
                            <MessageCircle className="w-6 h-6 text-gray-900 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={() => onShare(post._id)}
                            aria-label="Share post"
                            className="group hover:opacity-70 transition-opacity"
                        >
                            <Send className="w-6 h-6 text-gray-900 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                    <button
                        onClick={() => onSave(post._id)}
                        aria-pressed={isSaved}
                        aria-label={isSaved ? 'Unsave' : 'Save'}
                        className="group hover:opacity-70 transition-opacity"
                    >
                        <Bookmark
                            className={`w-6 h-6 ${isSaved ? 'fill-gray-900 text-gray-900' : 'text-gray-900'
                                } group-hover:scale-110 transition-transform`}
                        />
                    </button>
                </div>

                {/* Likes Count */}
                <div className="mb-2">
                    <span className="font-semibold text-gray-900">
                        {formatNumber(post.likes?.length || 0)} likes
                    </span>
                </div>

                {/* Rating Section (Only for Artworks) */}
                {post.postType === 'artwork' && (
                    <div className="mb-3 flex items-center space-x-2">
                        <StarRating rating={Math.round(avgRating)} readOnly={true} />
                        <span className="text-sm text-gray-600 font-medium">({ratingCount})</span>
                        {!isOwn && (
                            <div className="ml-4 flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Rate:</span>
                                <StarRating rating={userRating} setRating={handleRate} />
                            </div>
                        )}
                    </div>
                )}

                {/* Caption */}
                {post.caption && (
                    <div className="mb-2">
                        <span className="font-semibold text-gray-900">{post.userId.username}</span>{' '}
                        <span className="text-gray-900">{post.caption}</span>
                    </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {post.tags.map((tag, index) => (
                            <span key={index} className="text-blue-600 hover:underline cursor-pointer">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Comments Preview */}
                {post.comments && post.comments.length > 0 && (
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="text-gray-500 text-sm mb-2 hover:text-gray-700"
                    >
                        View all {post.comments.length} comments
                    </button>
                )}

                {/* Timestamp */}
                <div className="text-xs text-gray-500 uppercase">
                    {formatDate(post.createdAt)}
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
                            {post.comments?.map((comment, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                    <img
                                        src={makeSrc(comment.userId?.profileImage, `https://ui-avatars.com/api/?name=${comment.userId?.username}`)}
                                        alt={comment.userId?.username}
                                        crossOrigin="anonymous"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <div className="bg-gray-100 rounded-2xl px-4 py-2">
                                            <span className="font-semibold text-sm">{comment.userId?.username}</span>
                                            <p className="text-sm text-gray-900">{comment.text}</p>
                                        </div>
                                        <div className="flex items-center space-x-4 mt-1 px-4">
                                            <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                                            <button className="text-xs text-gray-500 hover:text-gray-700 font-semibold">
                                                Like
                                            </button>
                                            <button className="text-xs text-gray-500 hover:text-gray-700 font-semibold">
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                                placeholder="Add a comment..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleComment}
                                disabled={!commentText.trim()}
                                className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, user, onLogout, isOpen = false, onClose = () => {} }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'search', icon: Search, label: 'Search' },
        { id: 'explore', icon: TrendingUp, label: 'Explore' },
        { id: 'reels', icon: Film, label: 'Reels' },
        { id: 'messages', icon: MessageCircle, label: 'Messages', badge: 3 },
        { id: 'notifications', icon: Bell, label: 'Notifications', badge: 2 },
        { id: 'create', icon: PlusSquare, label: 'Create' },
        { id: 'profile', icon: User, label: 'Profile' },
    ];

    const mobileClasses = isOpen ? 'fixed inset-0 z-40 w-64 bg-white/80 backdrop-blur-2xl border-r border-white/20' : 'hidden md:block md:fixed md:left-0 md:top-0 md:h-screen md:w-64';

    return (
        <div className={`${mobileClasses} flex flex-col bg-white/80 backdrop-blur-2xl border-r border-gray-100 shadow-2xl z-40`}>
            {/* Logo */}
            <div className="p-8 flex items-center justify-between">
                <h1 className="text-3xl font-black bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent italic tracking-tighter">
                    FlowGram
                </h1>
                <button onClick={onClose} className="md:hidden p-2 rounded-full hover:bg-gray-100/50">
                    <X className="w-5 h-5" />
                </button>
            </div> 

            {/* Menu Items */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); onClose(); }}
                        className={`w-full flex items-center group relative px-4 py-3.5 rounded-2xl transition-all duration-300 ${activeTab === item.id
                                ? 'bg-gradient-to-r from-purple-600/10 to-pink-500/10 text-purple-600 font-bold'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <item.icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${activeTab === item.id ? 'stroke-[2.5px]' : ''}`} />
                        <span className="ml-4 text-[15px]">{item.label}</span>
                        {item.badge > 0 && (
                            <span className="ml-auto bg-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                                {item.badge}
                            </span>
                        )}
                        {activeTab === item.id && (
                            <div className="absolute left-0 w-1.5 h-6 bg-gradient-to-b from-purple-600 to-pink-500 rounded-r-full shadow-[0_0_12px_rgba(168,85,247,0.4)]" />
                        )}
                    </button>
                ))}
            </nav>

            {/* User Section */}
            <div className="p-4 m-4 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-3 mb-4 p-1">
                    <div className="relative">
                        <img
                            src={makeSrc(user?.profileImage, `https://ui-avatars.com/api/?name=${user?.username}`)}
                            alt={user?.username}
                            crossOrigin="anonymous"
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-sm">{user?.username || 'Guest'}</p>
                        <p className="text-[11px] text-gray-400 truncate opacity-80">{user?.email}</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <button
                        onClick={() => navigate('/videoeditor')}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-white hover:text-purple-600 hover:shadow-sm rounded-xl transition-all font-medium"
                    >
                        <VideoIcon className="w-4 h-4" />
                        <span>Studio</span>
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-500/80 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-medium"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Suggestions Component
const Suggestions = ({ users, onFollow }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Suggestions For You</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                    See All
                </button>
            </div>
            <div className="space-y-3">
                {users.map((user) => (
                    <div key={user._id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <img
                                src={makeSrc(user.profileImage, `https://ui-avatars.com/api/?name=${user.username}`)}
                                alt={user.username}
                                crossOrigin="anonymous"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-semibold text-sm text-gray-900">{user.username}</p>
                                <p className="text-xs text-gray-500">Suggested for you</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onFollow(user._id)}
                            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Follow
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Create Post Modal
const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
    const [caption, setCaption] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState('');
    const [postType, setPostType] = useState('personal'); // 'personal' | 'artwork'
    const [location, setLocation] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [tags, setTags] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    // Max file size 100MB
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    const allowedImageTypes = ['image/jpeg','image/png','image/webp','image/gif'];
    const allowedVideoTypes = ['video/mp4','video/webm','video/quicktime','video/x-matroska'];


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate size
            if (file.size > MAX_FILE_SIZE) {
                alert('File is too large. Maximum allowed size is 100 MB.');
                return;
            }

            // Validate type
            const type = file.type;
            if (type.startsWith('image') && !allowedImageTypes.includes(type)) {
                alert('Unsupported image type. Use JPG, PNG, WEBP or GIF.');
                return;
            }
            if (type.startsWith('video') && !allowedVideoTypes.includes(type)) {
                alert('Unsupported video type. Use MP4, WebM, MOV or MKV.');
                return;
            }

            setMediaFile(file);
            setMediaType(file.type.startsWith('video') ? 'video' : 'image');
            const reader = new FileReader();
            reader.onloadend = () => {
                setMediaPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!mediaFile || isUploading) return;

        setIsUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        // User requested: keep ONE (use 'media' field only)
        formData.append('media', mediaFile);
        formData.append('caption', caption);
        formData.append('location', location);
        formData.append('tags', JSON.stringify(tags.split(',').map(t => t.trim()).filter(Boolean)));
        formData.append('type', mediaType);
        formData.append('postType', postType);

        try {
            await onSubmit(formData, (progress) => setUploadProgress(progress));
            // Success: reset and close
            setCaption('');
            setMediaFile(null);
            setMediaPreview(null);
            setMediaType('');
            setLocation('');
            setTags('');
            setIsUploading(false);
            setUploadProgress(0);
            onClose();
        } catch (error) {
            console.error('CreatePost submit error:', error);
            setIsUploading(false);
            setUploadProgress(0);
            // showToast is handled by parent, but we can catch local failures here if needed
        }
    };

    const handleClose = () => {
        setCaption('');
        setMediaFile(null);
        setMediaPreview(null);
        setMediaType('');
        setLocation('');
        setTags('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    {!mediaPreview ? (
                        <div className="p-6">
                            {/* Post Type Selector */}
                            <div className="flex justify-center mb-6">
                                <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
                                    <button
                                        onClick={() => setPostType('personal')}
                                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                                            postType === 'personal' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                                        }`}
                                    >
                                        Personal
                                    </button>
                                    <button
                                        onClick={() => setPostType('artwork')}
                                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                                            postType === 'artwork' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500'
                                        }`}
                                    >
                                        Community Art
                                    </button>
                                </div>
                            </div>
                            
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 transition-colors"
                            >
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="p-4 bg-purple-100 rounded-full">
                                        <ImageIcon className="w-12 h-12 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900 mb-1">
                                            Select photos or videos
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            or drag and drop them here
                                        </p>
                                    </div>
                                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                                        Select from computer
                                    </button>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="p-6 space-y-4">
                            <div className="relative bg-black rounded-2xl overflow-hidden">
                                {mediaType === 'video' ? (
                                    <video src={mediaPreview} controls className="w-full max-h-96 object-contain" />
                                ) : (
                                    <img src={mediaPreview} alt="Preview" className="w-full max-h-96 object-contain" />
                                )}
                                <button
                                    onClick={() => {
                                        setMediaFile(null);
                                        setMediaPreview(null);
                                        setMediaType('');
                                    }}
                                    className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Caption
                                    </label>
                                    <textarea
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        placeholder="Write a caption..."
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Location
                                    </label>
                                    <div className="flex space-x-2">
                                        <div className="relative flex-1">
                                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                placeholder="Add location"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                        </div>
                                        <button 
                                            onClick={() => setShowMap(true)}
                                            className="px-3 bg-gray-100 rounded-xl hover:bg-gray-200"
                                        >
                                            <Map className="w-5 h-5 text-gray-700" />
                                        </button>
                                    </div>
                                    <LocationPicker 
                                        isOpen={showMap} 
                                        onClose={() => setShowMap(false)}
                                        location={location}
                                        setLocation={setLocation}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Tags (comma separated)
                                    </label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            placeholder="travel, photography, nature"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {mediaPreview && (
                    <div className="p-4 border-t border-gray-200">
                        <div className="mb-3">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div className="h-2 bg-purple-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                            </div>
                            {uploadProgress > 0 && <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isUploading}
                            className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center space-x-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Uploading...</span>
                                </>
                            ) : (
                                <span>Share Post</span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Profile Tab Component
const ProfileTab = ({ user, posts, onEditProfile }) => {
    const [activeSection, setActiveSection] = useState('posts');

    return (
        <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
                <div className="flex items-start space-x-8 mb-8">
                    <img
                        src={makeSrc(user?.profileImage, `https://ui-avatars.com/api/?name=${user?.username}`)}
                        alt={user?.username}
                        crossOrigin="anonymous"
                        className="w-32 h-32 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
                            {user?.verified && (
                                <Verified className="w-6 h-6 text-blue-500 fill-current" />
                            )}
                            <button
                                onClick={onEditProfile}
                                className="px-6 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                            >
                                Edit Profile
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Settings className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex items-center space-x-8 mb-4">
                            <div className="text-center">
                                <span className="font-bold text-gray-900 text-lg">{posts.length}</span>
                                <p className="text-gray-600 text-sm">posts</p>
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-gray-900 text-lg">{formatNumber(getCount(user?.followers))}</span>
                                <p className="text-gray-600 text-sm">followers</p>
                            </div>
                            <div className="text-center">
                                <span className="font-bold text-gray-900 text-lg">{formatNumber(getCount(user?.following))}</span>
                                <p className="text-gray-600 text-sm">following</p>
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-900 mb-1">{user?.fullName}</p>
                            <p className="text-gray-700 whitespace-pre-wrap">{user?.bio}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                        <div className="p-3 bg-purple-600 rounded-lg">
                            <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatNumber(user?.stats?.totalViews || 0)}
                            </p>
                            <p className="text-sm text-gray-600">Total Views</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-pink-50 rounded-xl">
                        <div className="p-3 bg-pink-600 rounded-lg">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {formatNumber(user?.stats?.totalLikes || 0)}
                            </p>
                            <p className="text-sm text-gray-600">Total Likes</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                        <div className="p-3 bg-blue-600 rounded-lg">
                            <Film className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                {user?.stats?.totalVideos || 0}
                            </p>
                            <p className="text-sm text-gray-600">Total Videos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-center space-x-12 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveSection('posts')}
                    className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${activeSection === 'posts'
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Grid className="w-5 h-5" />
                    <span className="font-semibold">POSTS</span>
                </button>
                <button
                    onClick={() => setActiveSection('saved')}
                    className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${activeSection === 'saved'
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Bookmark className="w-5 h-5" />
                    <span className="font-semibold">SAVED</span>
                </button>
                <button
                    onClick={() => setActiveSection('tagged')}
                    className={`flex items-center space-x-2 pb-3 border-b-2 transition-colors ${activeSection === 'tagged'
                            ? 'border-gray-900 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Tag className="w-5 h-5" />
                    <span className="font-semibold">TAGGED</span>
                </button>
            </div>

            {/* Posts Grid */}
            {activeSection === 'posts' && (
                <div className="grid grid-cols-3 gap-1">
                    {posts.map((post) => (
                        <div
                            key={post._id}
                            className="relative aspect-square bg-gray-100 cursor-pointer group overflow-hidden"
                        >
                            {post.type === 'video' ? (
                                <video
                                    src={post.mediaUrl && (post.mediaUrl.startsWith('http') ? post.mediaUrl : `${API_URL}${post.mediaUrl}`)}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img
                                    src={post.mediaUrl && (post.mediaUrl.startsWith('http') ? post.mediaUrl : `${API_URL}${post.mediaUrl}`)}
                                    alt="Post"
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6">
                                <div className="flex items-center space-x-2 text-white">
                                    <Heart className="w-6 h-6 fill-current" />
                                    <span className="font-semibold">{formatNumber(post.likes?.length || 0)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-white">
                                    <MessageCircle className="w-6 h-6 fill-current" />
                                    <span className="font-semibold">{formatNumber(post.comments?.length || 0)}</span>
                                </div>
                            </div>
                            {post.type === 'video' && (
                                <div className="absolute top-2 right-2">
                                    <Play className="w-5 h-5 text-white fill-current" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeSection === 'saved' && (
                <div className="text-center py-12">
                    <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No saved posts yet</p>
                </div>
            )}

            {activeSection === 'tagged' && (
                <div className="text-center py-12">
                    <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No tagged posts yet</p>
                </div>
            )}
        </div>
    );
};

// Main Dashboard Component
const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [activeFeedTab, setActiveFeedTab] = useState('artwork'); // 'artwork' | 'personal'
    const [locationFilter, setLocationFilter] = useState('');
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [toast, setToast] = useState({ message: '', type: 'success', open: false });
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        loadUserData();
        loadFeed();
        loadStories();
        loadSuggestions();
        loadNotifications();
        loadMessages();

        // Listen for global post creation events so feed and counters refresh
        const onPostCreated = () => {
            loadFeed();
            loadUserData();
        };
        window.addEventListener('post:created', onPostCreated);
        return () => window.removeEventListener('post:created', onPostCreated);
    }, []);

    useEffect(() => {
        if (activeTab === 'create') {
            setShowCreateModal(true);
            setActiveTab('home');
        }
    }, [activeTab]);

    const loadUserData = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/me`, getAuthHeader());
            setUser(response.data.user);
        } catch (error) {
            console.error('Load user error:', error);
            if (error.response?.status === 401) {
                navigate('/signin');
            }
        }
    };

    const loadFeed = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/posts/feed`, getAuthHeader());
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Load feed error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadStories = async () => {
        try {
            const response = await axios.get(`${API_URL}/stories`, getAuthHeader());
            setStories(response.data.stories);
        } catch (error) {
            console.error('Load stories error:', error);
        }
    };

    const handleCreateStory = async (formData) => {
        try {
            await axios.post(`${API_URL}/stories`, formData, {
                ...getAuthHeader(),
                headers: { ...getAuthHeader().headers, 'Content-Type': 'multipart/form-data' }
            });
            setShowCreateModal(false);
            loadStories();
            showToast('Story shared!');
        } catch (error) {
            console.error('Create story error:', error);
            showToast('Could not share story', 'error');
        }
    };

    const createDummyUsers = (count = 4) => {
        const base = [
            { _id: 'dummy-1', username: 'travel_guru', profileImage: 'https://i.pravatar.cc/150?img=12' },
            { _id: 'dummy-2', username: 'foodie99', profileImage: 'https://i.pravatar.cc/150?img=5' },
            { _id: 'dummy-3', username: 'cinema_lover', profileImage: 'https://i.pravatar.cc/150?img=28' },
            { _id: 'dummy-4', username: 'nature_photos', profileImage: 'https://i.pravatar.cc/150?img=47' }
        ];
        return base.slice(0, count);
    };

    const loadSuggestions = async () => {
        try {
            const response = await axios.get(`${API_URL}/users/search/a`, getAuthHeader());
            let users = response.data.users || [];
            if (users.length < 4) {
                const missing = 4 - users.length;
                users = users.concat(createDummyUsers(missing));
            }
            setSuggestions(users.slice(0, 5));
        } catch (error) {
            console.error('Load suggestions error:', error);
            // Fallback to dummy data
            setSuggestions(createDummyUsers(4));
        }
    };

    const loadNotifications = async () => {
        try {
            const response = await axios.get(`${API_URL}/notifications`, getAuthHeader());
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.notifications.filter(n => !n.read).length);
        } catch (error) {
            console.error('Load notifications error:', error);
            // Fallback for demo
            setNotifications([
                { _id: 'n1', fromUserId: { username: 'alex_art', profileImage: 'https://i.pravatar.cc/150?u=n1' }, type: 'like', message: 'liked your post', createdAt: new Date(), read: false },
                { _id: 'n2', fromUserId: { username: 'sarah_m', profileImage: 'https://i.pravatar.cc/150?u=n2' }, type: 'comment', message: 'commented: "Amazing work! 🔥"', createdAt: new Date(Date.now() - 3600000), read: true }
            ]);
        }
    };

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [activeMessages, setActiveMessages] = useState([]);

    const [searchResults, setSearchResults] = useState([]);
    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const response = await axios.get(`${API_URL}/users/search/${query}`, getAuthHeader());
            setSearchResults(response.data.users);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    const loadConversations = async () => {
        try {
            const response = await axios.get(`${API_URL}/messages/conversations`, getAuthHeader());
            setConversations(response.data.conversations);
        } catch (error) {
            console.error('Load conversations error:', error);
        }
    };

    const loadMessagesWithUser = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/messages/${userId}`, getAuthHeader());
            setActiveMessages(response.data.messages);
        } catch (error) {
            console.error('Load messages error:', error);
        }
    };

    const handleSendMessage = async (receiverId, text) => {
        if (!text.trim()) return;
        try {
            await axios.post(`${API_URL}/messages`, { receiverId, text }, getAuthHeader());
            loadMessagesWithUser(receiverId);
            loadConversations();
        } catch (error) {
            console.error('Send message error:', error);
            showToast('Could not send message', 'error');
        }
    };

    const loadMessages = loadConversations;

    // Simple toast helper
    const showToast = (message, type = 'success', duration = 3000) => {
        setToast({ message, type, open: true });
        setTimeout(() => setToast(prev => ({ ...prev, open: false })), duration);
    };

    const handleLike = async (postId) => {
        // Optimistic UI update
        setPosts(prev => prev.map(p => {
            if (p._id !== postId) return p;
            const isLiked = p.likes?.includes(user._id);
            return { ...p, likes: isLiked ? p.likes.filter(id => id !== user._id) : [...(p.likes || []), user._id] };
        }));

        try {
            await axios.post(`${API_URL}/posts/${postId}/like`, {}, getAuthHeader());
        } catch (error) {
            console.error('Like error:', error);
            showToast('Could not update like', 'error');
            loadFeed(); // revert on failure
        }
    };

    const handleComment = async (postId, text) => {
        try {
            await axios.post(`${API_URL}/posts/${postId}/comment`, { text }, getAuthHeader());
            loadFeed();
        } catch (error) {
            console.error('Comment error:', error);
            showToast('Could not post comment', 'error');
        }
    };

    const handleSave = async (postId) => {
        // Optimistic UI update
        setPosts(prev => prev.map(p => {
            if (p._id !== postId) return p;
            const isSaved = p.saves?.includes(user._id);
            return { ...p, saves: isSaved ? p.saves.filter(id => id !== user._id) : [...(p.saves || []), user._id] };
        }));

        try {
            await axios.post(`${API_URL}/posts/${postId}/save`, {}, getAuthHeader());
            showToast('Saved post');
        } catch (error) {
            console.error('Save error:', error);
            showToast('Could not save post', 'error');
            loadFeed(); // revert
        }
    };

    const handleShare = async (postId) => {
        const postUrl = `${window.location.origin}/posts/${postId}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: 'Check out this post', url: postUrl });
                showToast('Shared');
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(postUrl);
                showToast('Link copied to clipboard');
            } else {
                const input = document.createElement('input');
                input.value = postUrl;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                input.remove();
                showToast('Link copied to clipboard');
            }
        } catch (error) {
            console.error('Share error:', error);
            showToast('Could not share', 'error');
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`${API_URL}/posts/${postId}`, getAuthHeader());
                loadFeed();
                showToast('Post deleted');
            } catch (error) {
                console.error('Delete error:', error);
                showToast('Could not delete post', 'error');
            }
        }
    };

    const handleFollow = async (userId) => {
        // Optimistic UI update
        setUser(prev => ({
            ...prev,
            following: [...(prev.following || []), userId]
        }));

        try {
            // If it's a dummy local user, simulate follow client-side
            if (typeof userId === 'string' && userId.startsWith('dummy-')) {
                setSuggestions(prev => prev.filter(u => u._id !== userId));
                showToast('Followed (demo account)');
                return;
            }

            await axios.post(`${API_URL}/users/${userId}/follow`, {}, getAuthHeader());
            // Refresh suggestions and current user data so follower/following counters update
            await loadSuggestions();
            // loadUserData() will also refresh the actual state from API
            await loadUserData();
            showToast('Followed');
        } catch (error) {
            console.error('Follow error:', error);
            showToast('Could not follow', 'error');
            // Revert on failure
            loadUserData();
        }
    };

    const handleMarkNotification = async (notificationId) => {
        try {
            await axios.post(`${API_URL}/notifications/${notificationId}/mark-read`, {}, getAuthHeader());
            setNotifications(prev => prev.map(n => n._id === notificationId ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Mark notification error:', error);
            showToast('Could not mark notification', 'error');
        }
    }; 

    const handleCreatePost = async (formData, onProgress) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/posts`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(percent);
                    }
                }
            });

            // Optimistic update: Add new post to feed instantly
            if (response?.data?.post) {
                setPosts(prev => [response.data.post, ...(prev || [])]);
            } else {
                await loadFeed();
            }

            await loadUserData();
            showToast('Post shared successfully!');
            window.dispatchEvent(new Event('post:created'));
            
            return response.data;
        } catch (error) {
            console.error('Create post error:', error);
            let message = 'Could not create post';
            if (error?.response?.data) {
                message = error.response.data.message || error.response.data.error || message;
            } else if (error?.message) {
                message = error.message;
            }
            showToast(message, 'error');
            if (error?.response?.status === 401) {
                navigate('/signin');
            }
            throw error;
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                    if (tab === 'create') {
                        setShowCreateModal(true);
                    } else {
                        setActiveTab(tab);
                    }
                }}
                user={user}
                onLogout={handleLogout}
                isOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            {/* Toast */}
            {toast.open && (
                <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`} role="status">
                    {toast.message}
                </div>
            )}

            <div className="ml-0 md:ml-64 min-h-screen">
                {/* Mobile top bar */}
                <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                    <button onClick={() => setMobileSidebarOpen(true)} aria-label="Open menu" className="p-2">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex-1 text-center font-semibold">FlowGram</div>
                    <div className="w-6" />
                </div>

                {activeTab === 'home' && (
                    <div className="max-w-6xl mx-auto px-8 py-6">
                        {/* Feed Tabs & Filters */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex space-x-8 border-b border-gray-200">
                                <button
                                    onClick={() => setActiveFeedTab('artwork')}
                                    className={`pb-4 text-lg font-bold transition-colors ${
                                        activeFeedTab === 'artwork'
                                            ? 'text-purple-600 border-b-2 border-purple-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Community Art
                                </button>
                                <button
                                    onClick={() => setActiveFeedTab('personal')}
                                    className={`pb-4 text-lg font-bold transition-colors ${
                                        activeFeedTab === 'personal'
                                            ? 'text-purple-600 border-b-2 border-purple-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Personal Hub
                                </button>
                            </div>

                            {/* Location Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Filter by location..."
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-8">
                            {/* Main Feed */}
                            <div className="col-span-2">
                                {/* Stories */}
                                <div className="flex items-center space-x-6 overflow-x-auto pb-2 scrollbar-hide">
                                    <Story
                                        story={{ user: user, stories: [] }}
                                        isOwn={true}
                                        onClick={() => setShowCreateModal(true)}
                                    />
                                    {stories.map((storyGroup, index) => (
                                        <Story
                                            key={index}
                                            story={storyGroup}
                                            onClick={() => { }}
                                        />
                                    ))}
                                </div>

                                {/* Posts */}
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                                    </div>
                                ) : (
                                    posts.length === 0 ? (
                                        <div className="space-y-6">
                                            {/* Dummy Posts if feed is empty */}
                                            {[
                                                {
                                                    _id: 'd1',
                                                    userId: { username: 'metaspark', profileImage: 'https://i.pravatar.cc/150?u=p1', verified: true },
                                                    type: 'image',
                                                    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
                                                    caption: 'Exploring the depths of generative art. 🎨 #AI #DigitalArt',
                                                    likes: ['user1', 'user2'],
                                                    comments: [{ userId: { username: 'fan1' }, text: 'Incredible!' }],
                                                    createdAt: new Date(),
                                                    postType: 'artwork'
                                                },
                                                {
                                                    _id: 'd2',
                                                    userId: { username: 'adventure_seeker', profileImage: 'https://i.pravatar.cc/150?u=p2' },
                                                    type: 'video',
                                                    mediaUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                                                    caption: 'A dream within a dream. 🐘✨ #VideoEditor #VFX',
                                                    likes: ['user1'],
                                                    comments: [],
                                                    createdAt: new Date(Date.now() - 86400000),
                                                    postType: 'artwork'
                                                }
                                            ]
                                                .filter(p => !locationFilter || (p.location && p.location.toLowerCase().includes(locationFilter.toLowerCase())))
                                                .filter(p => p.postType === activeFeedTab)
                                                .map(post => (
                                                    <Post
                                                        key={post._id}
                                                        post={post}
                                                        onLike={handleLike}
                                                        onComment={handleComment}
                                                        onSave={handleSave}
                                                        onShare={handleShare}
                                                        onDelete={handleDelete}
                                                        currentUserId={user._id}
                                                    />
                                                ))}
                                            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center">
                                                <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">No more posts</h3>
                                                <p className="text-gray-600 mb-6">You've reached the end of the feed. Explore more art!</p>
                                                <button
                                                    onClick={() => setActiveTab('explore')}
                                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-2xl hover:opacity-90 transition-all font-bold shadow-lg shadow-purple-500/25"
                                                >
                                                    Explore Trends
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        posts
                                            .filter(p => {
                                                if (locationFilter && !p.location?.toLowerCase().includes(locationFilter.toLowerCase())) return false;
                                                const pType = p.postType || 'artwork';
                                                return pType === activeFeedTab;
                                            })
                                            .map((post) => (
                                                <Post
                                                    key={post._id}
                                                    post={post}
                                                    onLike={handleLike}
                                                    onComment={handleComment}
                                                    onSave={handleSave}
                                                    onShare={handleShare}
                                                    onDelete={handleDelete}
                                                    currentUserId={user._id}
                                                />
                                            ))
                                    )
                                )}
                            </div>

                            {/* Suggestions Sidebar */}
                            <div className="space-y-6">
                                <Suggestions users={suggestions} onFollow={handleFollow} />
                                <div className="text-xs text-gray-500 space-y-2">
                                    <div className="flex flex-wrap gap-2">
                                        <a href="#" className="hover:underline">About</a><span>·</span>
                                        <a href="#" className="hover:underline">Help</a><span>·</span>
                                        <a href="#" className="hover:underline">Press</a><span>·</span>
                                        <a href="#" className="hover:underline">API</a><span>·</span>
                                        <a href="#" className="hover:underline">Jobs</a><span>·</span>
                                        <a href="#" className="hover:underline">Privacy</a><span>·</span>
                                        <a href="#" className="hover:underline">Terms</a>
                                    </div>
                                    <p>© 2025 FlowGram from Flow</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'search' && (
                    <div className="max-w-2xl mx-auto px-8 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <Search className="w-8 h-8 text-purple-600" />
                            Search
                        </h2>
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search for artists, categories, or trends..."
                                className="w-full bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-4 focus:ring-purple-500/10 transition-all shadow-xl outline-none"
                            />
                        </div>
                        <div className="space-y-4">
                            {searchResults.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">Search for users above 🔍</div>
                            ) : (
                                searchResults.map(u => (
                                    <div key={u._id} className="bg-white/50 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 hover:shadow-lg transition-all border border-white/20">
                                        <img src={makeSrc(u.profileImage)} crossOrigin="anonymous" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{u.username}</h4>
                                            <p className="text-xs text-gray-500">{u.fullName}</p>
                                        </div>
                                        <button onClick={() => handleFollow(u._id)} className="px-6 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20">Follow</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'explore' && (
                    <div className="max-w-6xl mx-auto px-8 py-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore</h2>
                        <div className="grid grid-cols-3 gap-1">
                            {posts.map((post) => (
                                <div key={post._id} className="relative aspect-square bg-gray-100 cursor-pointer group overflow-hidden">
                                    {post.type === 'video' ? (
                                        <video src={post.mediaUrl && (post.mediaUrl.startsWith('http') ? post.mediaUrl : `${API_URL}${post.mediaUrl}`)} className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={post.mediaUrl && (post.mediaUrl.startsWith('http') ? post.mediaUrl : `${API_URL}${post.mediaUrl}`)} alt="Post" crossOrigin="anonymous" className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6">
                                        <div className="flex items-center space-x-2 text-white"><Heart className="w-6 h-6 fill-current" /><span className="font-semibold">{formatNumber(post.likes?.length || 0)}</span></div>
                                        <div className="flex items-center space-x-2 text-white"><MessageCircle className="w-6 h-6 fill-current" /><span className="font-semibold">{formatNumber(post.comments?.length || 0)}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="max-w-6xl mx-auto px-8 py-6">
                        <ProfileTab
                            user={user}
                            posts={posts.filter(p => {
                                if (!p.userId) return false;
                                const postUserId = p.userId._id ? p.userId._id : p.userId;
                                return postUserId === user._id;
                            })}
                            onEditProfile={() => { }}
                        />
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="max-w-2xl mx-auto px-8 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3"><Bell className="w-8 h-8 text-purple-600" />Notifications</h2>
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 divide-y divide-gray-100 overflow-hidden">
                            {notifications.length === 0 ? (
                                <div className="p-16 text-center">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6"><Bell className="w-10 h-10 text-gray-300" /></div>
                                    <p className="text-gray-500 font-medium">All caught up!</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div key={notification._id} onClick={() => handleMarkNotification(notification._id)} className={`p-5 flex items-start space-x-4 cursor-pointer hover:bg-purple-50/50 transition-colors ${!notification.read ? 'bg-purple-50/30' : ''}`}>
                                        <img src={notification.fromUserId?.profileImage} crossOrigin="anonymous" className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" />
                                        <div className="flex-1">
                                            <p className="text-sm">
                                                <span className="font-bold text-gray-900">{notification.fromUserId?.username}</span>
                                                <span className="text-gray-600 ml-2">{notification.message}</span>
                                            </p>
                                            <span className="text-xs text-gray-400 mt-1 block">{formatDate(notification.createdAt)}</span>
                                        </div>
                                        {!notification.read && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full mt-2" />}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="max-w-5xl mx-auto px-8 py-6 h-[calc(100vh-80px)] md:h-screen flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3"><MessageCircle className="w-8 h-8 text-purple-600" />Messages</h2>
                        <div className="flex-1 flex bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                            <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/30">
                                <div className="p-4 border-b border-gray-100"><input type="text" placeholder="Search chats..." className="w-full bg-white/50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500" /></div>
                                <div className="flex-1 overflow-y-auto">
                                    {conversations.length === 0 ? (<div className="p-8 text-center text-gray-400 text-sm">No conversations yet</div>) : (
                                        conversations.map(msg => (
                                            <div key={msg.user?._id} onClick={() => { setSelectedConversation(msg.user); loadMessagesWithUser(msg.user?._id); }} className={`p-4 flex items-center gap-4 hover:bg-white cursor-pointer transition-all border-b border-gray-50/50 ${selectedConversation?._id === msg.user?._id ? 'bg-white shadow-sm ring-1 ring-purple-100' : ''}`}>
                                                <div className="relative"><img src={makeSrc(msg.user?.profileImage, `https://ui-avatars.com/api/?name=${msg.user?.username}`)} crossOrigin="anonymous" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />{msg.unreadCount > 0 && <div className="absolute top-0 right-0 w-3 h-3 bg-purple-500 border-2 border-white rounded-full" />}</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline mb-0.5"><span className="font-bold text-gray-900 text-sm">{msg.user?.username}</span><span className="text-[10px] text-gray-400 font-medium">{formatDate(msg.lastMessage?.createdAt)}</span></div>
                                                    <p className="text-xs text-gray-500 truncate font-medium">{msg.lastMessage?.text}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col bg-white/50">
                                {selectedConversation ? (
                                    <>
                                        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white/30 backdrop-blur-sm"><img src={makeSrc(selectedConversation.profileImage)} crossOrigin="anonymous" className="w-8 h-8 rounded-full" /><span className="font-bold text-gray-900">{selectedConversation.username}</span></div>
                                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20">
                                            {activeMessages.map((m, i) => (
                                                <div key={i} className={`flex ${m.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${m.senderId._id === user._id ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>{m.text}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-4 bg-white/50 backdrop-blur-md border-t border-gray-100">
                                            <form onSubmit={(e) => { e.preventDefault(); const txt = e.target.msg.value; if (!txt) return; handleSendMessage(selectedConversation._id, txt); e.target.reset(); }} className="flex gap-2">
                                                <input name="msg" type="text" placeholder="Type a message..." className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none" /><button type="submit" className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"><Send className="w-5 h-5" /></button>
                                            </form>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6"><MessageCircle className="w-10 h-10 text-purple-400" /></div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
                                        <p className="text-gray-500 max-w-xs mx-auto">Choose a contact from the list to start messaging or search for someone new.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <CreatePostModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreatePost}
            />
        </div>
    );
};

export default Dashboard;
