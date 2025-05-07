import { Request, Response, NextFunction, RequestHandler } from 'express';

export const isAuthenticated: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/');
  }
}; 