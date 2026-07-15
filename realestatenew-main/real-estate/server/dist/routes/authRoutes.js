"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Admin Auth
router.post('/login', authController_1.login); // Compatibility fallback
router.post('/admin/login', authController_1.adminLogin);
// Customer Auth
router.post('/customer/login', authController_1.customerLogin);
router.post('/customer/register', authController_1.customerRegister);
router.get('/customer/profile', auth_1.authenticateToken, authController_1.getCustomerProfile);
router.put('/customer/profile', auth_1.authenticateToken, authController_1.updateCustomerProfile);
exports.default = router;
