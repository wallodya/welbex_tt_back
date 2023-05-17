import { z } from "zod";

export const userSchema = z.object({
	login: z
		.string()
		.min(4, { message: "Login must be at least 4 letter long" })
		.max(20, { message: "Login can be at most 20 letter long" }),
	password: z
		.string()
		.min(4, { message: "Password must be at least 4 letter long" })
		.max(20, { message: "Password can be at most 20 letter long" }),
	email: z.string().email({ message: "Email is not valid" }),
})