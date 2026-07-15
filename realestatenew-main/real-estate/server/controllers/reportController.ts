import { Request, Response } from 'express';
import prisma from '../config/db';

export const getReportSummary = async (req: Request, res: Response) => {
  try {
    const totalProperties = await prisma.property.count();
    const totalEnquiries = await prisma.enquiry.count();
    const totalFollowUps = await prisma.followUp.count();
    const totalCustomers = await prisma.customer.count();
    const totalSiteVisits = await prisma.siteVisit.count();

    // Enquiry status breakdown
    const enquiryStatusGroups = await prisma.enquiry.groupBy({
      by: ['status'],
      _count: true
    });

    const statusMap: Record<string, number> = {};
    enquiryStatusGroups.forEach((g: any) => {
      statusMap[g.status] = g._count;
    });

    const newEnquiries = statusMap['New'] || 0;
    const contactedEnquiries = statusMap['Contacted'] || 0;
    const followUpEnquiries = statusMap['Follow-up'] || 0;
    const closedEnquiries = statusMap['Closed'] || 0;
    const siteVisitScheduledEnquiries = statusMap['Site Visit Scheduled'] || 0;
    const rejectedEnquiries = statusMap['Rejected'] || 0;

    // Pending follow-ups
    const pendingFollowUps = await prisma.followUp.count({
      where: { completed: false }
    });
    
    const propertiesByStatus = await prisma.property.groupBy({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
