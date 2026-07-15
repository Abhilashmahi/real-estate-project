"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    // 1. Clear database (cascade will handle child relations)
    await db_1.default.admin.deleteMany();
    await db_1.default.customer.deleteMany();
    await db_1.default.property.deleteMany();
    await db_1.default.enquiry.deleteMany();
    await db_1.default.followUp.deleteMany();
    await db_1.default.siteVisit.deleteMany();
    await db_1.default.wishlist.deleteMany();
    // 2. Seed Admin
    const hashedAdminPassword = await bcryptjs_1.default.hash('password', 10);
    const admin = await db_1.default.admin.create({
        data: {
            email: 'admin@example.com',
            password: hashedAdminPassword,
            name: 'Vishnu Realtor Admin'
        }
    });
    console.log('Seeded Admin: admin@example.com / password');
    // 3. Seed Customer
    const hashedCustomerPassword = await bcryptjs_1.default.hash('password', 10);
    const customer = await db_1.default.customer.create({
        data: {
            email: 'customer@example.com',
            password: hashedCustomerPassword,
            fullName: 'John Customer',
            mobile: '9876543210'
        }
    });
    console.log('Seeded Customer: customer@example.com / password');
    // 4. Seed Properties with multiple images
    const propertiesData = [
        {
            title: 'Green Valley Villa',
            description: 'Stunning 3BHK luxury villa located in the serene location of Coimbatore. Equipped with modern modular kitchen, private garden, and personal parking space.',
            type: 'Villa',
            status: 'Available',
            location: 'Coimbatore',
            price: '65', // In Lakhs
            size: '2400', // Sq.Ft
            beds: 3,
            baths: 3,
            mapLink: 'https://maps.google.com/?q=11.0168,76.9558',
            images: [
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60'
            ]
        },
        {
            title: 'Smart City Apartment',
            description: 'Modern 2BHK apartment in the heart of Coimbatore. Perfect for working professionals, offering 24/7 security, power backup, and close proximity to key IT parks.',
            type: 'Apartment',
            status: 'Available',
            location: 'Coimbatore',
            price: '45',
            size: '1200',
            beds: 2,
            baths: 2,
            mapLink: 'https://maps.google.com/?q=11.0168,76.9558',
            images: [
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60'
            ]
        },
        {
            title: 'Royal Square Plot',
            description: 'Premium villa plot for sale in prime location. Ready for immediate construction with clear documentation, wide roads, and gated community security.',
            type: 'Plot',
            status: 'Available',
            location: 'Coimbatore',
            price: '18',
            size: '1500',
            beds: 0,
            baths: 0,
            mapLink: 'https://maps.google.com/?q=11.0168,76.9558',
            images: [
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60'
            ]
        },
        {
            title: 'Elite Land Investment',
            description: 'Huge fertile land ideal for organic farming or future layout development. Scenic views and high investment appreciation potential.',
            type: 'Land',
            status: 'Available',
            location: 'Ooty',
            price: '35',
            size: '3000',
            beds: 0,
            baths: 0,
            mapLink: 'https://maps.google.com/?q=11.4102,76.6950',
            images: [
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=60'
            ]
        },
        {
            title: 'Hill View House',
            description: 'Beautiful independent residential house in peaceful hill surroundings of Ooty. Features broad windows overlooking mountain valleys.',
            type: 'House',
            status: 'Available',
            location: 'Ooty',
            price: '80',
            size: '1800',
            beds: 3,
            baths: 2,
            mapLink: 'https://maps.google.com/?q=11.4102,76.6950',
            images: [
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=60'
            ]
        }
    ];
    for (const item of propertiesData) {
        const { images, ...propData } = item;
        const property = await db_1.default.property.create({
            data: propData
        });
        // Seed images for this property
        for (const imageUrl of images) {
            await db_1.default.propertyImage.create({
                data: {
                    propertyId: property.id,
                    url: imageUrl
                }
            });
        }
    }
    console.log('Seeded properties with images successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await db_1.default.$disconnect();
});
