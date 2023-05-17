import cors from "cors"
import express, { json, urlencoded } from "express"
import expressJSDocSwagger from "express-jsdoc-swagger"
import { getUserMiddleware } from "../auth/auth.middleware"
import { loggerMiddleware } from "./app.middleware"

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

const createExpressServer = () => {
	const app = express()

	app.use(cors())
	app.use(urlencoded({ extended: true }))
	app.use(json())

    expressJSDocSwagger(app)(swaggerOptions);

	app.use(loggerMiddleware)

	return app
}

export default createExpressServer
