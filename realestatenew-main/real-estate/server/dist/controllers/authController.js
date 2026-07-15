"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerProfile = exports.getCustomerProfile = exports.customerLogin = exports.register = exports.customerRegister = exports.login = exports.adminLogin = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'estateiq_secret_key_2026';
// For Admin Login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await db_1.default.admin.findUnique({ where: { email } });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' } });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.adminLogin = adminLogin;
// Fallback login for admin compatibility
exports.login = exports.adminLogin;
// For Customer Register
const customerRegister = async (req, res) => {
    const { email, password, name, phone, fullName, mobile } = req.body;
    const targetFullName = fullName || name || '';
    const targetMobile = mobile || phone || '';
    try {
        const existingEmail = await db_1.default.customer.findUnique({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email address already registered.' });
        }
        if (targetMobile) {
            const existingPhone = await db_1.default.customer.findFirst({ where: { mobile: targetMobile } });
            if (existingPhone) {
                return res.status(400).json({ message: 'Mobile number already registered.' });
            }
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const customer = await db_1.default.customer.create({
            data: { email, password: hashedPassword, fullName: targetFullName, mobile: targetMobile }
        });
        res.status(201).json({ user: { id: customer.id, name: customer.fullName, email: customer.email, role: 'customer' } });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.customerRegister = customerRegister;
// Fallback register compatibility
exports.register = exports.customerRegister;
// For Customer Login
const customerLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const customer = await db_1.default.customer.findUnique({ where: { email } });
        if (!customer) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, customer.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: customer.id, email: customer.email, role: 'customer' }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, user: { id: customer.id, name: customer.fullName, email: customer.email, phone: customer.mobile, role: 'customer' } });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.customerLogin = customerLogin;
// Get Customer Profile (requires authenticateToken middleware)
const getCustomerProfile = async (req, res) => {
    const customerId = req.user.id;
    try {
        const customer = await db_1.default.customer.findUnique({
            where: { id: customerId },
            select: { id: true, fullName: true, email: true, mobile: true }
        });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }
        res.json({ id: customer.id, name: customer.fullName, email: customer.email, phone: customer.mobile });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCustomerProfile = getCustomerProfile;
// Update Customer Profile and Password
const updateCustomerProfile = async (req, res) => {
    const customerId = req.user.id;
    const { name, phone, fullName, mobile, email, password } = req.body;
    try {
        const data = {
            email,
            fullName: fullName || name,
            mobile: mobile || phone
        };
        if (password) {
            data.password = await bcryptjs_1.default.hash(password, 10);
        }
        const customer = await db_1.default.customer.update({
            where: { id: customerId },
            data
        });
        res.json({ message: 'Profile updated successfully.', user: { id: customer.id, name: customer.fullName, email: customer.email, phone: customer.mobile, role: 'customer' } });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateCustomerProfile = updateCustomerProfile;
