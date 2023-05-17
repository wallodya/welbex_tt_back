import { Message, Person } from "@prisma/client";
import { postSchema } from "../forum/post.schema";
import { z } from "zod";
import { Request } from "express";

export type UserPublic = Omit<Person, "password" | "user_id">
export type MessagePublic = Omit<Message, "message_id" | "userId">
export type PostPublic = z.infer<typeof postSchema>
export type UserRequest = Request & {
    user: Person
}
