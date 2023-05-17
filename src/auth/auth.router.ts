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

authRouter.post("/register", signUp)

authRouter.delete("/sign-out", signOut)

export default authRouter