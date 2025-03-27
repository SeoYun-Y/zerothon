import firebase_admin
from firebase_admin import credentials, firestore, storage, auth

# 서비스 계정 키로 초기화
cred = credentials.Certificate("firebase_credentials.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'your-project-id.appspot.com'  # 콘솔에서 확인
})

# 사용할 서비스 객체들
db = firestore.client()
bucket = storage.bucket()

