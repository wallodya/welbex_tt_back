import { z } from "zod";

export const createAccountSchema = z.object({
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

export const signInSchema = z.object({
	login: z
		.string()
		.min(4, { message: "Login must be at least 4 letter long" })
		.max(20, { message: "Login can be at most 20 letter long" }),
	password: z
		.string()
		.min(4, { message: "Password must be at least 4 letter long" })
		.max(20, { message: "Password can be at most 20 letter long" }),
})

export type SignInSchema = z.infer<typeof signInSchema>
export type CereateAccountSchema = z.infer<typeof createAccountSchema>
