const dotenv = require("dotenv")
const path = require("path")
const fs = require("fs")
const Mailer = require("../modules/mailer")
const NODE_ENV = process.env.NODE_ENV = "development"

var ENV_VARIABLES = {}

if (NODE_ENV == "development") {
	Object.assign(ENV_VARIABLES, dotenv.parse(fs.readFileSync("./keys.env")))
}

const defaults = {
	root: path.join(__dirname, "../.."),
	NODE_ENV
}


defaults.mailer = new Mailer(
	ENV_VARIABLES["MAILGUN_API_KEY"],
	ENV_VARIABLES['MAILGUN_DOMAIN']
	)

module.exports = Object.assign(defaults, ENV_VARIABLES)
