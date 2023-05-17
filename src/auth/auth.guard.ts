import { NextFunction, Request, Response } from "express";
import { validateAccessToken, validateRefreshToken } from "../token/token.service";

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization

    console.log("auth guard")

    if (accessToken && validateAccessToken(accessToken)) {
        console.log("AT valid")
        next()
        return
    }

    const refreshToken = req.headers.cookie?.replace("refresh-token=", "")

    if (!refreshToken) {
        console.log("RT not set")
        res.statusCode = 403
        res.json("Not authorised")
        return
    }
    
    const isRefreshTokenValid = await validateRefreshToken(refreshToken)
    
    if (!isRefreshTokenValid) {
        console.log("RT not valid")
        res.statusCode = 403
        res.json("Not authorised")
        return
    }

    next()
}
