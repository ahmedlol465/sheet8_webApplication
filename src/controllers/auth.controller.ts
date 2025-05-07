import { Request, Response, RequestHandler } from 'express';
import path from 'path';
import { UserService } from '../services/user.service';

export class AuthController {
  static getHome: RequestHandler = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  };

  static getRegister: RequestHandler = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
  };

  static getLogin: RequestHandler = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
  };

  static getProfile: RequestHandler = (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/profile.html'));
  };

  static register: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        res.status(400).send('All fields are required');
        return;
      }
      
      await UserService.createUser(username, email, password);
      res.redirect('/login');
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send('Internal server error');
    }
  };

  static login: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).send('Email and password are required');
        return;
      }
      
      const user = await UserService.findUserByCredentials(email, password);
      
      if (!user) {
        res.status(401).send('Invalid email or password');
        return;
      }
      
      req.session.isAuthenticated = true;
      req.session.user = {
        username: user.username,
        email: user.email
      };
      
      res.redirect('/');
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal server error');
    }
  };

  static logout: RequestHandler = (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/');
    });
  };

  static getCurrentUser: RequestHandler = (req: Request, res: Response) => {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  };
} 