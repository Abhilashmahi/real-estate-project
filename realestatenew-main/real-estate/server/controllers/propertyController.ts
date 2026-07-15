import { Request, Response } from 'express';
import prisma from '../config/db';

export const getProperties = async (req: Request, res: Response) => {
  const { location, type, maxPrice } = req.query;
  try {
    const properties = await prisma.property.findMany({
      include: { images: true }
    });

    let filtered = properties;
    if (location) {
      filtered = filtered.filter(p => p.location.toLowerCase().includes(String(location).toLowerCase()));
    }
    if (type && type !== 'All') {
      filtered = filtered.filter(p => p.type.toLowerCase() === String(type).toLowerCase());
    }
    if (maxPrice) {
      const maxVal = parseFloat(String(maxPrice));
      if (!isNaN(maxVal)) {
        filtered = filtered.filter(p => parseFloat(p.price) <= maxVal);
      }
    }

    res.json(filtered);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({ 
      where: { id: parseInt(id) },
      include: { images: true }
    });
    if (!property) return res.status(404).json({ message: 'Property not found.' });
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createProperty = async (req: Request, res: Response) => {
  try {
    const { name, title, location, price, type, area, size, beds, baths, description, status, mapLink, images } = req.body;
    
    // Parse images array
    let imageArray: string[] = [];
    if (images) {
      imageArray = Array.isArray(images) ? images : [images];
    }

    const property = await prisma.property.create({
      data: {
        title: title || name || '',
        location: location || '',
        price: String(price || ''),
        type: type || 'Villa',
        size: String(size || area || ''),
        beds: typeof beds === 'number' ? beds : parseInt(beds) || 0,
        baths: typeof baths === 'number' ? baths : parseInt(baths) || 0,
        description: description || null,
        status: status || 'Available',
        mapLink: mapLink || null,
        images: {
          create: imageArray.map(url => ({ url }))
        }
      },
      include: { images: true }
    });
    res.status(201).json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { name, title, location, price, type, area, size, beds, baths, description, status, mapLink, images } = req.body;
    
    const propId = parseInt(id);

    const property = await prisma.property.update({
      where: { id: propId },
      data: {
        title: title || name,
        location: location,
        price: price !== undefined ? String(price) : undefined,
        type: type,
        size: size !== undefined ? String(size) : (area !== undefined ? String(area) : undefined),
        beds: beds !== undefined ? (typeof beds === 'number' ? beds : parseInt(beds) || 0) : undefined,
        baths: baths !== undefined ? (typeof baths === 'number' ? baths : parseInt(baths) || 0) : undefined,
        description: description,
        status: status,
        mapLink: mapLink
      }
    });

    if (images && Array.isArray(images)) {
      // Re-seed images
      await prisma.propertyImage.deleteMany({ where: { propertyId: propId } });
      await prisma.property.update({
        where: { id: propId },
        data: {
          images: {
            create: images.map(url => ({ url }))
          }
        }
      });
    }

    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.property.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Property deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
