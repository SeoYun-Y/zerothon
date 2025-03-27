from fastapi import FastAPI
from firebase_init import db
from challenge_detail import router as challenge_router  # 📌 라우터 import
from proof_upload import router as proof_router
from proof_approval import router as approval_router
from weather_alert import send_weather_alert
from fastapi import APIRouter

app = FastAPI()

# 📍 라우터 등록 (하나 이상 등록 가능)
app.include_router(challenge_router)
app.include_router(proof_router)
app.include_router(approval_router)

@app.get("/")
def root():
    return {"message": "🚀 백엔드 서버 작동 중입니다!"}

@app.get("/test")
def test_firestore():
    db.collection("test").add({"message": "Hello Seoyun!", "from": "FastAPI"})
    return {"status": "✅ Firestore 연결 성공!"}

@app.post("/send_weather_alert")
def send_weather(user_id: str):
    # 날씨 알림 보내기
    return send_weather_alert(user_id)