import { NextFunction, Request, Response } from "express"
import { prisma } from "../prisma"
import { UserRequest } from "../types/types"
import { postSchema, updatePostSchema } from "./post.schema"
import { randomUUID } from "crypto"
import { string } from "zod"

const ITEMS_PER_PAGE = 20

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let page = Number(req.query.page)

        if (isNaN(page)) {
            page = 0
        }
        
        const skip = page * ITEMS_PER_PAGE
        const take = ITEMS_PER_PAGE

        const posts = await prisma.message.findMany({
            skip,
            take,
            orderBy: {
                createdAt: "desc"
            },
            select: {
                uniqueMessageId: true,
                text: true,
                mediaURL: true,
                createdAt: true,
                author: {
                    select: {
                        uuid: true,
                        login: true
                    }
                }
            }
        })
        console.log(posts)
        res.json(
			posts.map(post => ({
				...post,
				createdAt: Number(post.createdAt),
			}))
		)
    } catch (error) {
        next(error)
    }
}

export const getMessagesAmount = async (req: Request, res: Response) => {
    const messagesAmount = await prisma.message.count()
    res.send({ messagesAmount })
}

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {        
        const postBody = postSchema.safeParse(req.body)
        const user = (req as UserRequest).user
        if (!postBody.success) {
            res.statusCode = 400
            res.json("Post body is invalid")
            return
        }
        
        if (user.uuid !== postBody.data.authorId) {        
            res.statusCode = 400
            res.json("You are not the author")
            return
        }
    
        const postId = randomUUID()
        const post = await prisma.message.create({
            data: {
                author: {
                    connect: {
                        uuid: user.uuid
                    },
                },
                uniqueMessageId: postId,
                text: postBody.data.text,
                mediaURL: postBody.data.mediaURL,
                createdAt: Date.now()
            },
            select: {
                uniqueMessageId: true,
                text: true,
                mediaURL: true,
                createdAt: true,
                author: {
                    select: {
                        uuid: true,
                        login: true
                    }
                }
            }
        })
    
        res.json({...post, createdAt: Number(post.createdAt)})
    } catch (error) {
        next(error)
    }
}
export const updateMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {       
        const postBody = updatePostSchema.safeParse(req.body)
        const user = (req as UserRequest).user
        if (!postBody.success) {
            res.statusCode = 400
            res.json("Post body is invalid")
            return
        }
        
        if (user.uuid !== postBody.data.authorId) {        
            res.statusCode = 400
            res.json("You are not the author")
            return
        }
    
        const post = await prisma.message.update({
            where: {
                uniqueMessageId: postBody.data.postId
            },
            data: {
                text: postBody.data.text,
                mediaURL: postBody.data.mediaURL,
            },
            select: {
                uniqueMessageId: true,
                text: true,
                mediaURL: true,
                createdAt: true,
                author: {
                    select: {
                        uuid: true,
                        login: true
                    }
                }
            }
        })
    
        res.json({...post, createdAt: Number(post.createdAt)})
    } catch (error) {
        next(error)
    }
}

export const deleteMessage = async (req: Request, res: Response, next:NextFunction) => {
    try {        
        const postId = req.query.postid
        if (!postId || typeof postId !== "string") {
            res.statusCode = 400
            res.json({message: "Invalid post id"})
            return
        }
    
        const post = await prisma.message.findUnique({
            where: {
                uniqueMessageId: postId
            },
            select: {
                author: {
                    select: {
                        uuid: true,
                        login: true
                    }
                }
            }
        })
    
        if (!post) {
            res.statusCode = 400
            res.json({message: "Post does not exists"})
            return
        }
        
        const user = (req as UserRequest).user
        
        if (post.author.uuid !== user.uuid) {
            res.statusCode = 403
            res.json({message: "You are not the author"})
            return
        }

        const deletedPost = await prisma.message.delete({
            where: {
                uniqueMessageId: postId
            },
            select: {
                uniqueMessageId: true,
                text: true,
                mediaURL: true,
                createdAt: true,
                author: {
                    select: {
                        uuid: true
                    }
                }
            }
        })
    
        res.send({...deletedPost, createdAt: Number(deletedPost.createdAt)})
    } catch (error) {
        next(error)
    }
}
