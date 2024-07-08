"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
var mongoose_1 = require("mongoose");
var connectDB = function (uri) {
    mongoose_1.default.connect(uri, {
        dbName: "Ecommerce"
    }).then(function (c) { return console.log("DB Connected to ".concat(c.connection.host)); })
        .catch(function (e) { return console.log(e); });
};
exports.connectDB = connectDB;
