import { NextFunction, Request, Response } from "express";
import { userSchema } from "./user.schema";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt"
import { prisma } from "../prisma";
import { setAccessToken } from "../token/token.service";
import { setRefreshToken } from "../token/token.service";

export const signIn = async (req: Request, res: Response) => {
    res.send("sign-in")
}

export const signUp = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const userData = userSchema.safeParse(req.body)
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

export const signOut = (req: Request, res: Response) => {
    return res.send("sign-out")
}