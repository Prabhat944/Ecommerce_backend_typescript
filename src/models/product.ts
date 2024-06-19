import mongoose from "mongoose";


const schema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter product name"]
    },
    photo:{
        type: String,
        required: [true, "Please enter product photo"]
    },
    price:{
        type: Number,
        required: [true, "Please enter product price"]
    },
    stock:{
        type: Number,
        required: [true, "Please enter product stock"]
    },
    category:{
        type: Number,
        required: [true, "Please enter product Category"],
        trim:true
    },
},{timestamps:true});



export const Product = mongoose.model("Product",schema);