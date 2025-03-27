from firebase_admin import auth

# 사용자의 Firebase 토큰을 검증하고 uid 반환
def verify_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token["uid"]
    except Exception as e:
        print("🚫 유효하지 않은 토큰:", e)
        return None
