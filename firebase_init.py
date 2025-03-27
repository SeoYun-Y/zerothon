import firebase_admin
from firebase_admin import credentials, firestore, storage, messaging

# Firebase 인증
cred = credentials.Certificate("firebase_credentials.json")

# Firebase 앱 초기화 (중복 초기화 방지)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'weatherhero-debaf.firebasestorage.app'  # 정확한 버킷명
    })
else:
    print("Firebase app already initialized.")

# Firestore, Storage 초기화
db = firestore.client()
bucket = storage.bucket()

# FCM 메시지 전송 함수
def send_push_notification(token, title, body):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        token=token,
    )

    # 메시지 전송
    try:
        response = messaging.send(message)
        print("Successfully sent message:", response)
        return {"status": "success", "message_id": response}
    except Exception as e:
        print("Error sending message:", e)
        return {"status": "fail", "error": str(e)}

# FCM 토큰을 Firestore에 저장하는 함수
def save_fcm_token(user_id, fcm_token):
    # Firestore에 FCM 토큰 저장
    user_ref = db.collection("fcmTokens").document(user_id)
    user_ref.set({"token": fcm_token})
    print(f"FCM Token saved for user {user_id}")

# Firestore에서 FCM 토큰 가져오는 함수
def get_fcm_token(user_id):
    # 사용자 ID로 FCM 토큰 가져오기
    token_ref = db.collection("fcmTokens").document(user_id)
    token_doc = token_ref.get()

    if token_doc.exists:
        return token_doc.to_dict()['token']
    else:
        return None  # 토큰이 없을 경우
