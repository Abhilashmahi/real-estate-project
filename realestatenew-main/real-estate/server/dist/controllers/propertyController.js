"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getProperty = exports.getProperties = void 0;
const db_1 = __importDefault(require("../config/db"));
const getProperties = async (req, res) => {
    const { location, type, maxPrice } = req.query;
    try {
        const properties = await db_1.default.property.findMany({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProperties = getProperties;
const getProperty = async (req, res) => {
    const { id } = req.params;
    try {
        const property = await db_1.default.property.findUnique({
            where: { id: parseInt(id) },
            include: { images: true }
        });
        if (!property)
            return res.status(404).json({ message: 'Property not found.' });
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProperty = getProperty;
const createProperty = async (req, res) => {
    try {
        const { name, title, location, price, type, area, size, beds, baths, description, status, mapLink, images } = req.body;
        // Parse images array
        let imageArray = [];
        if (images) {
            imageArray = Array.isArray(images) ? images : [images];
        }
        const property = await db_1.default.property.create({
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createProperty = createProperty;
const updateProperty = async (req, res) => {
    const { id } = req.params;
    try {
        const { name, title, location, price, type, area, size, beds, baths, description, status, mapLink, images } = req.body;
        const propId = parseInt(id);
        const property = await db_1.default.property.update({
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
            await db_1.default.propertyImage.deleteMany({ where: { propertyId: propId } });
            await db_1.default.property.update({
                where: { id: propId },
                data: {
                    images: {
                        create: images.map(url => ({ url }))
                    }
                }
            });
        }
        res.json(property);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateProperty = updateProperty;
const deleteProperty = async (req, res) => {
    const { id } = req.params;
    try {
        await db_1.default.property.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Property deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteProperty = deleteProperty;
