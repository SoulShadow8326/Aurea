import Jimp from 'jimp'
import chroma from 'chroma-js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const colorBlind = require('color-blind')
const daltonize = require('daltonize')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { imageBase64, colorBlindType } = req.body
  const apiKey = process.env.GEMINI_API_KEY

  if (!imageBase64) {
    return res.status(400).json({ error: 'Missing image data' })
  }

  try {
    const buffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64')
    const image = await Jimp.read(buffer)
    const { width, height } = image.bitmap

    const colorMap = {}
    for (let y = 0; y < height; y += 10) {
      for (let x = 0; x < width; x += 10) {
        const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y))
        const hex = chroma(r, g, b).hex()
        colorMap[hex] = (colorMap[hex] || 0) + 1
      }
    }
    const palette = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([hex]) => hex)

    const contrast = []
    for (let i = 0; i < palette.length; i++) {
      for (let j = i + 1; j < palette.length; j++) {
        const c1 = palette[i], c2 = palette[j]
        const ratio = chroma.contrast(c1, c2)
        contrast.push({
          color1: c1,
          color2: c2,
          ratio: +ratio.toFixed(2),
          wcagAA: ratio >= 4.5
        })
      }
    }

    const colorblind = {
      protanopia: palette.map(c => colorBlind.protanopia(c)),
      deuteranopia: palette.map(c => colorBlind.deuteranopia(c)),
      tritanopia: palette.map(c => colorBlind.tritanopia(c)),
      achromatopsia: palette.map(c => colorBlind.achromatopsia(c)),
    }

    let aiAnalysis = null
    if (apiKey) {
      const prompt = `
You are an expert in color theory and accessibility.
Given this palette: ${palette.join(', ')}, please:
1. Analyze its color harmony (complementary, analogous, triadic, etc).
2. Point out any accessibility risks (contrast, color confusion).
3. Suggest an accessible alternative palette for colorblind users, preserving mood and harmony.
4. Write a brief artistic and emotional description of the palette.
Respond in JSON with keys: harmony, accessibility, suggestions, description.
      `.trim()

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      })
      const data = await response.json()
      if (
        data &&
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts &&
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text
      ) {
        try {
          aiAnalysis = JSON.parse(data.candidates[0].content.parts[0].text)
        } catch (_) {
          aiAnalysis = { raw: data.candidates[0].content.parts[0].text }
        }
      }
    }

    let correctedImageBase64 = null
    if (colorBlindType && ['protanopia', 'deuteranopia', 'tritanopia'].includes(colorBlindType)) {
      const imgData = {
        width,
        height,
        data: new Uint8ClampedArray(width * height * 4)
      }
      let k = 0
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const { r, g, b, a } = Jimp.intToRGBA(image.getPixelColor(x, y))
          imgData.data[k++] = r
          imgData.data[k++] = g
          imgData.data[k++] = b
          imgData.data[k++] = a
        }
      }
      const corrected = daltonize.correct(imgData, colorBlindType)
      k = 0
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4
          image.setPixelColor(Jimp.rgbaToInt(
            corrected.data[idx],
            corrected.data[idx + 1],
            corrected.data[idx + 2],
            corrected.data[idx + 3]
          ), x, y)
        }
      }
      correctedImageBase64 = await image.getBase64Async(Jimp.MIME_PNG)
    }

    res.status(200).json({
      palette,
      contrast,
      colorblind,
      aiAnalysis,
      usedGeminiKey: !!apiKey,
      correctedImageBase64
    })
  } catch (e) {
    res.status(500).json({ error: 'Failed to process image' })
  }
}