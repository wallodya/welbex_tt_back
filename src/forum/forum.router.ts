import express from "express"
import { createMessage, deleteMessage, getMessages, getMessagesAmount, updateMessage } from "./forum.service"
import { authGuard } from "../auth/auth.guard"

const forumRouter = express.Router()

forumRouter.get("/", getMessages)

forumRouter.get("/amount", getMessagesAmount)


forumRouter.post("/", [authGuard, createMessage])

forumRouter.put("/", [authGuard, updateMessage])

forumRouter.delete("/", [authGuard, deleteMessage])

export default forumRouter
