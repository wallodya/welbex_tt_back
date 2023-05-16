import express from "express"
import { createMessage, deleteMessage, getMessages, getMessagesAmount, updateMessage } from "./forum.service"

const forumRouter = express.Router()

forumRouter.get("/", getMessages)

forumRouter.get("/amount", getMessagesAmount)

forumRouter.post("/", createMessage)

forumRouter.put("/", updateMessage)

forumRouter.delete("/", deleteMessage)

export default forumRouter
