import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.js';
import reportsRoutes from './routes/reports.js';
import programsRoutes from './routes/programs.js';
import blogsRoutes from './routes/blogs.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware - CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://bug-bounty-management-system.onrender.com', 'http://localhost:5173', 'http://localhost:3000']
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Bug Bounty Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      reports: '/api/reports',
      programs: '/api/programs',
      blogs: '/api/blogs',
      health: '/api/health'
    },
    status: 'Server is running'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/programs', programsRoutes);
app.use('/api/blogs', blogsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Connect to MongoDB with fallback
const connectDB = async () => {
  const mongoURIs = [
    process.env.MONGODB_URI,
    'mongodb://localhost:27017/bug-bounty-management'
  ];

  for (const uri of mongoURIs) {
    if (!uri) continue;
    
    try {
      console.log(`🔄 Attempting to connect to MongoDB...`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log(`✅ Connected to MongoDB: ${uri.includes('localhost') ? 'Local' : 'Atlas'}`);
      
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
      return;
    } catch (error) {
      console.error(`❌ Failed to connect to ${uri.includes('localhost') ? 'Local MongoDB' : 'Atlas'}:`, error.message);
      if (uri === mongoURIs[mongoURIs.length - 1]) {
        console.error('💥 All MongoDB connection attempts failed');
        process.exit(1);
      }
    }
  }
};

connectDB();

export default app;

