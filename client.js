const Discord = require("discord.js")
const Enmap = require("enmap")
const Canvas = require("canvas")
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

const applyText = (canvas, text) => {
  const context = canvas.getContext("2d")
  let fontSize = 70

  do {
    context.font = `${(fontSize -= 10)}px sans-serif`
  } while (context.measureText(text).width > canvas.width - 300)

  return context.font
}

client.on("guildMemberAdd", async member => {
  const channel = member.guild.channels.cache.find(
    ch => ch.name === "member-log"
  )
  if (!channel) return

  const canvas = Canvas.createCanvas(700, 250)
  const context = canvas.getContext("2d")

  const background = await Canvas.loadImage("./wallpaper.jpg")
  context.drawImage(background, 0, 0, canvas.width, canvas.height)

  context.strokeStyle = "#74037b"
  context.strokeRect(0, 0, canvas.width, canvas.height)

  context.font = "28px sans-serif"
  context.fillStyle = "#ffffff"
  context.fillText(
    "Welcome to the server,",
    canvas.width / 2.5,
    canvas.height / 3.5
  )

  context.font = applyText(canvas, `${member.displayName}!`)
  context.fillStyle = "#ffffff"
  context.fillText(
    `${member.displayName}!`,
    canvas.width / 2.5,
    canvas.height / 1.8
  )

  context.beginPath()
  context.arc(125, 125, 100, 0, Math.PI * 2, true)
  context.closePath()
  context.clip()

  const avatar = await Canvas.loadImage(
    member.user.displayAvatarURL({ format: "jpg" })
  )
  context.drawImage(avatar, 25, 25, 200, 200)

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "welcome-image.png"
  )

  channel.send(`Welcome to the server, ${member}!`, attachment)
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
        `You can't resuse \`${
          command.name
        }\` for ${timeLeft.toFixed()} seconds!`
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
