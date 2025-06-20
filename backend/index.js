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

// Security middleware
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(generalLimiter);

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://flick-puce.vercel.app/",
    ],
    credentials: true
}))

//connectdb
connectDB();

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
        timestamp: new Date().toISOString()
    })
})

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
