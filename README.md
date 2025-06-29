# Aurea

Aurea is a real-time AI-powered assistant that helps users analyze, understand, and improve color palettes in images, with a focus on accessibility and inclusive design. It provides palette extraction, colorblind simulation, and design feedback using Google's Gemini API.

## Run Instructions 

you can run chmod +x ./run.sh in root (this builds perm)
then you can run ./run.sh to do the following

1. Install backend dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set up your environment variables (either in a `.env` file or in your environment):
   - `GEMINI_API_KEY` (required for the chat to work)

3. Start the backend server:
   ```
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

4. In a new terminal, start the frontend:
   ```
   cd frontend
   npm install
   npm start
   ```

5. The backend API will be available at `http://localhost:8000` and the frontend at `http://localhost:3000`.
