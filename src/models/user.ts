import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
   _id: string;
   name: string;
   email: string;
   photo: string;
   role: "admin" | "user";
   gender: "male" | "female" | "others";
   dob: Date;
   createdAt:Date;
   updatedAt:Date;
   age:number;
};

const schema = new mongoose.Schema({
    _id:{
        type: String,
        required:[true, "Please enter ID"]
    },
    name:{
        type: String,
        required:[true, "Please enter Name"]
    },
    email:{
        type: String,
        required:[true, "Please enter Email"],
        unique:[true, "Email already exist"],
        validate: validator.default.isEmail,
    },
    photo:{
        type: String,
        required:[true, "Please add photo"]
    },
    role:{
        type: String,
        enum:["admin","user"],
        default:"user"
    },
    gender:{
        type: String,
        enum:["male","female","others"],
        required:[true,"Please enter gender"],
    },
    dob:{
        type:String,
        // required:[true, "Please enter Date of birth"],
    },
},
{
    timestamps:true
}
);

// schema.virtual('age').get(function(){
//     const today = new Date();
//     const dob:Date = this.dob;
//     let age = today.getFullYear() -  dob.getFullYear();

//     if(today.getMonth() < dob.getMonth() || (
//        today.getMonth() === dob.getMonth() &&
//        today.getDate() < dob.getDate()
//     )){
//         age --;
//     }
//     return age;
// })

export const User = mongoose.model<IUser>("User", schema);