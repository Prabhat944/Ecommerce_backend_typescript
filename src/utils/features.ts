import mongoose from "mongoose";
import { myCache } from "../app.js";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { Product } from "../models/product.js";

export const connectDB = (uri: string) => {
    mongoose.connect(uri,{
        dbName:"Ecommerce"
    }).then((c)=>console.log(`DB Connected to ${c.connection.host}`))
    .catch((e)=>console.log(e));
};

export const invalidateCache = ({
    product,
    order,
    admin,
    userId,
    orderId,
    productId
}:InvalidateCacheProps) => {
    if(product){
        const productKeys:string[] = ["latest-products","categories","all-products"];
        if(typeof productId === "object")productId.forEach(e=>productKeys.push(`product-${e}`));

        myCache.del(productKeys);
    }

    if(order){
        const orderKeys:string[] = ["all-orders",`my-orders-${userId}`, `order-${orderId}`];
        myCache.del(orderKeys);
    }

    if(admin){
        myCache.del([
            "admin-stats","admin-pie-charts","admin-bar-charts","admin-line-charts"
        ])
    }
};

