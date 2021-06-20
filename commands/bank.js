const util = require("../util.js")

module.exports = {
  name: "bank",
  description: "Check your bank account!",
  execute({ message, args, client }) {
    const key = util.key(message)
    const bank = client.bank.get(key)

    const embed = {
      color: 0xFFAC00,
      title: `${message.author.tag}\'s Bank`,
      description: `Balance: ${bank.money}$`
    }
    message.channel.send({ embed })
  },
}
