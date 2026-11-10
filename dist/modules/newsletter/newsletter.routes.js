"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const subscribe_controller_1 = require("./subscribe/subscribe.controller");
const unsubscribe_controller_1 = require("./unsubscribe/unsubscribe.controller");
const newsletterRouter = (0, express_1.Router)();
const newsletterLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { responseCode: '98', responseMessage: 'Trop de tentatives, réessayez plus tard.' },
});
newsletterRouter.post('/subscribe', newsletterLimiter, subscribe_controller_1.subscribe);
newsletterRouter.post('/unsubscribe', unsubscribe_controller_1.unsubscribe);
exports.default = newsletterRouter;
