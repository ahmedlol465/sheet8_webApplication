import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { User } from '../models/User';

const router = express.Router();
const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper function to read users from the JSON file
async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
}

// Helper function to write users to the JSON file
async function writeUsers(users: User[]): Promise<void> {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

// Middleware to check if the user is authenticated
const isAuthenticated: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/');
  }
};

// Home page route
router.get('/', ((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
}) as RequestHandler);

// Register page routes
router.get('/register', ((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
}) as RequestHandler);

router.post('/register', (async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).send('All fields are required');
    }
    
    // Read existing users
    const users = await readUsers();
    
    // Check if username or email already exists
    const userExists = users.some(
      user => user.username === username || user.email === email
    );
    
    if (userExists) {
      return res.status(400).send('Username or email already exists');
    }
    
    // Create new user and add to the list
    const newUser = new User(username, email, password);
    users.push(newUser);
    
    // Save updated users list
    await writeUsers(users);
    
    // Redirect to login page
    res.redirect('/login');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal server error');
  }
}) as RequestHandler);

// Login page routes
router.get('/login', ((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
}) as RequestHandler);

router.post('/login', (async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    
    // Read users
    const users = await readUsers();
    
    // Find user with matching email and password
    const user = users.find(
      user => user.email === email && user.password === password
    );
    
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    
    // Set session data
    req.session.isAuthenticated = true;
    req.session.user = {
      username: user.username,
      email: user.email
    };
    
    // Redirect to home page
    res.redirect('/');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
}) as RequestHandler);

// Profile page route
router.get('/profile', isAuthenticated, ((req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/profile.html'));
}) as RequestHandler);

// Logout route
router.get('/logout', ((req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
}) as RequestHandler);

// API route to get current user data
router.get('/api/user', ((req: Request, res: Response) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
}) as RequestHandler);

export default router;