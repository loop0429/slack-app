import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const webhookUrl = process.env.SLACK_WEBHOOK_URL as string
    await axios.post(webhookUrl, {
      text: req.body.record.message,
    })

    console.log(req.body)

    res.status(200).json({
      message: 'OK',
    })

    return
  }
}
