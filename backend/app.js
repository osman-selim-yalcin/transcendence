require("dotenv").config()
const express = require("express")
const app = express()

const path = require("path")
const mongoose = require("mongoose")
const port = 3000
const cookieParser = require("cookie-parser")
const session = require("express-session")
const cors = require("cors")
const routerUser = require("./routers/user.js")

mongoose
  .connect(process.env.mongooseUrl)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch(err => {
    console.log("Mongo error", err)
  })

app.use(express.static(path.join(__dirname, "public/game")))
app.use(cookieParser())
app.use(express.json())
app.use(cors())
app.use(
  session({
    secret: "hahaha",
    resave: false,
    saveUninitialized: false
  })
)

app.use("/api/user", routerUser)

// app.get('/game', (req, res) => {
// 	res.sendFile(path.join(__dirname, 'public/game'))
// })

app.get("/try", (req, res) => {
  const { username, password } = req.body
  console.log(req.body)
})

app.listen(port, () => {
  console.log("Example app listening on", port)
})
