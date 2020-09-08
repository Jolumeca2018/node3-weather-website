const path = require("path")
const express = require("express")
const hbs = require("hbs")
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//nos conectamos al index.html
const app = express()
const port = process.env.PORT || 3000

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

//Setup handlebards engine and views location.. ver mas info en expressjs.com
app.set("view engine", "hbs")
app.set("views", viewPath)
hbs.registerPartials(partialsPath)

//Setup staticdirectory to serve
app.use(express.static(publicDirectoryPath))

//utilizando handlebars
app.get("", (req, res) => {
    res.render("index", {
        title: "Weather app",
        name: "Jorge Melendez",
        footer: "Create by Jorgito"
    })
})

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About me",
        name: "Jorge Melendez",
        footer: "Create by Jorgito"
    })
})

app.get("/help", (req, res) => {
    res.render("help", {
        helpText: "We can help you",
        title: "Help",
        name: "Jorge Melendez",
        footer: "Create by Jorgito"
    })
})


app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Jorge Melendez",
        errorMessage:"Help article not found"
    })
})


/* app.get("*", (req, res) => {
    res.render("404", {
        title: "404",
        name: "Jorge Melendez",
        errorMessage: "Page not found"
    })
}) */

app.get("/weather", (req, res) => {
    if (!req.query.address) {
        return res.send ({
            error: "You must provide an address"
        })

    }
    geocode(req.query.address, (error, {latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({error})
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})
app.get("/products", (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: "you must provide a search term"
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})


app.listen(port, () => {
    console.log("Servidor is up on port " + port)
})
