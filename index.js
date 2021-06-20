const app = require("./server")
const client = require("./client")
const config = require("./config")

client.login(config.token)
app.listen(config.port, () => console.log(`[server] Listening`))
