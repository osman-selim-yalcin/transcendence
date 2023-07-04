require("dotenv").config()
const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const port = 3000
const cors = require("cors")
const routerUser = require("./routers/user.js")
const jwt = require("jsonwebtoken")

mongoose
  .connect(process.env.mongooseUrl)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch(err => {
    console.log("Mongo error", err)
  })

app.use(express.static(path.join(__dirname, "public/game")))
app.use(express.json())
app.use(cors())

app.use("/api/user", routerUser)

app.post("/try", (req, res) => {
	const authHeader = req.headers["authorization"]
  const token = authHeader  && authHeader.split(" ")[1]
  if (!token) return res.status(401).send("Access denied")

  jwt.verify(token, process.env.accessTokenSecret, (err, data) => {
    if (err) return res.status(403).send("Invalid token")
		req.user = data.user
    res.send("authentication successful")
  })
})

app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "public/game"))
})

app.listen(port, () => {
  console.log("Example app listening on", port)
})
