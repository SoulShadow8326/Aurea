from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from handlers.image import router as image_router
from handlers.gemini_chat import router as gemini_chat_router
import os
import dotenv

dotenv.load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), '../.env'), override=True)

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(image_router, prefix="/api")
app.include_router(gemini_chat_router, prefix="/api")

@app.get("/api/health")
def health():
    return {"status": "ok"}