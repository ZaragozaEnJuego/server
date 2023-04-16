import { Request, Response, NextFunction  } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


function verifyToken(token: string, secret: string): jwt.JwtPayload | undefined {
    try {
      const decoded = jwt.verify(token, secret);
      return decoded as JwtPayload;
    } catch (err) {
      return undefined;
    }
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    const secret = 'cat';
  
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }
  
    const payload = verifyToken(token, secret);
  
    if (!payload) {
      return res.status(401).json({ message: 'Token invalid' });
    }
  
    // Guardar el payload en la solicitud para que se pueda acceder en la ruta protegida
    req.body.user = payload;
  
    next();
  }

  export default authMiddleware;