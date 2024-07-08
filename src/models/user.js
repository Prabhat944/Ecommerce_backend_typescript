"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = require("mongoose");
var validator_1 = require("validator");
;
var schema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: [true, "Please enter ID"]
    },
    name: {
        type: String,
        required: [true, "Please enter Name"]
    },
    email: {
        type: String,
        required: [true, "Please enter Email"],
        unique: [true, "Email already exist"],
        validate: validator_1.default.default.isEmail,
    },
    photo: {
        type: String,
        required: [true, "Please add photo"]
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
        required: [true, "Please enter gender"],
    },
    dob: {
        type: String,
        // required:[true, "Please enter Date of birth"],
    },
}, {
    timestamps: true
});
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
exports.User = mongoose_1.default.model("User", schema);
