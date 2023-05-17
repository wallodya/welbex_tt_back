import { NextFunction, Request, Response } from "express";
import { createAccountSchema, signInSchema } from "./user.schema";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt"
import { prisma } from "../prisma";
import { REFRESH_TOKEN_NAME, decodeToken, removeRefreshToken, setAccessToken } from "../token/token.service";
import { setRefreshToken } from "../token/token.service";

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {        
        const userData = signInSchema.safeParse(req.body)
        if (!userData.success) {
            res.statusCode = 400
            res.json({ message: "User object is not valid"})
            return
        }
    
        const {
            data: { login, password },
        } = userData
    
        
        const user = await prisma.person.findFirst({
            where: {
                login,
            }
        })

        if (!user) {
            res.statusCode = 400
            res.json({ message: "Incorrect login" })
            return
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            res.statusCode = 400
            res.json({ message: "Wrong password"})
            return
        }

        const {password: _, user_id, ...userPublic} = user
    
        setAccessToken(res, userPublic)
        await setRefreshToken(res, userPublic)


        res.json({ ...userPublic, createdAt: Number(user.createdAt) })
        return
    } catch (error) {
        next(error)
    }
}

export const signUp = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const userData = createAccountSchema.safeParse(req.body)
        if (!userData.success) {
            res.statusCode = 400
            res.json({ message: "User object is not valid"})
            return
        }

        const { data: user } = userData
        
        const isLoginTaken = !!(await prisma.person.findFirst({
            where: {
                login: user.login
            }
        }))

        if (isLoginTaken) {
            res.statusCode = 409 
            res.json({ message: "Login already taken" })
            return
        }

        const isEmailTaken = !!(await prisma.person.findFirst({
            where: {
                email: user.email
            }
        }))


		if (isEmailTaken) {
			res.statusCode = 409
			res.json({ message: "Email already taken" })
            return 
		}

        const uuid = randomUUID()
        const hashedPassword = await bcrypt.hash(user.password, 5)
        
        const {user_id, password, ...newUser} = await prisma.person.create({
            data: {
                ...user,
                uuid,
                password: hashedPassword,
                createdAt: Date.now()
            }
        })

        setAccessToken(res, newUser)
        await setRefreshToken(res, newUser)

        res.json({ ...newUser, createdAt: Number(newUser.createdAt) })
        return
    } catch (error) {
        next(error)
    }
}

export const signOut = async (req: Request, res: Response) => {
    const refreshToken = req.headers.cookie?.replace("refresh-token=", "")

    res.setHeader("authorization", "")
    res.cookie(REFRESH_TOKEN_NAME, "")
    if (refreshToken) {
        const decodedRefreshToken = decodeToken(refreshToken)
        if (decodedRefreshToken) {
            const { uuid } = decodedRefreshToken.sub
            await removeRefreshToken(uuid)
        }
    }
    res.sendStatus(200)
}