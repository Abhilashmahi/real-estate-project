"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSiteVisitStatus = exports.createSiteVisit = exports.getSiteVisits = void 0;
const db_1 = __importDefault(require("../config/db"));
const getSiteVisits = async (req, res) => {
    const role = req.user.role;
    try {
        if (role === 'admin') {
            const visits = await db_1.default.siteVisit.findMany({
                include: {
                    customer: { select: { fullName: true, email: true, mobile: true } },
                    property: true
                }
            });
            const mapped = visits.map((v) => ({
                ...v,
                customer: v.customer ? {
                    name: v.customer.fullName,
                    email: v.customer.email,
                    phone: v.customer.mobile
                } : null
            }));
            return res.json(mapped);
        }
        else {
            const customerId = req.user.id;
            const visits = await db_1.default.siteVisit.findMany({
                where: { customerId },
                include: { property: true }
            });
            return res.json(visits);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSiteVisits = getSiteVisits;
const createSiteVisit = async (req, res) => {
    const customerId = req.user.id;
    const { propertyId, visitDate } = req.body;
    try {
        const visit = await db_1.default.siteVisit.create({
            data: {
                customerId,
                propertyId: parseInt(propertyId),
                visitDate
            }
        });
        res.status(201).json(visit);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createSiteVisit = createSiteVisit;
const updateSiteVisitStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const visit = await db_1.default.siteVisit.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(visit);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateSiteVisitStatus = updateSiteVisitStatus;
