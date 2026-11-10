"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fedapayWebhook = exports.stripeWebhook = void 0;
var stripe_controller_1 = require("./stripe/stripe.controller");
Object.defineProperty(exports, "stripeWebhook", { enumerable: true, get: function () { return stripe_controller_1.stripeWebhook; } });
var fedapay_controller_1 = require("./fedapay/fedapay.controller");
Object.defineProperty(exports, "fedapayWebhook", { enumerable: true, get: function () { return fedapay_controller_1.fedapayWebhook; } });
