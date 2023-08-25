import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[0]; 
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
      const decoded = jwt.verify(token,'pooja'); 
    //   req.user = decoded; 
    //   res.json( (<any>req).user )
      next(); 
    } catch (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };