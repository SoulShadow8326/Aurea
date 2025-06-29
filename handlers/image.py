import base64
import io
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
        return JSONResponse({
            'originalImage': original_image_base64,
            'simulatedImage': simulated_image_base64,
            'palette': palette
        })
    except Exception as e:
        return JSONResponse({'error': str(e)}, status_code=400)