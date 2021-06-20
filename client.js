const Discord = require("discord.js")
const Enmap = require("enmap")
const config = require("./config")
const util = require("./util")

const client = new Discord.Client()
client.bank = new Enmap("bank")
client.commands = new Discord.Collection()
client.cooldowns = new Discord.Collection()

util.registerCommands(client)

client.once("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", message => {
	if (message.author.bot) return
	if (message.guild) util.ensureBank(client, message)

  if (!message.content.startsWith(config.prefix)) return

  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/)
  const commandName = args.shift().toLowerCase()

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    )

  if (!command) return

  if (command.guildOnly && message.channel.type === "dm") {
    return message.channel.send("That command is only usable in servers!")
  }

  if (command.permissions) {
    const authorPerms = message.channel.permissionsFor(message.author)
    if (!authorPerms || !authorPerms.has(command.permissions)) {
      return message.channel.send("You don't have the permissions for that!")
    }
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments!`

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``
    }

    return message.channel.send(reply)
  }

  const { cooldowns } = client

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const cooldownAmount = (command.cooldown || 3) * 1000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.channel.send(
        `You can't resuse \`${command.name}\` for ${timeLeft.toFixed()} seconds!`
      )
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

  try {
    command.execute({ client, message, args })
  } catch (error) {
    console.error(error)
    message.channel.send("**Oops!**\nSomething went wrong.")
  }
})

module.exports = client
