"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFollowup = exports.updateFollowup = exports.toggleFollowup = exports.createFollowup = exports.getFollowups = void 0;
const db_1 = __importDefault(require("../config/db"));
const getFollowups = async (req, res) => {
    try {
        const followups = await db_1.default.followUp.findMany({
            include: {
                enquiry: {
                    include: {
                        customer: true,
                        property: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        const mapped = followups.map((f) => ({
            id: f.id,
            enquiryId: f.enquiryId,
            customerId: f.customerId || f.enquiry?.customerId,
            propertyId: f.propertyId || f.enquiry?.propertyId,
            client: f.enquiry?.customer?.fullName || f.enquiry?.name || 'Guest Lead',
            phone: f.enquiry?.customer?.mobile || f.enquiry?.phone || 'N/A',
            email: f.enquiry?.customer?.email || f.enquiry?.email || 'N/A',
            property: f.enquiry?.property?.title || f.enquiry?.propertyName || 'General Layout',
            date: f.nextFollowupDate || 'Not Scheduled',
            followupDate: f.followupDate ? new Date(f.followupDate).toLocaleDateString('en-IN') : 'N/A',
            notes: f.notes || f.enquiry?.notes || '',
            completed: f.completed,
            status: f.status,
            type: f.enquiry?.status || 'Follow-up', // Maps current status from Enquiry table
            createdAt: f.createdAt
        }));
        res.json(mapped);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getFollowups = getFollowups;
const createFollowup = async (req, res) => {
    try {
        const followup = await db_1.default.followUp.create({ data: req.body });
        res.status(201).json(followup);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createFollowup = createFollowup;
const toggleFollowup = async (req, res) => {
    const { id } = req.params;
    try {
        const check = await db_1.default.followUp.findUnique({ where: { id: parseInt(id) } });
        if (!check)
            return res.status(404).json({ message: 'Follow up not found.' });
        const followup = await db_1.default.followUp.update({
            where: { id: parseInt(id) },
            data: { completed: !check.completed }
        });
        res.json(followup);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.toggleFollowup = toggleFollowup;
const updateFollowup = async (req, res) => {
    const { id } = req.params;
    const { notes, nextFollowupDate, status, completed, parentStatus } = req.body;
    try {
        const check = await db_1.default.followUp.findUnique({ where: { id: parseInt(id) } });
        if (!check)
            return res.status(404).json({ message: 'Follow up not found.' });
        const followup = await db_1.default.followUp.update({
            where: { id: parseInt(id) },
            data: {
                notes,
                nextFollowupDate,
                status: status || check.status,
                completed: completed !== undefined ? completed : check.completed
            }
        });
        // Optionally update enquiry status if parentStatus is provided
        if (parentStatus && check.enquiryId) {
            await db_1.default.enquiry.update({
                where: { id: check.enquiryId },
                data: { status: parentStatus }
            });
        }
        res.json(followup);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateFollowup = updateFollowup;
const deleteFollowup = async (req, res) => {
    const { id } = req.params;
    try {
        const check = await db_1.default.followUp.findUnique({ where: { id: parseInt(id) } });
        if (!check)
            return res.status(404).json({ message: 'Follow up not found.' });
        await db_1.default.followUp.delete({ where: { id: parseInt(id) } });
        // Also set parent enquiry status back to contacted or new if deleted from follow-ups list
        if (check.enquiryId) {
            await db_1.default.enquiry.update({
                where: { id: check.enquiryId },
                data: { status: 'Contacted' }
            });
        }
        res.json({ message: 'Follow up deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteFollowup = deleteFollowup;
