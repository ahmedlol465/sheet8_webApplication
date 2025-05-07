import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = express.Router();

// Home page route
router.get('/', AuthController.getHome);

// Register page routes
router.get('/register', AuthController.getRegister);
router.post('/register', AuthController.register);

// Login page routes
router.get('/login', AuthController.getLogin);
router.post('/login', AuthController.login);

// Profile page route
router.get('/profile', isAuthenticated, AuthController.getProfile);

// Logout route
router.get('/logout', AuthController.logout);

// API route to get current user data
router.get('/api/user', AuthController.getCurrentUser);

export default router;