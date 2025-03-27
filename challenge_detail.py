from fastapi import APIRouter, Request
from firebase_init import db
from auth_controller import verify_token

router = APIRouter()

@router.get("/challenges/{challenge_id}")
def get_challenge(challenge_id: str, request: Request):
    # 요청 헤더에서 Firebase ID 토큰 가져오기
    id_token = request.headers.get("Authorization")
    if not id_token:
        return {"error": "토큰이 없습니다."}
    
    user_id = verify_token(id_token)
    if not user_id:
        return {"error": "유효하지 않은 토큰입니다."}

    # 챌린지 문서 불러오기
    challenge_ref = db.collection("challenges").document(challenge_id)
    doc = challenge_ref.get()

    if not doc.exists:
        return {"error": "챌린지를 찾을 수 없습니다."}
    
    challenge_data = doc.to_dict()

    # 사용자가 참여했는지 확인
    query = (
        db.collection("participations")
        .where("userID", "==", user_id)
        .where("challengeID", "==", challenge_id)
        .get()
    )
    participated = len(query) > 0

    return {
        "challenge": challenge_data,
        "participated": participated
    }
