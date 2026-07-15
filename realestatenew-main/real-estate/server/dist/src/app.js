"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const propertyRoutes_1 = __importDefault(require("../routes/propertyRoutes"));
const enquiryRoutes_1 = __importDefault(require("../routes/enquiryRoutes"));
const followupRoutes_1 = __importDefault(require("../routes/followupRoutes"));
const reportRoutes_1 = __importDefault(require("../routes/reportRoutes"));
const wishlistRoutes_1 = __importDefault(require("../routes/wishlistRoutes"));
const siteVisitRoutes_1 = __importDefault(require("../routes/siteVisitRoutes"));
const uploadRoutes_1 = __importDefault(require("../routes/uploadRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static uploads folder
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/properties', propertyRoutes_1.default);
app.use('/api/enquiries', enquiryRoutes_1.default);
app.use('/api/followups', followupRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
app.use('/api/wishlist', wishlistRoutes_1.default);
app.use('/api/site-visits', siteVisitRoutes_1.default);
app.use('/api', uploadRoutes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
exports.default = app;
