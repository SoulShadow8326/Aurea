pip install -r requirements.txt
if [ $? -ne 0 ]; then
  echo "Python requirements install failed"
  exit 1
fi

#cd frontend
#npm install
#if [ $? -ne 0 ]; then
#  echo "npm install failed"
#  exit 1
#fi
#npm run build
#if [ $? -ne 0 ]; then
#  echo "Frontend build failed"
#  exit 1
#fi

#cd ../.
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}