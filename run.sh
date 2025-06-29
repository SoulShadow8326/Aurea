pip install -r requirements.txt

cd frontend
npm install

cd ../.
uvicorn main:app --host 0.0.0.0 --port 8000

cd frontend
npm start