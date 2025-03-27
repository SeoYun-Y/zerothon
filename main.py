from fastapi import FastAPI
from firebase_init import db
from challenge_detail import router as challenge_router  # 📌 라우터 import

app = FastAPI()

# 📍 라우터 등록 (하나 이상 등록 가능)
app.include_router(challenge_router)

@app.get("/")
def root():
    return {"message": "🚀 백엔드 서버 작동 중입니다!"}

@app.get("/test")
def test_firestore():
    db.collection("test").add({"message": "Hello Seoyun!", "from": "FastAPI"})
    return {"status": "✅ Firestore 연결 성공!"}
