const util = require("../util.js")

function createLink(message) {
  return `http://localhost:8080/${message.guild.id}/${message.author.id}/`
}

module.exports = {
  name: "link",
  description: "Get a link for yourself",
  cooldown: 30 * 60, // 30 minutes (60 seconds * 30)
  execute({ message, args, client }) {
    const link = createLink(message)
    message.channel.send(link)
  },
}
