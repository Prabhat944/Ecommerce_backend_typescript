import express from "express";
import cors from 'cors';
import morgan from "morgan";
import NodeCache from "node-cache";
import {config} from 'dotenv';
import {connectDB} from "./utils/features.js"
import userRoute from './routes/user.js';
import userProduct from "./routes/products.js";
import userOrder from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js"
import { ErrorMiddleWare } from "./middlewares/error.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

config({
    path:"./.env"
})
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
// const stripeKey = process.env.STRIPE_KEY || "";

connectDB(mongoURI);
export const myCache = new NodeCache();
const app = express();

// Serve static files from the 'uploads' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));
console.log("fil",__filename)
console.log("dir",__dirname)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/user",userRoute);
app.use("/api/v1/product",userProduct);
app.use("/api/v1/order",userOrder);
app.use("/api/v1/payment",paymentRoute);
app.use("/api/v1/dashboard",dashboardRoute);
app.use(ErrorMiddleWare);
app.get('/',(req,res)=>{
    res.send("API is working fine with /api/v1");
});


app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})