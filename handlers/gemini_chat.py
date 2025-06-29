import os
import requests
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse

router = APIRouter()

AUREA_CONTEXT = (
    "Aurea is a real-time AI-powered assistant that transforms how we understand and fix color in design, especially for accessibility. "
    "It allows artists to upload an image, instantly extract and get their palette analyzed, and uses Gemini to assess harmony, contrast, and emotional tone. "
    "But more importantly, Aurea doesn’t stop at analysis. It actively simulates how the artwork appears to people with different types of colorblindness, and then converts it back into a palette optimized for normal vision, preserving the mood, composition and intent. "
    "For colorblinded artists, this means they can verify how their work appears to non-color blind viewers, as it will change colourblind artworks into normal colours. "
    "Aurea then calls Gemini to narrate the palette: emotionally, culturally, and technically. It tells the user what they are actually communicating through color and how to fix it if it's missing the mark. "
    "Aurea is about design as inclusion. It doesn’t flag inaccessible palettes, it fixes them. It doesn’t guess how a colorblind person might see your work, it shows you, and helps you bridge the gap. "
    "This is accessibility baked into creativity, not added on top as an afterthought. Target audience: colorblind artists, designers, students, teachers, and anyone who cares about color accessibility and inclusion. "
    "Gemini, you are Aurea's assistant. Respond as a helpful, insightful, and creative design assistant."
)

def get_gemini_api_key():
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        from dotenv import load_dotenv
        load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), '../.env'), override=True)
        key = os.environ.get("GEMINI_API_KEY")
    return key

@router.post("/gemini-chat")
async def gemini_chat(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    payload = {
        "contents": [
            {"parts": [{"text": AUREA_CONTEXT}]},
            {"parts": [{"text": user_message}]}
        ]
    }
    api_key = get_gemini_api_key()
    if not api_key:
        return JSONResponse({"reply": "Error: GEMINI_API_KEY not set in environment."}, status_code=500)
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key={api_key}"
    try:
        resp = requests.post(api_url, json=payload, headers={"Content-Type": "application/json"}, timeout=15)
        rj = resp.json()
        reply = rj.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text")
        if not reply:
            if rj.get("error", {}).get("status") == "RESOURCE_EXHAUSTED":
                reply = "Sorry, the AI assistant is currently at its daily or minute usage limit. Please try again later."
            else:
                reply = "Sorry, I couldn't get a response from the AI right now. Please try again in a few minutes."
        return JSONResponse({"reply": reply})
    except Exception:
        return JSONResponse({"reply": "Sorry, something went wrong while contacting the AI. Please try again soon."}, status_code=500)
