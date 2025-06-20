// Simple rate limiting implementation
const rateLimitStore = new Map();

const createRateLimit = (windowMs, max, message) => {
    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress;
        const now = Date.now();

        if (!rateLimitStore.has(key)) {
            rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
            return next();
        }

        const record = rateLimitStore.get(key);

        if (now > record.resetTime) {
            record.count = 1;
            record.resetTime = now + windowMs;
            return next();
        }

        if (record.count >= max) {
            return res.status(429).json({
                success: false,
                message: message || 'Too many requests, please try again later.'
            });
        }

        record.count++;
        next();
    };
};

// Security headers middleware - API optimized
export const securityHeaders = (req, res, next) => {
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');

    // Set basic security headers for API
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Don't set CSP for API endpoints as it can interfere with CORS
    // Only set basic security headers that don't block API functionality

    next();
};

// Rate limiting configurations - more lenient for production
export const generalLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    1000, // max requests (increased for production)
    'Too many requests from this IP, please try again later.'
);

export const authLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // max login attempts
    'Too many login attempts, please try again later.'
);

export const orderLimiter = createRateLimit(
    60 * 1000, // 1 minute
    3, // max orders
    'Too many orders placed, please wait before placing another order.'
);

// Simple input sanitization
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;

    // Remove HTML tags and dangerous characters
    return str
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
};

// Input sanitization middleware
export const sanitizeInput = (req, res, next) => {
    const sanitizeObject = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = sanitizeString(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };

    if (req.body) {
        sanitizeObject(req.body);
    }
    if (req.query) {
        sanitizeObject(req.query);
    }
    if (req.params) {
        sanitizeObject(req.params);
    }

    next();
};

// Simple validation functions
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    return password && password.length >= 6 &&
           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
};

const isValidName = (name) => {
    return name && name.length >= 2 && name.length <= 50 &&
           /^[a-zA-Z\s]+$/.test(name);
};

const isValidPrice = (price) => {
    const num = parseFloat(price);
    return !isNaN(num) && num > 0;
};

const isValidCategory = (category) => {
    const validCategories = ['salad', 'rolls', 'deserts', 'sandwich', 'cake', 'pure veg', 'pasta', 'noodles'];
    return validCategories.includes(category);
};

// Validation middleware
export const validateUserRegistration = (req, res, next) => {
    const { name, email, password } = req.body;
    const errors = [];

    if (!isValidName(name)) {
        errors.push('Name must be between 2 and 50 characters and contain only letters and spaces');
    }
    if (!isValidEmail(email)) {
        errors.push('Please provide a valid email address');
    }
    if (!isValidPassword(password)) {
        errors.push('Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    next();
};

export const validateUserLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!isValidEmail(email)) {
        errors.push('Please provide a valid email address');
    }
    if (!password || password.trim().length === 0) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    next();
};

export const validateFoodItem = (req, res, next) => {
    const { name, description, price, category } = req.body;
    const errors = [];

    if (!name || name.length < 2 || name.length > 100) {
        errors.push('Food name must be between 2 and 100 characters');
    }
    if (!description || description.length < 10 || description.length > 500) {
        errors.push('Description must be between 10 and 500 characters');
    }
    if (!isValidPrice(price)) {
        errors.push('Price must be a positive number');
    }
    if (!isValidCategory(category)) {
        errors.push('Invalid category');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    next();
};

export const validateOrder = (req, res, next) => {
    const { items, amount, address } = req.body;
    const errors = [];

    if (!Array.isArray(items) || items.length === 0) {
        errors.push('Order must contain at least one item');
    }
    if (!isValidPrice(amount)) {
        errors.push('Order amount must be positive');
    }
    if (address) {
        if (!isValidName(address.firstName)) {
            errors.push('First name must be between 2 and 50 characters');
        }
        if (!isValidName(address.lastName)) {
            errors.push('Last name must be between 2 and 50 characters');
        }
        if (!isValidEmail(address.email)) {
            errors.push('Please provide a valid email');
        }
        if (!address.street || address.street.length < 5 || address.street.length > 200) {
            errors.push('Street address must be between 5 and 200 characters');
        }
        if (!address.city || address.city.length < 2 || address.city.length > 50) {
            errors.push('City must be between 2 and 50 characters');
        }
        if (!address.zipcode || !/^\d{5}(-\d{4})?$/.test(address.zipcode)) {
            errors.push('Please provide a valid ZIP code');
        }
        if (!address.phone || !/^\+?[\d\s\-\(\)]{10,15}$/.test(address.phone)) {
            errors.push('Please provide a valid phone number');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }
    next();
};

// CORS configuration
export const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'https://your-frontend-domain.com' // Replace with your actual frontend domain
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
};

// Trust proxy for accurate IP addresses
export const trustProxy = (app) => {
    app.set('trust proxy', 1);
};
