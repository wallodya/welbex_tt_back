import { Request, Response } from "express"

export const getMessages = (req: Request, res: Response) => {
    res.send("all messages")
}

export const getMessagesAmount = (req: Request, res: Response) => {
    res.send("message count")
}

export const createMessage = (req: Request, res: Response) => {
    res.send("new message")
}
export const updateMessage = (req: Request, res: Response) => {
    res.send("update message")
}
export const deleteMessage = (req: Request, res: Response) => {
    res.send("delete message")
}
