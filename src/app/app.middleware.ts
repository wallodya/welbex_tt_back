import { NextFunction, Request, Response } from "express";

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`>>> Request for: "${req.path}". Method: ${req.method}`)
    if (req.method === "POST") {
        console.log("> Request body : ")
        console.log(req.body)
    }
    next()
}