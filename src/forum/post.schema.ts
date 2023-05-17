import { z } from "zod";

export const postSchema = z.object({
    text: z.string().optional(),
    mediaURL: z.string().optional(),
    authorId: z.string().uuid()
})

export const updatePostSchema = z.object({
    text: z.string().optional(),
    mediaURL: z.string().optional(),
    authorId: z.string().uuid(),
    postId: z.string().uuid()
})