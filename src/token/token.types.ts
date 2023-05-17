export type JwtToken = {
	sub: { uuid: string; login: string }
	iat: number
}

export const isJwtTokenType = (obj: unknown): obj is JwtToken => {
    return (
		typeof obj === "object" &&
        obj !== null &&
		"iat" in obj &&
		typeof obj.iat === "number" &&
		"sub" in obj &&
		typeof obj.sub === "object" &&
        obj.sub !== null &&
        "uuid" in obj.sub && typeof obj.sub.uuid === "string" &&
		typeof obj.sub === "object" &&
        "login" in obj.sub && typeof obj.sub.login === "string"
	)
}