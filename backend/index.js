import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRouter.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";

//app config
const app=express();
const port=3000;

//middlewares
app.use(express.json());
app.use(cors())

//connectdb
connectDB();

//api endpoints
app.use("/api/food",foodRouter)
app.use("/api/user",userRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart",cartRouter)

app.get("/",(req,res)=>{
    res.send("api working")
})

app.listen(port, ()=>{
    console.log(`server running successfully at port ${port}`)
})
