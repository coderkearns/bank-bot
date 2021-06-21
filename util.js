const fs = require("fs")

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function key(message) {
  return `${message.guild.id}-${message.author.id}`
}

function registerCommands(client) {
  for (const commandFile of fs.readdirSync("./commands")) {
    const command = require(`./commands/${commandFile}`)
    client.commands.set(command.name, command)
  }
}

function ensureBank(client, message) {
  client.bank.ensure(key(message), {
    user: message.author.id,
    guild: message.guild.id,
    money: 0,
  })
}

function getUserFromMention(client, mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

module.exports = { registerCommands, ensureBank, randint, key, getUserFromMention }
