import Jimp from 'jimp'
import chroma from 'chroma-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { imageBase64 } = req.body
  const apiKey = process.env.GEMINI_API_KEY

  if (!imageBase64) {
    res.status(400).json({ error: 'Missing image data' })
    return
  }

  const buffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64')

  try {
    const image = await Jimp.read(buffer)
    const width = image.bitmap.width
    const height = image.bitmap.height
    const colorMap = {}

    for (let y = 0; y < height; y += 10) {
      for (let x = 0; x < width; x += 10) {
        const hex = Jimp.intToRGBA(image.getPixelColor(x, y))
        const key = chroma(hex.r, hex.g, hex.b).hex()
        colorMap[key] = (colorMap[key] || 0) + 1
      }
    }

    const sortedColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([hex]) => hex)

    res.status(200).json({ palette: sortedColors, usedGeminiKey: !!apiKey })
  } catch (e) {
    res.status(500).json({ error: 'Failed to process image' })
  }
}
