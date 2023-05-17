import { Message, Person } from "@prisma/client";
import { postSchema } from "../forum/post.schema";
import { z } from "zod";

export type UserPublic = Omit<Person, "password" | "user_id">
export type MessagePublic = Omit<Message, "message_id" | "userId">
export type PostPublic = z.infer<typeof postSchema>
