import base64
import io
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import requests

app = FastAPI()

def rgb2hex(rgb):
    return '#%02x%02x%02x' % tuple(rgb)

def extract_palette(img, max_colors=6, step=10):
    img = img.convert('RGB')
    arr = np.array(img)
    h, w, _ = arr.shape
    color_counts = {}
    for y in range(0, h, step):
        for x in range(0, w, step):
            t = tuple(arr[y, x])
            color_counts[t] = color_counts.get(t, 0) + 1
    palette = sorted(color_counts, key=color_counts.get, reverse=True)[:max_colors]
    return [rgb2hex(c) for c in palette]

def contrast_ratio(rgb1, rgb2):
    def luminance(rgb):
        a = [v/255.0 for v in rgb]
        a = [v/12.92 if v<=0.03928 else ((v+0.055)/1.055)**2.4 for v in a]
        return 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2]
    l1 = luminance(rgb1)
    l2 = luminance(rgb2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter+0.05)/(darker+0.05)

def palette_contrast(palette):
    from itertools import combinations
    pairs = []
    rgb_palette = [tuple(int(x[i:i+2],16) for i in (1,3,5)) for x in palette]
    for i, j in combinations(range(len(palette)), 2):
        ratio = contrast_ratio(rgb_palette[i], rgb_palette[j])
        pairs.append({
            'color1': palette[i],
            'color2': palette[j],
            'ratio': round(ratio, 2),
            'wcagAA': ratio >= 4.5
        })
    return pairs

def simulate_blind(img, mode):
    arr = np.array(img.convert('RGB'))
    f = None
    if mode == 'protanopia':
        f = np.array([[0.56667, 0.43333, 0],[0.55833,0.44167,0],[0,0.24167,0.75833]])
    elif mode == 'deuteranopia':
        f = np.array([[0.625,0.375,0],[0.7,0.3,0],[0,0.3,0.7]])
    elif mode == 'tritanopia':
        f = np.array([[0.95,0.05,0],[0,0.43333,0.56667],[0,0.475,0.525]])
    elif mode == 'achromatopsia':
        f = np.array([[0.299,0.587,0.114]]*3)
    else:
        return img
    flat = arr.reshape(-1, 3)
    sim = np.clip(np.dot(flat, f.T), 0, 255).astype(np.uint8)
    out = sim.reshape(arr.shape)
    return Image.fromarray(out)

@app.post("/api/image")
async def analyze_image(request: Request):
    data = await request.json()
    image_base64 = data.get('imageBase64')
    gemini_api_key = data.get('geminiApiKey')
    simulate_type = data.get('simulateType')
    if not image_base64:
        return JSONResponse({"error": "Missing image data"}, status_code=400)

    raw = base64.b64decode(image_base64.split(',')[-1])
    img = Image.open(io.BytesIO(raw)).convert('RGB')
    palette = extract_palette(img)
    contrast = palette_contrast(palette)
    colorblind = {
        'protanopia': [rgb2hex(simulate_blind(Image.new('RGB', (1, 1), c), 'protanopia').getpixel((0, 0))) for c in palette],
        'deuteranopia': [rgb2hex(simulate_blind(Image.new('RGB', (1, 1), c), 'deuteranopia').getpixel((0, 0))) for c in palette],
        'tritanopia': [rgb2hex(simulate_blind(Image.new('RGB', (1, 1), c), 'tritanopia').getpixel((0, 0))) for c in palette],
        'achromatopsia': [rgb2hex(simulate_blind(Image.new('RGB', (1, 1), c), 'achromatopsia').getpixel((0, 0))) for c in palette]
    }

    simulated_image_base64 = None
    if simulate_type in ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia']:
        sim_img = simulate_blind(img, simulate_type)
        with io.BytesIO() as output:
            sim_img.save(output, format="PNG")
            simulated_image_base64 = "data:image/png;base64," + base64.b64encode(output.getvalue()).decode()

    aiAnalysis = None
    if gemini_api_key:
        prompt = f"""
You are an expert in color theory and accessibility.
Given this palette: {', '.join(palette)}, please:
1. Analyze its color harmony (complementary, analogous, triadic, etc).
2. Point out any accessibility risks (contrast, color confusion).
3. Suggest an accessible alternative palette for colorblind users, preserving mood and harmony.
4. Write a brief artistic and emotional description of the palette.
Respond in JSON with keys: harmony, accessibility, suggestions, description.
        """.strip()
        resp = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={gemini_api_key}",
            json={
                "contents": [{"parts": [{"text": prompt}]}]
            },
            headers={'Content-Type': 'application/json'}
        )
        try:
            rj = resp.json()
            txt = rj['candidates'][0]['content']['parts'][0]['text']
            try:
                aiAnalysis = rj = __import__('json').loads(txt)
            except Exception:
                aiAnalysis = {'raw': txt}
        except Exception:
            aiAnalysis = {'error': 'Gemini error', 'raw': resp.text}

    return JSONResponse({
        'palette': palette,
        'contrast': contrast,
        'colorblind': colorblind,
        'aiAnalysis': aiAnalysis,
        'simulatedImageBase64': simulated_image_base64
    })