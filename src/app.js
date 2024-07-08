"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myCache = void 0;
var express_1 = require("express");
var cors_1 = require("cors");
var morgan_1 = require("morgan");
var node_cache_1 = require("node-cache");
var dotenv_1 = require("dotenv");
var features_js_1 = require("./utils/features.js");
var user_js_1 = require("./routes/user.js");
var error_js_1 = require("./middlewares/error.js");
(0, dotenv_1.config)({
    path: "./.env"
});
var port = process.env.PORT || 4000;
var mongoURI = process.env.MONGO_URI || "";
var stripeKey = process.env.STRIPE_KEY || "";
(0, features_js_1.connectDB)(mongoURI);
exports.myCache = new node_cache_1.default();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use("/api/v1/user", user_js_1.default);
app.use(error_js_1.ErrorMiddleWare);
app.get('/', function (req, res) {
    res.send("API is working fine with /api/v1");
});
app.listen(port, function () {
    console.log("server is running on http://localhost:".concat(port));
});
