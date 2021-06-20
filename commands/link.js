const util = require("../util")
const { url } = require("../config")

function createLink(message) {
  return `https://${url}/${message.guild.id}/${message.author.id}/`
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
