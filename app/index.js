const express = require("express")

const app = express()

app.set("view engine", "pug")
app.set("views", __dirname)


require("./config/express.js")(app)

// requiring routers of all the routes
app.use("/api", require("./routes/api/router"))

module.exports = app