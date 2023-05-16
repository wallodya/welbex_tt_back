import { Request, Response } from "express";

export const signIn = (req: Request, res: Response) => {
    res.send("sign-in")
}

export const signUp = (req: Request, res: Response) => {
    res.send("sign-up")
}

export const signOut = (req: Request, res: Response) => {
    res.send("sign-out")
    
}