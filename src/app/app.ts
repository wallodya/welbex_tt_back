import cors from "cors"
import express, { json, urlencoded } from "express"
import expressJSDocSwagger from "express-jsdoc-swagger"
import { getUserMiddleware } from "../auth/auth.middleware"
import { loggerMiddleware } from "./app.middleware"
import cookieParser from "cookie-parser"

const swaggerOptions = {
	info: {
		version: "1.0.0",
		title: "Weblex forum api docs",
		desceiption: "Description",
		license: {
			name: "MIT",
		},
	},
	security: {
		BasicAuth: {
			type: "http",
			scheme: "basic",
		},
	},
	baseDir: "../",
	filesPattern: "./**/*.ts",
	swaggerUIPath: "/api-docs",
	exposeSwaggerUI: true,
	exposeApiDocs: false,
	apiDocsPath: "/v3/api-docs",
	notRequiredAsNullable: false,
	multiple: true,
}

const createExpressServer = () => {
	const app = express()

	app.use(
		cors({
			credentials: true,
			origin: ["http://localhost:5173"],
			methods: ["GET", "POST", "PUT", "DELETE"],
			exposedHeaders: ["authorization", "set-cookie"],
		})
	)
	app.use(urlencoded({ extended: true }))
	app.use(json())
    app.use(cookieParser())

    expressJSDocSwagger(app)(swaggerOptions);

	app.use(loggerMiddleware)

	return app
}

export default createExpressServer
