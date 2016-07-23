const fs = require("fs")
const path = require("path")
const mkdirp = require("mkdirp")
const morgan = require("morgan")
const express = require("express")

module.exports = function (app) {
	if (process.env.NODE_ENV == "development") {
		app.use(morgan("dev", {}))
	}
	else {
		mkdirp.sync(".log")
		var accessLogStream = fs.createWriteStream(path.join(__dirname, "../../../.log/access.log"), {
			flags: "a"
		})

		// Logger writing to the stream
		app.use(morgan("combined", {stream: accessLogStream}))
		
		// Logger for displaying the combined output to the screen
		app.use(morgan("combined", {}))

		// Experimental route to log the stuff to the webpage
		// The application logs should be protected though and this route shouldn't 
		// be used in the production	
		app.use("/log", express.static(path.join(process.cwd(), ".log/")))
	}
}