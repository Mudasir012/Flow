const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const session = require('express-session');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/videoplatform';

// ==================== MIDDLEWARE ====================
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
}));
app.use(compression());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use(morgan('dev'));

// Session configuration
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000
});
app.use('/api/', limiter);

const uploadsDir = path.join(__dirname, 'uploads');
const videosDir = path.join(uploadsDir, 'videos');
const imagesDir = path.join(uploadsDir, 'images');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
const profilesDir = path.join(uploadsDir, 'profiles');

[uploadsDir, videosDir, imagesDir, thumbnailsDir, profilesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

app.use('/uploads', express.static(uploadsDir, {
    setHeaders: (res) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));
app.use('/api/uploads', express.static(uploadsDir, {
    setHeaders: (res) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'video') {
            cb(null, videosDir);
        } else if (file.fieldname === 'thumbnail') {
            cb(null, thumbnailsDir);
        } else if (file.fieldname === 'profileImage') {
            cb(null, profilesDir);
        } else {
            cb(null, imagesDir);
        }
    },
    filename: function (req, file, cb) {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'video') {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    } else if (file.fieldname === 'thumbnail' || file.fieldname === 'profileImage' || file.fieldname === 'image') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 500 * 1024 * 1024 }
});

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    fullName: { type: String, default: '' },
    bio: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    preferences: {
        theme: { type: String, default: 'dark' },
        notifications: { type: Boolean, default: true },
        privacy: { type: String, default: 'public' }
    },
    stats: {
        totalVideos: { type: Number, default: 0 },
        totalViews: { type: Number, default: 0 },
        totalLikes: { type: Number, default: 0 }
    }
});

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    size: { type: Number, default: 0 },
    format: { type: String, default: 'mp4' },
    resolution: { type: String, default: '1080p' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    tags: [{ type: String }],
    category: { type: String, default: 'General' },
    privacy: { type: String, enum: ['public', 'private', 'unlisted'], default: 'public' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    metadata: {
        codec: { type: String, default: '' },
        bitrate: { type: String, default: '' },
        fps: { type: Number, default: 30 }
    }
});

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['video', 'image', 'text'], default: 'video' },
    content: { type: String, default: '' },
    mediaUrl: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    caption: { type: String, default: '' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    shares: { type: Number, default: 0 },
    saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: String }],
    location: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const storySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mediaUrl: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    expiresAt: { type: Date, default: () => new Date(+new Date() + 24 * 60 * 60 * 1000) },
    createdAt: { type: Date, default: Date.now }
});

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['like', 'comment', 'follow', 'mention', 'share'], required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Message Schema
const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Project Schema (for video editor)
const projectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    timeline: { type: Object, default: {} },
    clips: [{ type: Object }],
    effects: [{ type: Object }],
    transitions: [{ type: Object }],
    audioTracks: [{ type: Object }],
    textOverlays: [{ type: Object }],
    settings: { type: Object, default: {} },
    thumbnail: { type: String, default: '' },
    lastModified: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

// ==================== MODELS ====================
const User = mongoose.model('User', userSchema);
const Video = mongoose.model('Video', videoSchema);
const Post = mongoose.model('Post', postSchema);
const Story = mongoose.model('Story', storySchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Message = mongoose.model('Message', messageSchema);
const Project = mongoose.model('Project', projectSchema);

// ==================== AUTHENTICATION MIDDLEWARE ====================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};


app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email or username' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            fullName: fullName || username
        });

        await user.save();

        // Generate token
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                profileImage: user.profileImage,
                bio: user.bio,
                verified: user.verified,
                stats: user.stats
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== USER ROUTES ====================

