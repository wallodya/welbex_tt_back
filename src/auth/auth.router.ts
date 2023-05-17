import express, { Request, Response } from "express"
import { signIn, signOut, signUp } from "./auth.service"
import expressAsyncHandler from "express-async-handler"
const authRouter = express.Router()

/**
 * GET /api/v1
 * @summary Summary of sign-in
 * @return {object} 200 - success response
 */
authRouter.post("/login", signIn)

const wait: () => Promise<void> = () => {
    return new Promise<void>((resolve, reject): void => {
        setTimeout(resolve, 2000)
    })
}
const handler = async (req: Request, res: Response) => {
    console.log("1")
    await wait()
}

authRouter.post("/register", signUp)
// authRouter.get("/abc", [handler])

authRouter.delete("/sign-out", signOut)

export default authRouter