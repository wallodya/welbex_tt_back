import createExpressServer from "./app/app"
import * as dotenv from "dotenv"
import forumRouter from "./forum"
import authRouter from "./auth"
import { Request, Response } from "express"

dotenv.config()

const HOST = process.env.HOST
const PORT = process.env.PORT

export const app = createExpressServer()

app.get("/", (req: Request, res: Response) => {
    res.sendStatus(200)
})

app.use("/forum", forumRouter)
app.use("/auth", authRouter)

app.listen(PORT, () => {
    console.log(`App listens on ${HOST}:${PORT}`)
})