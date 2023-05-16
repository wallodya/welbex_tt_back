import { Message, Person } from "@prisma/client";

export type UserPublic = Exclude<Person, "user_id" | "createdAt" | "password">
export type MessagePublic = Exclude<Message, "message_id" | "userId">