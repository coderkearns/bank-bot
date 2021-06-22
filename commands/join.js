module.exports = {
  name: "join",
  description: "Fake a new member message",
  execute({ message, args, client }) {
    client.emit("guildMemberAdd", message.member)
  },
}
