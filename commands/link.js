const util = require("../util")
const { url } = require("../config")

function createLink(guild, user) {
  return `https://${url}/${guild.id}/${user.id}/`
}

module.exports = {
  name: "link",
  description: "Get a website link. Mention someone if you want their link instead.",
  execute({ message, args, client }) {
    let user
    if (args.length !== 0) {
      user = util.getUserFromMention(client, args[0])
    } else {
      user = message.author
    }
    const link = createLink(message.guild, user)
    message.channel.send(link)
  },
}
