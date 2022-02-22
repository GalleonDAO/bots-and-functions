exports.handler = async function (event, context) {
  const initialCirc = 20000000
  const remainingTokens = 80000000
  const initialTimestamp = 1643932800
  const tokensPerDay = Math.round(remainingTokens / 1096)
  const ONE_DAY = 1000 * 60 * 60 * 24
  const differenceMs = Math.abs(Date.now() - initialTimestamp)
  const daysSinceInitial = Math.round(differenceMs / ONE_DAY) / 1000
  const updatedCirculatingSupply = Math.round(
    initialCirc + daysSinceInitial * tokensPerDay,
  ).toString()

  try {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: updatedCirculatingSupply,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}
