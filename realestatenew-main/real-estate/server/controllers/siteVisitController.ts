import { Response } from 'express';
import prisma from '../config/db';

export const getSiteVisits = async (req: any, res: Response) => {
  const role = req.user.role;
  try {
    if (role === 'admin') {
      const visits = await prisma.siteVisit.findMany({
        include: {
          customer: { select: { fullName: true, email: true, mobile: true } },
          property: true
        }
      });
      const mapped = visits.map((v: any) => ({
        ...v,
        customer: v.customer ? {
          name: v.customer.fullName,
          email: v.customer.email,
          phone: v.customer.mobile
        } : null
      }));
      return res.json(mapped);
    } else {
      const customerId = req.user.id;
      const visits = await prisma.siteVisit.findMany({
        where: { customerId },
        include: { property: true }
      });
      return res.json(visits);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createSiteVisit = async (req: any, res: Response) => {
  const customerId = req.user.id;
  const { propertyId, visitDate } = req.body;
  try {
    const visit = await prisma.siteVisit.create({
      data: {
        customerId,
        propertyId: parseInt(propertyId),
        visitDate
      }
    });
    res.status(201).json(visit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSiteVisitStatus = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const visit = await prisma.siteVisit.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(visit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
