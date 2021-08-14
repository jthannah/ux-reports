import { Handler } from '@netlify/functions'

const apiUrlBase = 'https://chromeuxreport.googleapis.com/v1/records:queryRecord'
const apiKey = process.env.CRUX_API_KEY

const handler: Handler = async (event, context) => {
  return fetch(`${apiUrlBase}?key=${apiKey}`, {
    method: 'POST',
    body: JSON.stringify({ origin: 'https://example.com/' }),
  }).then((resp) => {
    if (!resp.ok) throw new Error('somethign happened')
    return resp.json().then((json) => {
      return json
    })
  })
}

export { handler }
