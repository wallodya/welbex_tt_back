import createExpressServer from "./app"
import * as dotenv from "dotenv"

dotenv.config()

const HOST = process.env.HOST
const PORT = process.env.PORT

const app = createExpressServer()

app.get("/", (req, res) => {
    console.log("request: ", req.body)
    res.send("it works")
})

app.listen(PORT, () => {
    console.log(`App listens on ${HOST}:${PORT}`)
})