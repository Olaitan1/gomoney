import { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import { appSecret } from '../config/index';
import  {authPayload}  from '../interface';
import { IUser } from '../interface/user.dto';
import User  from '../model/user.model'


declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
};

export interface CustomRequest extends Request
{
  token: string | JwtPayload;
}
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .send("Token missing. Please include a valid token.");
    }

    const decoded  = jwt.verify(token, appSecret)as JwtPayload;
    (req as CustomRequest).token = decoded;
    
       const user = await User.findById(decoded.id) 

      if (!user) {
        throw new Error(`not Authorized`);
      }
     
      req.user = user;

    next();
  } catch (error) {
    res.status(401).send("Not Authorized, Please authenticate");
  }
};

export const Admin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
      console.log(req.user)
    next();
  } else {
    return res.status(403).json({ message: 'Not authorized to perform this action' });
  }
};