// Get user profile
app.get('/api/users/:userId', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('-password')
            .populate('followers', 'username profileImage')
            .populate('following', 'username profileImage');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
app.put('/api/users/profile', authenticateToken, upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const { fullName, bio, username } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (fullName) user.fullName = fullName;
        if (bio) user.bio = bio;
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: 'Username already taken' });
            }
            user.username = username;
        }

        if (req.files) {
            if (req.files.profileImage) {
                user.profileImage = `/uploads/profiles/${req.files.profileImage[0].filename}`;
            }
            if (req.files.coverImage) {
                user.coverImage = `/uploads/profiles/${req.files.coverImage[0].filename}`;
            }
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                bio: user.bio,
                profileImage: user.profileImage,
                coverImage: user.coverImage
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Follow user
app.post('/api/users/:userId/follow', authenticateToken, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.userId);
        const currentUser = await User.findById(req.user.userId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.params.userId === req.user.userId) {
            return res.status(400).json({ error: 'Cannot follow yourself' });
        }

        const isFollowing = currentUser.following.includes(req.params.userId);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.userId);
            userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.user.userId);
        } else {
            // Follow
            currentUser.following.push(req.params.userId);
            userToFollow.followers.push(req.user.userId);

            // Create notification
            const notification = new Notification({
                userId: req.params.userId,
                fromUserId: req.user.userId,
                type: 'follow',
                message: `${currentUser.username} started following you`
            });
            await notification.save();
        }

        await currentUser.save();
        await userToFollow.save();

        res.json({
            message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            isFollowing: !isFollowing
        });
    } catch (error) {
        console.error('Follow error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/users/search/:query', authenticateToken, async (req, res) => {
    try {
        const users = await User.find({
            $or: [
                { username: { $regex: req.params.query, $options: 'i' } },
                { fullName: { $regex: req.params.query, $options: 'i' } }
            ]
        }).select('-password').limit(20);

        res.json({ users });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/videos/upload', authenticateToken, upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
    try {
        const { title, description, tags, category, privacy } = req.body;

        if (!req.files || !req.files.video) {
            return res.status(400).json({ error: 'Video file is required' });
        }

        const videoFile = req.files.video[0];
        const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

        const video = new Video({
            title: title || 'Untitled Video',
            description: description || '',
            videoUrl: `/uploads/videos/${videoFile.filename}`,
            thumbnailUrl: thumbnailFile ? `/uploads/thumbnails/${thumbnailFile.filename}` : '',
            size: videoFile.size,
            format: path.extname(videoFile.filename).substring(1),
            userId: req.user.userId,
            tags: tags ? JSON.parse(tags) : [],
            category: category || 'General',
            privacy: privacy || 'public'
        });

        await video.save();

        await User.findByIdAndUpdate(req.user.userId, {
            $inc: { 'stats.totalVideos': 1 }
        });

        res.status(201).json({
            message: 'Video uploaded successfully',
            video
        });
    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({ error: 'Server error during video upload' });
    }
});

app.get('/api/videos', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20, category, userId } = req.query;
        const query = { privacy: 'public' };

        if (category) query.category = category;
        if (userId) query.userId = userId;

        const videos = await Video.find(query)
            .populate('userId', 'username profileImage verified')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Video.countDocuments(query);

        res.json({
            videos,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Get videos error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/videos/:videoId', authenticateToken, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId)
            .populate('userId', 'username profileImage verified followers')
            .populate('comments.userId', 'username profileImage');

        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Increment views
        video.views += 1;
        await video.save();

        res.json({ video });
    } catch (error) {
        console.error('Get video error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Like/Unlike video
app.post('/api/videos/:videoId/like', authenticateToken, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const hasLiked = video.likes.includes(req.user.userId);

        if (hasLiked) {
            video.likes = video.likes.filter(id => id.toString() !== req.user.userId);
        } else {
            video.likes.push(req.user.userId);
            video.dislikes = video.dislikes.filter(id => id.toString() !== req.user.userId);

            // Create notification
            if (video.userId.toString() !== req.user.userId) {
                const user = await User.findById(req.user.userId);
                const notification = new Notification({
                    userId: video.userId,
                    fromUserId: req.user.userId,
                    type: 'like',
                    videoId: video._id,
                    message: `${user.username} liked your video`
                });
                await notification.save();
            }
        }

        await video.save();

        res.json({
            message: hasLiked ? 'Unliked' : 'Liked',
            likes: video.likes.length,
            hasLiked: !hasLiked
        });
    } catch (error) {
        console.error('Like video error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Comment on video
app.post('/api/videos/:videoId/comment', authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;
        const video = await Video.findById(req.params.videoId);

        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        const comment = {
            userId: req.user.userId,
            text,
            createdAt: new Date()
        };

        video.comments.push(comment);
        await video.save();

        // Create notification
        if (video.userId.toString() !== req.user.userId) {
            const user = await User.findById(req.user.userId);
            const notification = new Notification({
                userId: video.userId,
                fromUserId: req.user.userId,
                type: 'comment',
                videoId: video._id,
                message: `${user.username} commented on your video`
            });
            await notification.save();
        }

        const populatedVideo = await Video.findById(req.params.videoId)
            .populate('comments.userId', 'username profileImage');

        res.json({
            message: 'Comment added',
            comments: populatedVideo.comments
        });
    } catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete video
app.delete('/api/videos/:videoId', authenticateToken, async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId);

        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        if (video.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Delete files
        const videoPath = path.join(__dirname, video.videoUrl);
        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
        }

        if (video.thumbnailUrl) {
            const thumbnailPath = path.join(__dirname, video.thumbnailUrl);
            if (fs.existsSync(thumbnailPath)) {
                fs.unlinkSync(thumbnailPath);
            }
        }

        await Video.findByIdAndDelete(req.params.videoId);

        // Update user stats
        await User.findByIdAndUpdate(req.user.userId, {
            $inc: { 'stats.totalVideos': -1 }
        });

        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Delete video error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== POST ROUTES (Instagram-like) ====================

// Create post
app.post('/api/posts', authenticateToken, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const { caption, tags, location, type } = req.body;

        let mediaUrl = '';
        let thumbnailUrl = '';

        if (req.files) {
            if (req.files.image) {
                mediaUrl = `/uploads/images/${req.files.image[0].filename}`;
            } else if (req.files.video) {
                mediaUrl = `/uploads/videos/${req.files.video[0].filename}`;
            }
        }

        const post = new Post({
            userId: req.user.userId,
            type: type || (req.files.video ? 'video' : 'image'),
            mediaUrl,
            caption: caption || '',
            tags: tags ? JSON.parse(tags) : [],
            location: location || ''
        });

        await post.save();

        const populatedPost = await Post.findById(post._id)
            .populate('userId', 'username profileImage verified');

        res.status(201).json({
            message: 'Post created successfully',
            post: populatedPost
        });
    } catch (error) {
        console.error('Create post error details:', {
            message: error.message,
            stack: error.stack,
            body: req.body,
            userId: req.user?.userId
        });
        res.status(500).json({ 
            error: 'Server error', 
            message: error.message,
            details: 'Please check if type, tags, and media are correctly provided.'
        });
    }
});

// Get feed posts
app.get('/api/posts/feed', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const currentUser = await User.findById(req.user.userId);

        // Get posts from followed users and own posts
        const posts = await Post.find({
            $or: [
                { userId: { $in: currentUser.following } },
                { userId: req.user.userId }
            ]
        })
            .populate('userId', 'username profileImage verified')
            .populate('comments.userId', 'username profileImage')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json({ posts });
    } catch (error) {
        console.error('Get feed error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get explore posts
app.get('/api/posts/explore', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 30 } = req.query;

        const posts = await Post.find({})
            .populate('userId', 'username profileImage verified')
            .sort({ likes: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json({ posts });
    } catch (error) {
        console.error('Get explore error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Like post
app.post('/api/posts/:postId/like', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const hasLiked = post.likes.includes(req.user.userId);

        if (hasLiked) {
            post.likes = post.likes.filter(id => id.toString() !== req.user.userId);
        } else {
            post.likes.push(req.user.userId);

            // Create notification
            if (post.userId.toString() !== req.user.userId) {
                const user = await User.findById(req.user.userId);
                const notification = new Notification({
                    userId: post.userId,
                    fromUserId: req.user.userId,
                    type: 'like',
                    postId: post._id,
                    message: `${user.username} liked your post`
                });
                await notification.save();
            }
        }

        await post.save();

        res.json({
            message: hasLiked ? 'Unliked' : 'Liked',
            likes: post.likes.length,
            hasLiked: !hasLiked
        });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Comment on post
app.post('/api/posts/:postId/comment', authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = {
            userId: req.user.userId,
            text,
            createdAt: new Date()
        };

        post.comments.push(comment);
        await post.save();

        // Create notification
        if (post.userId.toString() !== req.user.userId) {
            const user = await User.findById(req.user.userId);
            const notification = new Notification({
                userId: post.userId,
                fromUserId: req.user.userId,
                type: 'comment',
                postId: post._id,
                message: `${user.username} commented on your post`
            });
            await notification.save();
        }

        const populatedPost = await Post.findById(req.params.postId)
            .populate('comments.userId', 'username profileImage');

        res.json({
            message: 'Comment added',
            comments: populatedPost.comments
        });
    } catch (error) {
        console.error('Comment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Save/Unsave post
app.post('/api/posts/:postId/save', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const hasSaved = post.saves.includes(req.user.userId);

        if (hasSaved) {
            post.saves = post.saves.filter(id => id.toString() !== req.user.userId);
        } else {
            post.saves.push(req.user.userId);
        }

        await post.save();

        res.json({
            message: hasSaved ? 'Unsaved' : 'Saved',
            hasSaved: !hasSaved
        });
    } catch (error) {
        console.error('Save post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== STORY ROUTES ====================

// Create story
app.post('/api/stories', authenticateToken, upload.single('media'), async (req, res) => {
    try {
        const { type } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'Media file is required' });
        }

        const story = new Story({
            userId: req.user.userId,
            mediaUrl: `/uploads/images/${req.file.filename}`,
            type: type || 'image'
        });

        await story.save();

        res.status(201).json({
            message: 'Story created successfully',
            story
        });
    } catch (error) {
        console.error('Create story error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get stories
app.get('/api/stories', authenticateToken, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.userId);
        const now = new Date();

        const stories = await Story.find({
            userId: { $in: [...currentUser.following, req.user.userId] },
            expiresAt: { $gt: now }
        })
            .populate('userId', 'username profileImage')
            .sort({ createdAt: -1 });

        // Group by user
        const groupedStories = stories.reduce((acc, story) => {
            const userId = story.userId._id.toString();
            if (!acc[userId]) {
                acc[userId] = {
                    user: story.userId,
                    stories: []
                };
            }
            acc[userId].stories.push(story);
            return acc;
        }, {});

        res.json({ stories: Object.values(groupedStories) });
    } catch (error) {
        console.error('Get stories error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// View story
app.post('/api/stories/:storyId/view', authenticateToken, async (req, res) => {
    try {
        const story = await Story.findById(req.params.storyId);
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        if (!story.views.includes(req.user.userId)) {
            story.views.push(req.user.userId);
            await story.save();
        }

        res.json({ message: 'Story viewed' });
    } catch (error) {
        console.error('View story error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== NOTIFICATION ROUTES ====================

// Get notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.userId })
            .populate('fromUserId', 'username profileImage')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ notifications });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Mark notification as read
app.put('/api/notifications/:notificationId/read', authenticateToken, async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.notificationId, { read: true });
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark notification error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== MESSAGE ROUTES ====================

// Send message
app.post('/api/messages', authenticateToken, async (req, res) => {
    try {
        const { receiverId, text } = req.body;

        const message = new Message({
            senderId: req.user.userId,
            receiverId,
            text
        });

        await message.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('senderId', 'username profileImage')
            .populate('receiverId', 'username profileImage');

        res.status(201).json({
            message: 'Message sent',
            data: populatedMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get conversations
app.get('/api/messages/conversations', authenticateToken, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user.userId },
                { receiverId: req.user.userId }
            ]
        })
            .populate('senderId', 'username profileImage')
            .populate('receiverId', 'username profileImage')
            .sort({ createdAt: -1 });

        // Group by conversation
        const conversations = {};
        messages.forEach(msg => {
            const otherUserId = msg.senderId._id.toString() === req.user.userId
                ? msg.receiverId._id.toString()
                : msg.senderId._id.toString();

            if (!conversations[otherUserId]) {
                conversations[otherUserId] = {
                    user: msg.senderId._id.toString() === req.user.userId ? msg.receiverId : msg.senderId,
                    lastMessage: msg,
                    unreadCount: 0
                };
            }

            if (!msg.read && msg.receiverId._id.toString() === req.user.userId) {
                conversations[otherUserId].unreadCount++;
            }
        });

        res.json({ conversations: Object.values(conversations) });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get messages with user
app.get('/api/messages/:userId', authenticateToken, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.user.userId, receiverId: req.params.userId },
                { senderId: req.params.userId, receiverId: req.user.userId }
            ]
        })
            .populate('senderId', 'username profileImage')
            .populate('receiverId', 'username profileImage')
            .sort({ createdAt: 1 });

        // Mark as read
        await Message.updateMany(
            { senderId: req.params.userId, receiverId: req.user.userId, read: false },
            { read: true }
        );

        res.json({ messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== PROJECT ROUTES (Video Editor) ====================

// Create project
app.post('/api/projects', authenticateToken, async (req, res) => {
    try {
        const { name, description } = req.body;

        const project = new Project({
            userId: req.user.userId,
            name: name || 'Untitled Project',
            description: description || ''
        });

        await project.save();

        res.status(201).json({
            message: 'Project created successfully',
            project
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user projects
app.get('/api/projects', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.user.userId })
            .sort({ lastModified: -1 });

        res.json({ projects });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single project
app.get('/api/projects/:projectId', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json({ project });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update project
app.put('/api/projects/:projectId', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const { name, description, timeline, clips, effects, transitions, audioTracks, textOverlays, settings } = req.body;

        if (name) project.name = name;
        if (description) project.description = description;
        if (timeline) project.timeline = timeline;
        if (clips) project.clips = clips;
        if (effects) project.effects = effects;
        if (transitions) project.transitions = transitions;
        if (audioTracks) project.audioTracks = audioTracks;
        if (textOverlays) project.textOverlays = textOverlays;
        if (settings) project.settings = settings;

        project.lastModified = new Date();
        await project.save();

        res.json({
            message: 'Project updated successfully',
            project
        });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete project
app.delete('/api/projects/:projectId', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (project.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await Project.findByIdAndDelete(req.params.projectId);

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== ANALYTICS ROUTES ====================

// Get dashboard stats
app.get('/api/analytics/dashboard', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const videos = await Video.find({ userId: req.user.userId });
        const posts = await Post.find({ userId: req.user.userId });

        const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
        const totalLikes = videos.reduce((sum, video) => sum + video.likes.length, 0) +
            posts.reduce((sum, post) => sum + post.likes.length, 0);

        const stats = {
            followers: user.followers.length,
            following: user.following.length,
            totalVideos: videos.length,
            totalPosts: posts.length,
            totalViews,
            totalLikes,
            verified: user.verified
        };

        res.json({ stats });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 VIDEO PLATFORM SERVER RUNNING                    ║
║                                                        ║
║   📡 Port: ${PORT}                                        ║
║   🗄️  Database: MongoDB                                ║
║   🔐 JWT Authentication: Enabled                       ║
║   📁 File Uploads: Enabled                             ║
║                                                        ║
║   API Endpoints:                                       ║
║   • POST   /api/auth/register                          ║
║   • POST   /api/auth/login                             ║
║   • GET    /api/auth/me                                ║
║   • POST   /api/videos/upload                          ║
║   • GET    /api/videos                                 ║
║   • POST   /api/posts                                  ║
║   • GET    /api/posts/feed                             ║
║   • GET    /api/posts/explore                          ║
║   • POST   /api/stories                                ║
║   • GET    /api/notifications                          ║
║   • POST   /api/messages                               ║
║   • GET    /api/projects                               ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
