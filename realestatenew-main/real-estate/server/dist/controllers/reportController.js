"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportSummary = void 0;
const db_1 = __importDefault(require("../config/db"));
const getReportSummary = async (req, res) => {
    try {
        const totalProperties = await db_1.default.property.count();
        const totalEnquiries = await db_1.default.enquiry.count();
        const totalFollowUps = await db_1.default.followUp.count();
        const totalCustomers = await db_1.default.customer.count();
        const totalSiteVisits = await db_1.default.siteVisit.count();
        // Enquiry status breakdown
        const enquiryStatusGroups = await db_1.default.enquiry.groupBy({
            by: ['status'],
            _count: true
        });
        const statusMap = {};
        enquiryStatusGroups.forEach((g) => {
            statusMap[g.status] = g._count;
        });
        const newEnquiries = statusMap['New'] || 0;
        const contactedEnquiries = statusMap['Contacted'] || 0;
        const followUpEnquiries = statusMap['Follow-up'] || 0;
        const closedEnquiries = statusMap['Closed'] || 0;
        const siteVisitScheduledEnquiries = statusMap['Site Visit Scheduled'] || 0;
        const rejectedEnquiries = statusMap['Rejected'] || 0;
        // Pending follow-ups
        const pendingFollowUps = await db_1.default.followUp.count({
            where: { completed: false }
        });
        const propertiesByStatus = await db_1.default.property.groupBy({
            by: ['status'],
            _count: true
        });
        res.json({
            summary: {
                totalProperties,
                totalEnquiries,
                totalFollowUps,
                totalCustomers,
                totalSiteVisits,
                newEnquiries,
                contactedEnquiries,
                followUpEnquiries,
                closedEnquiries,
                siteVisitScheduledEnquiries,
                rejectedEnquiries,
                pendingFollowUps
            },
            propertiesByStatus
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getReportSummary = getReportSummary;
