"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.options = exports.signupUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupUserSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    username: joi_1.default.string().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    confirm_password: joi_1.default.any().equal(joi_1.default.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match' })
});
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
exports.loginUserSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
});
