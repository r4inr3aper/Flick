import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRouter.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import promoRouter from "./routes/promoRoute.js";
import { securityHeaders, sanitizeInput, generalLimiter } from "./middleware/security.js";

//app config
const app=express();
const port = process.env.PORT || 3000;

//middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware - temporarily disabled for debugging
// app.use(securityHeaders);
// app.use(sanitizeInput);
// app.use(generalLimiter);

// Dynamic CORS configuration
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://flick-puce.vercel.app",
    "https://flick-admin.vercel.app",
    "https://flick-admin-puce.vercel.app"
];

// Add environment-specific origins if they exist
if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}
if (process.env.ADMIN_URL) {
    allowedOrigins.push(process.env.ADMIN_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, true); // Allow all origins in production for now
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'X-Requested-With'],
    optionsSuccessStatus: 200
}))

//connectdb
connectDB();

// Request logging middleware for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
    next();
});

// Handle preflight requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

//api endpoints
app.use("/api/food",foodRouter)
app.use("/api/user",userRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use("/api/promo",promoRouter)

app.get("/",(req,res)=>{
    res.json({
        message: "Flick Food Delivery API is running!",
        status: "success",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
        cors: {
            origin: req.headers.origin || 'No origin header',
            allowedOrigins: allowedOrigins
        }
    })
})

// Test endpoint for debugging
app.get("/api/test", (req, res) => {
    res.json({
        message: "API test endpoint working",
        timestamp: new Date().toISOString(),
        origin: req.headers.origin || 'No origin',
        headers: req.headers
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong!'
            : err.message
    });
});

// Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(port, ()=>{
    console.log(`🚀 Flick API server running on port ${port}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🌐 API URL: ${process.env.NODE_ENV === 'production' ? 'https://flick-be.onrender.com' : `http://localhost:${port}`}`);
})
