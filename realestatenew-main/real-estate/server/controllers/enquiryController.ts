import { Response } from 'express';
import prisma from '../config/db';

export const getEnquiries = async (req: any, res: Response) => {
  const role = req.user.role;
  try {
    if (role === 'admin') {
      const enquiries = await prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { fullName: true, email: true, mobile: true } },
          property: { select: { id: true, title: true, location: true, type: true, price: true, status: true } }
        }
      });
      const mapped = enquiries.map((e: any) => ({
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
    } else {
      const customerId = req.user.id;
      const enquiries = await prisma.enquiry.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        include: { property: true }
      });
      res.json(enquiries);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEnquiry = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: parseInt(id) },
      include: {
        customer: { select: { fullName: true, email: true, mobile: true } },
        property: { select: { id: true, title: true, location: true, type: true, price: true, status: true } }
      }
    });
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found.' });
    // Flatten customer data to top-level for consistent frontend access
    const result = {
      ...enquiry,
      name: enquiry.customer?.fullName || enquiry.name || '',
      email: enquiry.customer?.email || enquiry.email || '',
      phone: enquiry.customer?.mobile || enquiry.phone || '',
      propertyLocation: enquiry.property?.location || '',
    };
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createEnquiry = async (req: any, res: Response) => {
  try {
    const { name, email, phone, mobile, property, type, notes, message, remarks, status, propertyId } = req.body;
    const customerId = req.user.role === 'customer' ? req.user.id : null;

    // Fetch customer details from DB if logged in as customer
    // JWT only has { id, email, role } — no name or phone
    let customerName = name || '';
    let customerEmail = email || req.user.email || '';
    let customerPhone = phone || mobile || '';

    if (customerId) {
      const customerRecord = await prisma.customer.findUnique({
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
      const p = await prisma.property.findUnique({ where: { id: propId } });
      if (p) {
        propTitle = p.title;
      }
    }

    const enquiry = await prisma.enquiry.create({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEnquiryStatus = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const enquiry = await prisma.enquiry.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    if (status === 'Follow-up') {
      const existing = await prisma.followUp.findUnique({
        where: { enquiryId: parseInt(id) }
      });
      if (!existing) {
        await prisma.followUp.create({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEnquiry = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const { name, email, phone, mobile, property, type, notes, message, remarks, status } = req.body;
    const enquiry = await prisma.enquiry.update({
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
      const existing = await prisma.followUp.findUnique({
        where: { enquiryId: parseInt(id) }
      });
      if (!existing) {
        await prisma.followUp.create({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEnquiry = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.enquiry.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Enquiry deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
