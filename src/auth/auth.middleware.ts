import { NextFunction, Request, Response } from "express";

export const getUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        next()
    }
    try {
        
    } catch (error) {
        
    }
    next()
}