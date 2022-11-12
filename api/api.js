require("dotenv")
const { Router, static } = require("express")
const app = require("express")()
const router = Router()
const path = require("path")
const port = process.env.port || 8080

app.use(static(path.join(__dirname+"/main")))

app.use("/", (req, res) => {
    return res.sendFile(path.join(__dirname+"/main/index.html"))
})

// Gets the favicon
router.get("/favicon", (req, res) => {
    return res.sendFile(path.join(__dirname+"/images/favicon.ico"))
})

// Gets the construction image
router.get("/construction", (req, res) => {
    return res.sendFile(path.join(__dirname+"/images/coming-soon-shitty-image.jpeg"))
})

// Redirects to invite page
router.use("/invite", (req, res) => {
    if (!req.accepts("html")) return res.type("text").send("Sorry, you must be on a web browser to use this endpoint.")

    res.redirect(301, "https://discord.com/oauth2/authorize?client_id=919249309508206652&permissions=1239370165286&scope=bot%20applications.commands")
})

// Redirects to the DisTune GitHub
router.use("/github", (req, res) => {
    if (!req.accepts("html")) return res.type("text").send("Sorry, you must be on a web browser to use this endpoint.")

    res.redirect(301, "https://github.com/CerialPvP/DisTune")
})

// Sends either an HTML page, JSON data or plain text for people who use an unknown page.
router.use("*", (req, res) => {
    res.status(404)
    if (req.accepts("html")) return res.sendFile(path.join(__dirname+"/main/notfound.html"))
    if (req.accepts("json")) return res.json({success: false, error: "Could not find the requested endpoint. Check if you misspelled the URL."})
    else return res.type("text").send("Encountered a 404. Could not find the requested endpoint. Check if you misspelled the URL.")
})

app.listen(port, () => {
    console.log(`API is enabled on port "${port}".`)
})