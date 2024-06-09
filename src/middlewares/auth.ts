import {User} from '../models/user.js';
import ErrorHandler from '../utils/utility-class.js';
import {TryCatch} from "./error.js";


//Middle ware to make sure only admin is allowed
export const adminOnly = TryCatch(async(req,res,next)=>{
    const {id} = req.query;

    if(!id) return next(new ErrorHandler("Login karo pahle",401));

    const user = await User.findById(id);

    if(user?.role !== "admin" )
        return next(new ErrorHandler("Bhag ja yaha se teri aukat se bahar hai",403));

    next();
});