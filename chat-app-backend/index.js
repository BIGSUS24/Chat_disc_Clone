import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import groupRoutes from "./routes/group.routes.js";
import messageRoutes from "./routes/message.routes.js"


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/groups",groupRoutes);
app.use("/api/v1/messages",messageRoutes);

app.get("/",(req,res)=>{
  res.send("Server is running")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// This catches every "throw new ApiError" we wrote!
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        message: message,
        errors: err.errors || []
    });
});



//connect database
mongoose
.connect(process.env.MONGODB_URI)
.then(()=>
console.log("MongoDb connected"))
.catch(err=>console.error("MongoDb Connection error",err));


