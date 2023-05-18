import express, { Request, Response } from "express"
import { signIn, signOut, signUp } from "./auth.service"
import expressAsyncHandler from "express-async-handler"
const authRouter = express.Router()

/**
 * User public
 * @typedef {object} UserPublic
 * @property {string} uuid - User's UUID
 * @property {string} email - User's login
 * @property {string} login - User's login
 * @property {integer} createdAt - Timestamp when user was created - int64
 */

/**
 * SignInBody
 * @typedef {object} SignInBody
 * @property {string} login - User's login
 * @property {string} password - User's password
 */

/**
 * SignUpBody
 * @typedef {object} SignUpBody
 * @property {string} email - Email of the  new user
 * @property {string} login - Login of the new user
 * @property {string} password - Password of the new user
 */


/**
 * POST /auth/login
 * @tags Authentication
 * @summary Post request for logging into existing account
 * @param {SignInBody} request.body.required - Login and password of the user - application/json
 * @return {UserPublic} 200 - success response - application/json
 * @return 400 - Bad request response - application/json
 * @example request - Example request payload
 * {
 *   "login": "User1",
 *   "password": "1234"
 * }
 * @example response - 200 - Example success response
 * {
 *   "uuid": "dc02515f-c39f-472f-8f4a-407f9d152edd",
 *   "email": "User1@test.com",
 *   "login": "User1",
 *   "createdAt": 1684325861462
 * }
 * @example response - 400 - Error response if req.body is invalid
 * {
 *   "message": "User object is not valid"
 * }
 * @example response - 400 - Error response if login does not exists
 * {
 *   "message": "Incorrect login"
 * }
 * @example response - 400 - Error response if password is incorrect
 * {
 *   "message": "Wrong password"
 * }
 */ 
authRouter.post("/login", signIn)

/**
 * POST /auth/register
 * @tags Authentication
 * @summary Post request for creating new account
 * @param {SignUpBody} request.body.required - Login, password and email of the new user - application/json
 * @return {UserPublic} 200 - success response - application/json
 * @return 400 - Bad request response - application/json
 * @return 409 - Conflict response - application/json
 * @example request - Example request payload
 * {
 *   "login": "User1",
 *   "email": "User1@test.com",
 *   "password": "1234"
 * }
 * @example response - 200 - Example success response
 * {
 *   "uuid": "dc02515f-c39f-472f-8f4a-407f9d152edd",
 *   "email": "User1@test.com",
 *   "login": "User1",
 *   "createdAt": 1684325861462
 * }
 * @example response - 400 - Error response if req.body is invalid
 * {
 *   "message": "User object is not valid"
 * }
 * @example response - 409 - Error response if login does not exists
 * {
 *   "message": "Login already taken"
 * }
 * @example response - 409 - Error response if password is incorrect
 * {
 *   "message": "Email already taken"
 * }
 */
authRouter.post("/register", signUp)

/**
 * DELETE /auth/sign-out
 * @tags Authentication
 * @summary Endpoint for signing out of current account
 * @return 200 - success response
 */
authRouter.delete("/sign-out", signOut)

export default authRouter
