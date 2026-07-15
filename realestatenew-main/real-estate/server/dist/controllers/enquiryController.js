"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnquiry = exports.updateEnquiry = exports.updateEnquiryStatus = exports.createEnquiry = exports.getEnquiry = exports.getEnquiries = void 0;
const db_1 = __importDefault(require("../config/db"));
const getEnquiries = async (req, res) => {
    const role = req.user.role;
    try {
        if (role === 'admin') {
            const enquiries = await db_1.default.enquiry.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    customer: { select: { fullName: true, email: true, mobile: true } },
                    property: { select: { id: true, title: true, location: true, type: true, price: true, status: true } }
                }
            });
            const mapped = enquiries.map((e) => ({
                ...e,
                // Prefer customer table data over enquiry's own fields (which may be empty for customer-submitted enquiries)
                name: e.customer?.fullName || e.name || '',
                email: e.customer?.email || e.email || '',
                phone: e.customer?.mobile || e.phone || '',
                propertyLocation: e.property?.location || '',
                customer: e.customer ? {
                    name: e.customer.fullName,
                    email: e.customer.email,
                    phone: e.customer.mobile
                } : null
            }));
            res.json(mapped);
        }
        else {
            const customerId = req.user.id;
            const enquiries = await db_1.default.enquiry.findMany({
                where: { customerId },
                orderBy: { createdAt: 'desc' },
                include: { property: true }
            });
            res.json(enquiries);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getEnquiries = getEnquiries;
const getEnquiry = async (req, res) => {
    const { id } = req.params;
    try {
        const enquiry = await db_1.default.enquiry.findUnique({
            where: { id: parseInt(id) },
            include: {
                customer: { select: { fullName: true, email: true, mobile: true } },
                property: { select: { id: true, title: true, location: true, type: true, price: true, status: true } }
            }
        });
        if (!enquiry)
            return res.status(404).json({ message: 'Enquiry not found.' });
        // Flatten customer data to top-level for consistent frontend access
        const result = {
            ...enquiry,
            name: enquiry.customer?.fullName || enquiry.name || '',
            email: enquiry.customer?.email || enquiry.email || '',
            phone: enquiry.customer?.mobile || enquiry.phone || '',
            propertyLocation: enquiry.property?.location || '',
        };
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getEnquiry = getEnquiry;
const createEnquiry = async (req, res) => {
    try {
        const { name, email, phone, mobile, property, type, notes, message, remarks, status, propertyId } = req.body;
        const customerId = req.user.role === 'customer' ? req.user.id : null;
        // Fetch customer details from DB if logged in as customer
        // JWT only has { id, email, role } — no name or phone
        let customerName = name || '';
        let customerEmail = email || req.user.email || '';
        let customerPhone = phone || mobile || '';
        if (customerId) {
            const customerRecord = await db_1.default.customer.findUnique({
                where: { id: customerId },
                select: { fullName: true, email: true, mobile: true }
            });
            if (customerRecord) {
                customerName = customerName || customerRecord.fullName || '';
                customerEmail = customerEmail || customerRecord.email || '';
                customerPhone = customerPhone || customerRecord.mobile || '';
            }
        }
        let propId = propertyId ? parseInt(propertyId) : null;
        let propTitle = property || type || 'General Inquiry';
        if (propId) {
            const p = await db_1.default.property.findUnique({ where: { id: propId } });
            if (p) {
                propTitle = p.title;
            }
        }
        const enquiry = await db_1.default.enquiry.create({
            data: {
                customerId,
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                propertyId: propId,
                propertyName: propTitle,
                notes: notes || message || remarks || '',
                status: status || 'New'
            }
        });
        res.status(201).json(enquiry);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createEnquiry = createEnquiry;
const updateEnquiryStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const enquiry = await db_1.default.enquiry.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        if (status === 'Follow-up') {
            const existing = await db_1.default.followUp.findUnique({
                where: { enquiryId: parseInt(id) }
            });
            if (!existing) {
                await db_1.default.followUp.create({
                    data: {
                        enquiryId: parseInt(id),
                        customerId: enquiry.customerId,
                        propertyId: enquiry.propertyId,
                        notes: enquiry.notes || '',
                        status: 'Pending',
                        completed: false
                    }
                });
            }
        }
        res.json(enquiry);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateEnquiryStatus = updateEnquiryStatus;
const updateEnquiry = async (req, res) => {
    const { id } = req.params;
    try {
        const { name, email, phone, mobile, property, type, notes, message, remarks, status } = req.body;
        const enquiry = await db_1.default.enquiry.update({
            where: { id: parseInt(id) },
            data: {
                name,
                email,
                phone: phone || mobile,
                propertyName: property || type,
                notes: notes || message || remarks,
                status
            }
        });
        if (status === 'Follow-up') {
            const existing = await db_1.default.followUp.findUnique({
                where: { enquiryId: parseInt(id) }
            });
            if (!existing) {
                await db_1.default.followUp.create({
                    data: {
                        enquiryId: parseInt(id),
                        customerId: enquiry.customerId,
                        propertyId: enquiry.propertyId,
                        notes: enquiry.notes || '',
                        status: 'Pending',
                        completed: false
                    }
                });
            }
        }
        res.json(enquiry);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateEnquiry = updateEnquiry;
const deleteEnquiry = async (req, res) => {
    const { id } = req.params;
    try {
        await db_1.default.enquiry.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Enquiry deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteEnquiry = deleteEnquiry;
