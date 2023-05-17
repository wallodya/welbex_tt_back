import { UserPublic } from "../types/types"
import { Response } from "express"
import jwt from "jsonwebtoken"
import * as bcrypt from "bcrypt"
import { prisma } from "../prisma"

const JWT_ACCESS_KEY = process.env.JWT_ACCESS_KEY ?? "accesss-key"
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY ?? "refresh-key"

export const REFRESH_TOKEN_NAME = "refresh-token"

export const setAccessToken = (res: Response ,user: UserPublic) => {
    const {email, createdAt, ...payload} = user
    const accessToken = jwt.sign(payload, JWT_ACCESS_KEY, { expiresIn: "2h" })

    res.setHeader("authentication", accessToken)

    return
}

export const setRefreshToken = async (res: Response, user: UserPublic) => {
    const {email, createdAt, ...payload} = user
    const refreshToken = jwt.sign(payload, JWT_REFRESH_KEY, { expiresIn: "10d"})

    try {
        const hashedToken =  await bcrypt.hash(refreshToken, 5)
        await prisma.token.create({
            data: {
                refresh_token: hashedToken,
                user: {
                    connect: {
                        uuid: user.uuid
                    }
                },
                createdAt: Date.now()
            }
        })

        const DAY_MS = 1000 * 60 * 60 * 24

        res.cookie(REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			maxAge: DAY_MS * 20,
		})
        return
    } catch (error) {
        console.log("Error while creating refresh token")
        return
    }

}

export const removeRefreshToken = async (token: string) => {

}

export const decodeAccessToken = (token: string) => {

}

export const validateAccessToken = (token: string) => {

}

export const validateRefreshToken = async (token: string) => {

}