from fastapi import APIRouter, UploadFile, File, Form
from firebase_init import db, bucket
import uuid

router = APIRouter()

@router.post("/proofs")
async def upload_proof(
    user_id: str = Form(...),
    challenge_id: str = Form(...),
    content: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        # ✅ 1. 파일명 만들고 Storage에 업로드
        filename = f"proofs/{uuid.uuid4()}.jpg"
        blob = bucket.blob(filename)
        blob.upload_from_file(file.file, content_type=file.content_type)
        image_url = blob.public_url

        # ✅ 2. 인증글을 Firestore에 저장
        db.collection("proofs").add({
            "userID": user_id,
            "challengeID": challenge_id,
            "content": content,
            "image_url": image_url,
            "status": "pending"  # 기본 상태: 승인 대기
        })

        return {
            "status": "success",
            "message": "🔥 인증 업로드 성공!",
            "image_url": image_url
        }

    except Exception as e:
        print("❌ 인증 업로드 오류 발생:", e)
        return {
            "status": "fail",
            "message": "🚨 인증 업로드 실패!",
            "error": str(e)
        }
