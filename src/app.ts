import express from 'express';
import session from 'express-session';
import path from 'path';
import { promises as fs } from 'fs';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = 3000;

// Ensure data directory exists
async function ensureDataDirExists() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch (error) {
    // Directory doesn't exist, create it
    await fs.mkdir(dataDir, { recursive: true });
    
    // Create empty users.json file
    await fs.writeFile(path.join(dataDir, 'users.json'), '[]');
  }
}

// Initialize middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configure session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Use authentication routes
app.use('/', authRoutes);

// Start the server
async function startServer() {
  try {
    await ensureDataDirExists();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();