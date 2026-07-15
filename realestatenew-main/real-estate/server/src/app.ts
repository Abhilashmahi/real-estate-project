import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from '../routes/authRoutes';
import propertyRoutes from '../routes/propertyRoutes';
import enquiryRoutes from '../routes/enquiryRoutes';
import followupRoutes from '../routes/followupRoutes';
import reportRoutes from '../routes/reportRoutes';
import wishlistRoutes from '../routes/wishlistRoutes';
import siteVisitRoutes from '../routes/siteVisitRoutes';
import uploadRoutes from '../routes/uploadRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Serve static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/followups', followupRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/site-visits', siteVisitRoutes);
app.use('/api', uploadRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
