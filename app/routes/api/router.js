const bodyParser = require("body-parser")
const expressValidator = require("express-validator")

const validations = require("./validations")

const indexController = require("./controllers/indexController")
const mailController = require("./controllers/mailController")

const handlers = require("./handlers")

const router = require("express").Router()

router.get("/", indexController.welcomeRoute)

// TODO: Implementation of rate limiting to ips fucking up with our application	
// Express-brute is a module worth considering


router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
	extended: true
}))


// Validators for the api which can be used during the application
router.use(expressValidator({
	customValidators: validations.customValidators,
	customSanitizers: validations.customSanitizers
}))

router.get("/email/", function (req, res, next) {
	res.json({
		message: "This route is for retrieving the information about sent and received emails, including replies!",
		example: "/email/3213212131231"
	})
})
router.get("/email/:id", mailController.getMail)
router.get("/email/:id/replies", mailController.getMailReplies)


router.get("/getMails", mailController.getMails)
router.post("/sendMail", mailController.sendMail)

router.use(handlers.notFound)
router.use(handlers.mongooseError)

router.use(handlers.error)

module.exports = router