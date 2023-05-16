import express, { json, urlencoded } from "express"
import cors from "cors"
import { loggerMiddleware } from "./app.middleware"
import { getUserMiddleware } from "../auth/auth.middleware"
import swaggerUi from "swagger-ui-express"
import swaggerJsDoc, { Options } from "swagger-jsdoc"
import expressJSDocSwagger from "express-jsdoc-swagger"

const swaggerOptions = {
    info: {
        version: '1.0.0',
        title: 'Weblex forum api docs',
        desceiption: "Description",
        license: {
          name: 'MIT',
        },
      },
      security: {
        BasicAuth: {
          type: 'http',
          scheme: 'basic',
        },
      },
      // Base directory which we use to locate your JSDOC files
      baseDir: "../",
      // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
      filesPattern: './**/*.ts',
      // URL where SwaggerUI will be rendered
      swaggerUIPath: '/api-docs',
      // Expose OpenAPI UI
      exposeSwaggerUI: true,
      // Expose Open API JSON Docs documentation in `apiDocsPath` path.
      exposeApiDocs: false,
      // Open API JSON Docs endpoint.
      apiDocsPath: '/v3/api-docs',
      // Set non-required fields as nullable by default
      notRequiredAsNullable: false,
      // You can customize your UI options.
      // you can extend swagger-ui-express config. You can checkout an example of this
      // in the `example/configuration/swaggerOptions.js`
      swaggerUiOptions: {},
      // multiple option in case you want more that one instance
      multiple: true,
}

// const swaggerOptions = {
//     swaggerDefinition: {
//         swagger: "2.0",
//         info: {
//             title: "WelbeX forum Express API documentation",
//             version: "0.1.0",
//         },
//     },
// 	definition: {
// 		openapi: "3.1.0",
// 		info: {
// 			title: "WelbeX forum Express API documentation",
// 			version: "0.1.0",
// 		},
// 		servers: [
// 			{
// 				url: "http://localhost:5000",
// 			},
// 		],
// 	},
// 	apis: ["./forum/*.controller.ts", "./auth/*.controller.ts"],
// }

const createExpressServer = () => {
	const app = express()

	app.use(cors())
	app.use(urlencoded({ extended: true }))
	app.use(json())

    // const swaggerSpecs = swaggerJsDoc(swaggerOptions)
    // app.use(
	// 	"/api-docs",
	// 	swaggerUi.serve,
	// 	swaggerUi.setup(swaggerSpecs, { explorer: true })
	// )
    expressJSDocSwagger(app)(swaggerOptions);

	app.use(loggerMiddleware)
	app.use(getUserMiddleware)

	return app
}

export default createExpressServer
