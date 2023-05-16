import express, { json, urlencoded } from "express"
import cors from "cors"
import { loggerMiddleware } from "./app.middleware"
import { getUserMiddleware } from "../auth/auth.middleware"

const createExpressServer = () => {
    const app = express()

    app.use(cors())
    app.use(urlencoded({ extended: true }))
    app.use(json())
    app.use(loggerMiddleware)
    app.use(getUserMiddleware)

    return app
}

export default createExpressServer