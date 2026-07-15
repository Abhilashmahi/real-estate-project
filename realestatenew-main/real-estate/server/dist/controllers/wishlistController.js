"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const db_1 = __importDefault(require("../config/db"));
const getWishlist = async (req, res) => {
    const customerId = req.user.id;
    try {
        const list = await db_1.default.wishlist.findMany({
            where: { customerId },
            include: {
                property: {
                    include: { images: true }
                }
            }
        });
        res.json(list.map(item => item.property));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getWishlist = getWishlist;
const addToWishlist = async (req, res) => {
    const customerId = req.user.id;
    const { propertyId } = req.body;
    try {
        const item = await db_1.default.wishlist.create({
            data: {
                customerId,
                propertyId: parseInt(propertyId)
            }
        });
        res.status(201).json(item);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (req, res) => {
    const customerId = req.user.id;
    const { propertyId } = req.params;
    try {
        await db_1.default.wishlist.deleteMany({
            where: {
                customerId,
                propertyId: parseInt(propertyId)
            }
        });
        res.json({ message: 'Removed from wishlist successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.removeFromWishlist = removeFromWishlist;
