import { Request } from "express"
import { TryCatch } from "../middlewares/error.js"
import { Product } from "../models/product.js"
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { rm } from "fs";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
import {faker} from "@faker-js/faker"


export const getLatestproject = TryCatch(async(req:Request,res,next)=>{
    let products;
    if(myCache.has("latest-products"))
        products = JSON.parse(myCache.get("latest-products") as string);
    else{
        products = await Product.find({}).sort({createdAt:-1}).limit(5);
        myCache.set("latest-products",JSON.stringify(products));
    }

    return res.status(200).json({
        success:true,
        products
    })
});

export const getAllCategories = TryCatch(async(req:Request,res,next)=>{
    let categories;

    if(myCache.has("categories")){
        categories = JSON.parse(myCache.get("categories") as string);
    }else{
        categories = await Product.distinct("category");
        myCache.set("categories",JSON.stringify(categories));
    }

    return res.status(200).json({
        success:true,
        categories
    })
});

export const getAdminProducts = TryCatch(async(req:Request,res,next)=>{
    let products;

    if(myCache.has("all-products"))
        products = JSON.parse(myCache.get("all-products") as string);
    else{
        products = await Product.find({});
        myCache.set("all-products", JSON.stringify(products));
    }
    return res.status(200).json({
        success:true,
        products
    })
});

export const getSingleProduct = TryCatch(async(req:Request,res,next)=>{
    let product;

    const id = req.params.id;
    if(myCache.has(`product-${id}`))
        product = JSON.parse(myCache.get(`product-${id}`) as string);
    else{
        product = await Product.findById(id);
        if(!product) return next(new ErrorHandler("Producr not found", 404));
        myCache.set(`product-${id}`,JSON.stringify(product));
    }

    return res.status(200).json({
        success:true,
        product
    });
});

export const newProduct = TryCatch(async(req:Request<{}, {}, NewProductRequestBody>,res,next)=>{
    const {name, price, category, stock} = req.body;
    const photo = req.file;
    if(!photo) return next(new ErrorHandler("Attach product photo",400))
    if(!name || !price || !category || !stock){
        rm(photo.path,()=>{
            console.log("deleted");
        })
        return next(new ErrorHandler("Please enter all fields",400));
    }

    const product = await Product.create({
        name,price,photo:photo.path,category:category.toLowerCase(),stock
    })
    invalidateCache({admin:true,product:true});
    res.status(200).json({
        success:true,
        message:"Product created successfully",
        product
    })
});

export const updateProduct = TryCatch(async(req:Request,res,next)=>{
    const {id} = req.params;
    const {name, price, category, stock} = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if(!product)return next(new ErrorHandler("Product not found",400));
    if(photo){
        rm(product.photo!,()=>{
            console.log("product image deleted")
        })
        product.photo = photo.path;
    }

    if(name) product.name = name;
    if(price) product.price = price;
    if(category) product.category = category;
    if(stock) product.stock = stock;

    product.save();

    invalidateCache({admin:true,product:true,productId:String(product.id)});

    return res.status(200).json({
        success:true,
        message:"Product updated successfully",
        product
    })
});

export const deleteProduct = TryCatch(async(req:Request,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product)return next(new ErrorHandler("Product not found",400));
    
    rm(product.photo!,()=>{
        console.log("Product photo deleted")
    });

    await product.deleteOne();

    invalidateCache({admin:true,product:true,productId:String(product.id)});

    return res.status(200).json({
        success:true,
        message:"Product deleted successfully"
    })


});

export const getAllProducts = TryCatch(async(req:Request<{},{},{}, SearchRequestQuery>,res,next)=>{
    const {search, sort, category, price} = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery:BaseQuery = {};

    if(search)baseQuery.name = {$regex:search,$options:"i"};
    if(price)baseQuery.price = {$lte: Number(price)};
    if(category)baseQuery.category = category;

    const productPromise = Product.find(baseQuery)
       .sort(sort && {price:sort === "asc" ? 1 : -1})
       .limit(limit)
       .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
        productPromise,
        Product.find(baseQuery),
    ])

    const totalPage = Math.ceil(filteredOnlyProduct.length/limit);

    return res.status(200).json({
        success:true,
        products,
        totalPage,
    })
});


//////////////////////////////////////////////////////////////////////////////////////////////////////
export const createRandomProduct = TryCatch(async(req,res,next)=>{
    const {count} = req.body;

    const products = await generateRandomProducts(count);
    res.status(201).json({
        success:true,
        products
    })
});

const generateRandomProducts = async (count: number = 10) => {
  const products = [];

  for (let i = 0; i < count; i++) {
    const product = {
      name: faker.commerce.productName(),
      photo: "uploads\\5ba9bd91-b89c-40c2-bb8a-66703408f986.png",
      price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
      stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
      category: faker.commerce.department(),
      createdAt: new Date(faker.date.past()),
      updatedAt: new Date(faker.date.recent()),
      __v: 0,
    };

    products.push(product);
  }

  const allNewList = await Product.create(products);

  console.log({ succecss: true });
  return allNewList;
};

const deleteRandomsProducts = async (count: number = 10) => {
  const products = await Product.find({}).skip(2);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    await product.deleteOne();
  }

  console.log({ succecss: true });
};
