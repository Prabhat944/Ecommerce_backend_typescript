"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryCatch = exports.ErrorMiddleWare = void 0;
var ErrorMiddleWare = function (err, red, res, next) {
    err.message || (err.message = "Internal server error");
    err.statusCode || (err.statusCode = 500);
    if (err.name === 'CastError')
        err.message = "Invalid ID";
    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
exports.ErrorMiddleWare = ErrorMiddleWare;
var TryCatch = function (func) { return function (req, res, next) {
    return Promise.resolve(func(req, res, next)).catch(next);
}; };
exports.TryCatch = TryCatch;
