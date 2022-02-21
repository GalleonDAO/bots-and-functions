const { Client } = require('discord.js')
const dotenv = require('dotenv')
const { fetchData } = require('./fetchData')
const { numberWithCommas } = require('./utils')
const { schedule } = require('@netlify/functions')

dotenv.config()

const client = new Client()
client.login(process.env.DISCORD_API_TOKEN)
client.on('ready', () =>
  console.log(`Bot successfully started as ${client.user.tag} 🤖`),
)

module.exports.handler = schedule('* * * * *', async (_) => {
  const data = await fetchData()

  if (!data) return

  const { price, _, circSupply } = data

  client.guilds.cache.forEach(async (guild) => {
    const botMember = guild.me
    await botMember.setNickname(
      `${price ? ': $' + numberWithCommas(price) : ''}`,
    )
  })

  client.user.setActivity(
    `${
      circSupply
        ? 'MC: $' + numberWithCommas(Math.round(price * circSupply))
        : ''
    }`,
    { type: 'WATCHING' },
  )

  return {
    statusCode: 200,
  }
})
