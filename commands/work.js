const util = require("../util.js")

module.exports = {
  name: "work",
  description: "Earn some money",
  cooldown: 30 * 60, // 30 minutes (60 seconds * 30)
  execute({ message, args, client }) {
    const amount = util.randint(1, 10)

    const key = util.key(message)
    client.bank.math(key, "+", amount, "money")

    const embed = {
      color: 0xed5740,
      description: `${message.author.tag} earned **${amount}** money!`,
    }
    message.channel.send({ embed })
  },
}
