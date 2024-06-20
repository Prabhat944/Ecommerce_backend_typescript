import express from "express";
import cors from 'cors';
import morgan from "morgan";
import NodeCache from "node-cache";
import {config} from 'dotenv';
import {connectDB} from "./utils/features.js"
import userRoute from './routes/user.js';
import userProduct from "./routes/products.js";
import userOrder from "./routes/order.js";
import { ErrorMiddleWare } from "./middlewares/error.js";

config({
    path:"./.env"
})
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
// const stripeKey = process.env.STRIPE_KEY || "";

connectDB(mongoURI);
export const myCache = new NodeCache();
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/user",userRoute);
app.use("/api/v1/product",userProduct);
app.use("/api/v1/order",userOrder);
app.use(ErrorMiddleWare);
app.get('/',(req,res)=>{
    res.send("API is working fine with /api/v1");
});


app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})