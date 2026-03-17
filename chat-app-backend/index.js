import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
  res.send("Server is running")
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//connect database
mongoose
.connect(process.env.MONGODB_URI)
.then(()=>
console.log("MongoDb connected"))
.catch(err=>console.error("MongoDb Connection error",err));


