import base64
import io
import requests
from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np

router = APIRouter()

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

def simulate_blind(img, mode):
    arr = np.array(img.convert('RGB'))
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

def get_gemini_feedback(palette):
    prompt = f"""
Aurea is a real-time AI-powered assistant that transforms how we understand and fix color in design, especially for accessibility. It allows artists to upload an image, instantly extract and get their palette analyzed, and uses Gemini to assess harmony, contrast, and emotional tone. But more importantly, Aurea doesn’t stop at analysis. It actively simulates how the artwork appears to people with different types of colorblindness, and then converts it back into a palette optimized for normal vision, preserving the mood, composition and intent. For colorblinded artists, this means they can verify how their work appears to non-color blind viewers, as it will change colourblind artworks into normal colours.
Aurea then calls Gemini to narrate the palette: emotionally, culturally, and technically. It tells the user what they are actually communicating through color and how to fix it if it's missing the mark.

Palette: {', '.join(palette)}

Give a concise, readable, and insightful analysis for the user, including:
- Color harmony (complementary, analogous, triadic, etc)
- Accessibility risks (contrast, color confusion)
- Suggestions for improvement
- Artistic and emotional description

Respond in plain text, not JSON.
    """.strip()
    api_key = "AIzaSyD1-1Qw8Qn8Qw8Qn8Qw8Qn8Qw8Qn8Qw8Q"  # Replace with your Gemini API key
    resp = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}",
        json={
            "contents": [{"parts": [{"text": prompt}]}]
        },
        headers={'Content-Type': 'application/json'}
    )
    try:
        rj = resp.json()
        txt = rj['candidates'][0]['content']['parts'][0]['text']
        return txt
    except Exception:
        return None

@router.post("/image")
async def analyze_image(
    file: UploadFile = File(...),
    simulateType: str = Form(None)
):
    try:
        img_bytes = await file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
        palette = extract_palette(img)
        simulated_image_base64 = None
        if simulateType in ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia']:
            sim_img = simulate_blind(img, simulateType)
            with io.BytesIO() as output:
                sim_img.save(output, format="PNG")
                simulated_image_base64 = "data:image/png;base64," + base64.b64encode(output.getvalue()).decode()
        with io.BytesIO() as output:
            img.save(output, format="PNG")
            original_image_base64 = "data:image/png;base64," + base64.b64encode(output.getvalue()).decode()
        gemini_feedback = get_gemini_feedback(palette)
        return JSONResponse({
            'originalImage': original_image_base64,
            'simulatedImage': simulated_image_base64,
            'palette': palette,
            'geminiFeedback': gemini_feedback
        })
    except Exception as e:
        return JSONResponse({'error': str(e)}, status_code=400)