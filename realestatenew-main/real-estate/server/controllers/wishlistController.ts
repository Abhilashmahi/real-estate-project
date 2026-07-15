import { Response } from 'express';
import prisma from '../config/db';

export const getWishlist = async (req: any, res: Response) => {
  const customerId = req.user.id;
  try {
    const list = await prisma.wishlist.findMany({
      where: { customerId },
      include: {
        property: {
          include: { images: true }
        }
      }
    });
    res.json(list.map(item => item.property));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const addToWishlist = async (req: any, res: Response) => {
  const customerId = req.user.id;
  const { propertyId } = req.body;
  try {
    const item = await prisma.wishlist.create({
      data: {
        customerId,
        propertyId: parseInt(propertyId)
      }
    });
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromWishlist = async (req: any, res: Response) => {
  const customerId = req.user.id;
  const { propertyId } = req.params;
  try {
    await prisma.wishlist.deleteMany({
      where: {
        customerId,
        propertyId: parseInt(propertyId)
      }
    });
    res.json({ message: 'Removed from wishlist successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
