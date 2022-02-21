const { Client } = require('discord.js')
const dotenv = require('dotenv')
const { fetchData, numberWithCommas } = require('./helpers/utils')

dotenv.config()

let client = new Client()
client.login(process.env.DISCORD_API_TOKEN)
client.on('ready', () =>
  console.log(`Bot successfully started as ${client.user.tag} 🤖`),
)

const task = async () => {
  console.log(`-- DBL Price Bot Run --`)

  if (client === null || client === undefined) {
    client = new Client()
    client.login(process.env.DISCORD_API_TOKEN)
    client.on('ready', () =>
      console.log(`Bot successfully started as ${client.user.tag} 🤖`),
    )
  }

  const data = await fetchData()

  if (!data) return

  const { price, symbol, circSupply } = data

  console.log('Fetched: ' + symbol, price, circSupply)

  client.guilds.cache.forEach(async (guild) => {
    const botMember = guild.me
    await botMember.setNickname(`${price ? '$' + numberWithCommas(price) : ''}`)
  })

  if (client.user) {
    client.user.setActivity(
      `${
        circSupply
          ? 'MC: $' + numberWithCommas(Math.round(price * circSupply))
          : ''
      }`,
      { type: 'WATCHING' },
    )
  }

  return {
    statusCode: 200,
  }
}

setInterval(async () => {
  await task()
}, 1 * 1000 * 60)
