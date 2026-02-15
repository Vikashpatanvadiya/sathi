import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // you can type properly later
    }
  }
}
