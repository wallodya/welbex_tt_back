import { NextFunction, Request, Response } from "express";
import { decodeToken, setAccessToken, setRefreshToken, validateAccessToken, validateRefreshToken } from "../token/token.service";
import { JwtToken, isJwtTokenType } from "../token/token.types";
import { prisma } from "../prisma";
import { UserPublic, UserRequest } from "../types/types";

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization

    console.log("auth guard")

    const decodedAccessToken = validateAccessToken(accessToken)
    if (accessToken && decodedAccessToken) {
        console.log("AT valid")
        const user = await attachUser(decodedAccessToken, req, res)
        if (!user) {
            return
        }
        setAccessToken(res, user)
        setRefreshToken(res, user)
        next()
        return
    }

    const refreshToken = req.headers.cookie?.replace("refresh-token=", "")
    console.log("cookie")
    console.log( req.headers["set-cookie"])
    if (!refreshToken) {
        res.setHeader("authorization", "")
        console.log("RT not set")
        res.statusCode = 403
        res.json("Not authorised")
        next()
        return
    }
    
    const decodedRefreshToken = await validateRefreshToken(refreshToken)
    
    if (!decodedRefreshToken) {
        console.log("RT not valid")
        res.setHeader("authorization", "")
        res.statusCode = 403
        res.json("Not authorised")
        next()
        return
    }

    const user = await attachUser(decodedRefreshToken, req, res)
    if (!user) {
        next()
        return
    }

    setAccessToken(res, user)
    setRefreshToken(res, user)

    next()
}

const attachUser = async (token: JwtToken, req: Request, res: Response): Promise<UserPublic | null> => {
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
            return null
        }
    
        (req as UserRequest).user = user
        return user
    } catch (error) {
        console.log("Error while attaching user: ", error)
        return null
    }
}