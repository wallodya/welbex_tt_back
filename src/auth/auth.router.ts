import express from "express"
import { signIn, signOut, signUp } from "./auth.service"
const authRouter = express.Router()

/**
 * GET /api/v1
 * @summary Summary of sign-in
 * @return {object} 200 - success response
 */
authRouter.post("/sign-in", signIn)

authRouter.post("/sign-up", signUp)

authRouter.delete("/sign-out", signOut)

export default authRouter