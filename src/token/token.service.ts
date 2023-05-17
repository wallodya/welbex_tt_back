import { UserPublic } from "../types/types"
import { Response } from "express"
import jwt from "jsonwebtoken"
import * as bcrypt from "bcrypt"
import { prisma } from "../prisma"
import { JwtToken, isJwtTokenType } from "./token.types"

const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY ?? "accesss-key"
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY ?? "refresh-key"
const DAY_MS = 1000 * 60 * 60 * 24
const HOUR_MS = 60 * 60 * 1000
const JWT_ACCESS_EXP_MS = HOUR_MS * 2
const JWT_REFRESH_EXP_MS = DAY_MS * 20

const refreshTokenTimers = new Map<string, NodeJS.Timeout>()

export const REFRESH_TOKEN_NAME = "refresh-token"


export const setAccessToken = (res: Response ,user: UserPublic) => {
    const payload = {
        ...user,
        createdAt: Number(user.createdAt)
    }
    const accessToken = jwt.sign(
		{ sub: payload, iat: Date.now() },
		JWT_ACCESS_KEY,
		{ expiresIn: "2h" }
	)

    res.setHeader("authorization", accessToken)

    return
}

export const setRefreshToken = async (res: Response, user: UserPublic) => {
    const {email, createdAt, ...payload} = user
    const refreshToken = jwt.sign(
		{ sub: payload, iat: Date.now() },
		JWT_REFRESH_KEY,
		{ expiresIn: "10d" }
	)

    try {
        const hashedToken =  await bcrypt.hash(refreshToken, 5)
        const token = await prisma.token.create({
            data: {
                refresh_token: hashedToken,
                user: {
                    connect: {
                        uuid: user.uuid
                    }
                },
                createdAt: Date.now()
            },
            select: {
                user: {
                    select: {
                        uuid: true
                    }
                }
            }
        })

        setRefreshTokenTimeout(token.user.uuid, JWT_REFRESH_EXP_MS)

        res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			maxAge: JWT_REFRESH_EXP_MS,
		})
        return
    } catch (error) {
        console.log("Error while creating refresh token")
        return
    }

}

export const decodeToken = (token: string): JwtToken | null => {
    const decoded = jwt.decode(token)
    if (isJwtTokenType(decoded)) {
        return decoded
    }
    return null
}

export const validateAccessToken = (token?: string): JwtToken | null => {
    if (!token) {
        return null
    }
    const decoded = decodeToken(token)

    if (!isJwtTokenType(decoded)) {
        console.log("Not jwt type: ", decoded)
        return null
    }

    const currentTime = Date.now()
    if (decoded.iat < currentTime - JWT_ACCESS_EXP_MS) {
        console.log("outdated")
        return null
    }

    return decoded
}

export const validateRefreshToken = async (token?: string): Promise<JwtToken | null> => {
    if (!token) {
        return null
    }
    const decoded = decodeToken(token)

    if (!isJwtTokenType(decoded)) {
        console.log("Not jwt type: ", decoded)
        return null
    }

    const currentTime = Date.now()
    if (decoded.iat < currentTime - JWT_REFRESH_EXP_MS) {
        console.log("outdated")
        return null
    }

    const { uuid } = decoded.sub

    const tokenFromDB = await prisma.token.findMany({
        where: {
            user: {
                uuid
            }
        },
        select: {
            refresh_token: true
        }
    })

    if (!tokenFromDB.length) {
        console.log("token does not exist")
        return null
    }

    const isValid = tokenFromDB.some(async (data) => {
        return await bcrypt.compare(data.refresh_token, token)
    })

    return isValid ? decoded : null
}

const setRefreshTokenTimeout = (uuid: string, delay: number) => {
    const timeout = setTimeout(async () => {
        await removeRefreshToken(uuid)
    }, delay )
    refreshTokenTimers.set(uuid, timeout)
}

export const removeRefreshToken = async (uuid: string) => {
    try {
        await prisma.token.deleteMany({
            where: {
                user: {
                    uuid
                }
            }
        })
        if (refreshTokenTimers.has(uuid)) {
            const timeout = refreshTokenTimers.get(uuid)
            clearTimeout(timeout)
            refreshTokenTimers.delete(uuid)
        } else {
            console.log("could not delete token")
        }
    } catch (error) {
        console.log("Error while removing RT timeout: ", error)
    }
}