"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getMyOrders = getMyOrders;
exports.getAllOrders = getAllOrders;
exports.updateOrderStatus = updateOrderStatus;
const orderService = __importStar(require("../services/order.service"));
async function createOrder(req, res, next) {
    try {
        const { address, phone } = req.body;
        const order = await orderService.createOrder(req.userId, address, phone);
        res.status(201).json(order);
    }
    catch (err) {
        next(err);
    }
}
async function getMyOrders(req, res, next) {
    try {
        const orders = await orderService.getUserOrders(req.userId);
        res.json(orders);
    }
    catch (err) {
        next(err);
    }
}
async function getAllOrders(req, res, next) {
    try {
        const { page, limit } = req.query;
        const result = await orderService.getAllOrders(Number(page) || 1, Number(limit) || 20);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
async function updateOrderStatus(req, res, next) {
    try {
        const order = await orderService.updateOrderStatus(Number(req.params.id), req.body.status);
        res.json(order);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=order.controller.js.map