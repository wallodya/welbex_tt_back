import cors from "cors"
import express, { json, urlencoded } from "express"
import expressJSDocSwagger from "express-jsdoc-swagger"
import { getUserMiddleware } from "../auth/auth.middleware"
import { loggerMiddleware } from "./app.middleware"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"

const swaggerOptions = {
	info: {
		version: "1.0.0",
		title: "Welbex forum api docs",
		description: "Test task for Weblex interview",

	},
	baseDir: "../",
	filesPattern: "./**/*.ts",
	swaggerUIPath: "/api-docs",
	exposeSwaggerUI: true,
	exposeApiDocs: false,
	// apiDocsPath: "/v3/api-docs",
	notRequiredAsNullable: false,
	multiple: true,
}

const createExpressServer = () => {
	const app = express()

	app.use(
		cors({
			credentials: true,
			origin: ["http://localhost:5173"],
			methods: ["GET", "POST", "PATCH", "DELETE"],
			exposedHeaders: ["authorization", "set-cookie"],
			allowedHeaders: ["authorization", "set-cookie", "content-type"],
		})
	)
    app.use("/media", express.static("public/uploads"))
	app.use(urlencoded({ extended: true }))
	app.use(json())
    app.use(cookieParser())
    app.use(bodyParser.json())
    app.use(fileUpload({
        parseNested: true,
    }))

    expressJSDocSwagger(app)(swaggerOptions);

	app.use(loggerMiddleware)

	return app
}

export default createExpressServer
