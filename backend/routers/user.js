const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).send("Please enter all fields")
    }
    const hash = await bcrypt.hash(password, 12)
    const user = new User({ username, password: hash })
    await user.save()

    req.session.user = user
    res.send(user)
  } catch (e) {
    res.status(400).send("An error occured,")
  }
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).send("Please enter all fields")
  }
  const user = await User.findOne({ username })
  if (!user) return res.status(400).send("User not found")
  const match = await bcrypt.compare(password, user.password)
  if (!match) return res.status(400).send("Wrong password")

  req.session.user = user
  res.send(user)
})

module.exports = router
