import express, { json, urlencoded } from "express"
import cors from "cors"

const createExpressServer = () => {
    const app = express()

    app.use(cors())
    app.use(urlencoded({ extended: true }))
    app.use(json())

    return app
}

export default createExpressServer