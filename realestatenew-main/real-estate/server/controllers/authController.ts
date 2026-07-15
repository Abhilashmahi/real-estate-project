import { Request, Response } from 'express';
import prisma from '../config/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'estateiq_secret_key_2026';

// For Admin Login
export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Fallback login for admin compatibility
export const login = adminLogin;

// For Customer Register
export const customerRegister = async (req: Request, res: Response) => {
  const { email, password, name, phone, fullName, mobile } = req.body;
  const targetFullName = fullName || name || '';
  const targetMobile = mobile || phone || '';

  try {
    const existingEmail = await prisma.customer.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email address already registered.' });
    }
    if (targetMobile) {
      const existingPhone = await prisma.customer.findFirst({ where: { mobile: targetMobile } });
      if (existingPhone) {
        return res.status(400).json({ message: 'Mobile number already registered.' });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: { email, password: hashedPassword, fullName: targetFullName, mobile: targetMobile }
    });
    res.status(201).json({ user: { id: customer.id, name: customer.fullName, email: customer.email, role: 'customer' } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Fallback register compatibility
export const register = customerRegister;

// For Customer Login
export const customerLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: customer.id, email: customer.email, role: 'customer' }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: customer.id, name: customer.fullName, email: customer.email, phone: customer.mobile, role: 'customer' } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Customer Profile (requires authenticateToken middleware)
export const getCustomerProfile = async (req: any, res: Response) => {
  const customerId = req.user.id;
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true, fullName: true, email: true, mobile: true }
    });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.json({ id: customer.id, name: customer.fullName, email: customer.email, phone: customer.mobile });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Customer Profile and Password
export const updateCustomerProfile = async (req: any, res: Response) => {
  const customerId = req.user.id;
  const { name, phone, fullName, mobile, email, password } = req.body;
  try {
    const data: any = { 
      email,
      fullName: fullName || name,
      mobile: mobile || phone
    };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    const customer = await prisma.customer.update({
      where: { id: customerId },
      data
    });
    res.json({ message: 'Profile updated successfully.', user: { id: customer.id, name: customer.fullName, email: customer.email, phone: customer.mobile, role: 'customer' } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
