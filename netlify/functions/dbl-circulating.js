exports.handler = async function (event, context) {
  try {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
      body: '20000000',
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}
