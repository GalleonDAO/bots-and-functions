const { Client } = require('discord.js')
const dotenv = require('dotenv')
const { schedule } = require('@netlify/functions')
const fetch = require('node-fetch')

dotenv.config()

let client = new Client()
client.login(process.env.DISCORD_API_TOKEN)
client.on('ready', () =>
  console.log(`Bot successfully started as ${client.user.tag} 🤖`),
)

module.exports.handler = schedule('* * * * *', async (event) => {
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
    await botMember.setNickname(`${price ? numberWithCommas(price) : ''}`)
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
})

const fetchData = async () => {
  try {
    const tokenData = await (
      await fetch(
        `https://api.coingecko.com/api/v3/coins/${process.env.TOKEN_ID}`,
      )
    ).json()

    const price = tokenData.market_data.current_price.usd
    const symbol = tokenData.symbol.toUpperCase()
    const circSupply = tokenData.market_data.circulating_supply

    return { price, symbol, circSupply }
  } catch (err) {
    console.log(err)
    return undefined
  }
}

const numberWithCommas = (num) => num.toLocaleString()
