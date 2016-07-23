const path = require("path")
const lusca = require("lusca")

const config = require("./index")

module.exports = function (app) {
	require("./middlewares/logger")(app)

	app.use(lusca.nosniff())
	app.use(lusca.xframe("DENY"))

	app.set("view engine", "pug")
	app.set("views", path.join(config.root, "./app/routes"))

	app.disable("x-powered-by")
	if (config.NODE_ENV == "development") {
		// Disable caching leading to realtime true input in development mode
		app.locals.pretty = true
		app.disable("etag")
	}
	else {
	}
}