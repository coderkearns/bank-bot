const client = require("./client")
const app = require("./app")
const config = require("./config")

client.login(config.token)
app.listen(config.port, () => console.log(`[server] Listening`))
