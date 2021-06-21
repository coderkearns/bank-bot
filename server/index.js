const express = require("express")
const client = require("../client")
const Enmap = require("enmap")

const app = express()

app.use((req, res, next) => {
  req.db = new Enmap("bank", { dataDir: "./data" })
  next()
})

app.all("/ping", (req, res) => {
  res.send(`${client.user.tag} is up and running!`)
})

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.get("/:guildId/:userId", (req, res) => {
  let key = `${req.params.guildId}-${req.params.userId}`
  let user = req.db.get(key)
  if (!user) return res.json({ error: 404, message: "User not found." })
  res.json(user)
})

module.exports = app
