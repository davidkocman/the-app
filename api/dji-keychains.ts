import type { VercelRequest, VercelResponse } from '@vercel/node'

const DJI_KEYCHAINS_URL = 'https://dev.dji.com/openapi/v1/flight-records/keychains'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.DJI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'DJI API key not configured' })
  }

  const response = await fetch(DJI_KEYCHAINS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey
    },
    body: JSON.stringify(req.body)
  })

  const data = await response.json()
  return res.status(response.status).json(data)
}
