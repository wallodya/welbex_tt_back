import { NextFunction, Request, Response } from "express";
import { decodeToken, validateAccessToken, validateRefreshToken } from "../token/token.service";
import { JwtToken, isJwtTokenType } from "../token/token.types";
import { prisma } from "../prisma";
import { UserRequest } from "../types/types";

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization

    console.log("auth guard")

    const decodedAccessToken = validateAccessToken(accessToken)
    if (accessToken && decodedAccessToken) {
        console.log("AT valid")
        const isUserAttached = await attachUser(decodedAccessToken, req, res)
        if (!isUserAttached) {
            return
        }
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
    
    const decodedRefreshToken = await validateRefreshToken(refreshToken)
    
    if (!decodedRefreshToken) {
        console.log("RT not valid")
        res.statusCode = 403
        res.json("Not authorised")
        return
    }

    await attachUser(decodedRefreshToken, req, res)

    next()
}

const attachUser = async (token: JwtToken, req: Request, res: Response): Promise<boolean> => {
    try {        
        const { uuid } = token.sub
        const user = await prisma.person.findUnique({
            where: {
                uuid
            }
        })
        
        if (!user) {        
            console.log("Token owner not found")
            res.statusCode = 403
            res.json("Not authorised")
            return false
        }
    
        (req as UserRequest).user = user
        return true
    } catch (error) {
        console.log("Error while attaching user: ", error)
        return false
    }
}