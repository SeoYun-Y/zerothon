# 🌱 EcoSeed Backend (zerothon)

> "EcoSeed" 앱의 백엔드 서버. 사용자 인증 검증, 챌린지 조회, 인증(Proof) 업로드, 날씨 기반 푸시 알림 API를 제공합니다.
> Flutter 프론트엔드(EcoSeed 앱)와 연동되며, Flutter 쪽 UI 연결 및 디자인 반영도 함께 담당했습니다.

## 📖 프로젝트 소개

EcoSeed는 날씨에 따라 실천 가능한 친환경 챌린지를 추천하고, 인증 사진을 업로드하면 포인트를 적립하는 앱입니다. 이 리포지토리는 그중 **백엔드 서버**로, Firebase 기반 인증/데이터 처리와 날씨 API 연동을 담당합니다.

## 🙋‍♀️ 담당 역할

- **백엔드 서버 개발** (본 리포지토리 전체): Express 기반 API 설계, Firebase Admin SDK 연동, Firestore/Storage 데이터 처리
- **Flutter 프론트엔드 UI 구현**: 디자이너가 전달한 디자인 시안을 바탕으로 실제 화면 구현 및 백엔드 API 연동 ([zerotonpj_ 리포지토리](https://github.com/SeoYun-Y/zerotonpj_) 참고)

## 🛠️ 기술 스택

- **Node.js + Express** — REST API 서버
- **Firebase Admin SDK** — 서버 측 인증 토큰 검증, Firestore/Storage 접근
- **Firebase Firestore** — 챌린지/참여/인증 데이터 저장
- **Firebase Cloud Storage** — 인증 사진 업로드
- **Firebase Cloud Messaging (FCM)** — 날씨 기반 푸시 알림
- **OpenWeatherMap API** — 실시간 날씨 데이터
- **Multer** — multipart/form-data 파일 업로드 처리

## 🏗️ 아키텍처 & API 구조

```
[Flutter App]
     │  (Firebase ID Token 포함 요청)
     ▼
[Express Server : 3000]
     ├─ GET  /api/challenges/:challenge_id     → 챌린지 상세 조회 + 참여 여부 확인
     ├─ POST /api/proofs                       → 인증 사진 업로드 (Storage + Firestore)
     ├─ POST /api/approvals                    → 인증 승인 처리
     └─ POST /send_weather_alert               → 날씨 기반 FCM 푸시 발송
     │
     ├─ Firebase Admin SDK → Firestore (challenges, participations, proofs, fcmTokens)
     ├─ Firebase Storage → 인증 사진 저장
     └─ OpenWeatherMap API → 날씨 데이터 조회
```

### 인증 흐름
클라이언트가 요청 헤더(`Authorization`)에 Firebase ID Token을 담아 보내면, 서버는 `admin.auth().verifyIdToken()`으로 토큰을 검증하고 `uid`를 추출해 이후 로직에 사용합니다. (`auth_controller.js`)

### 주요 기능

**챌린지 상세 조회** (`challenge_detail.js`)
- 토큰 검증 → Firestore에서 챌린지 문서 조회
- `participations` 컬렉션을 `userID` + `challengeID`로 조회해 참여 여부 판별 후 함께 응답

**인증(Proof) 업로드** (`proof_upload.js`)
- `multer`로 이미지 파일을 메모리에서 받아 UUID 파일명으로 Firebase Storage에 업로드
- 업로드된 이미지 URL과 함께 `proofs` 컬렉션에 문서 생성 (기본 상태: `pending`)

**날씨 기반 푸시 알림** (`weather_alert.js`)
- OpenWeatherMap에서 현재 날씨 조회 → 날씨 설명에 따라 알림 메시지 분기 생성
- Firestore에 저장된 사용자 FCM 토큰으로 푸시 발송

## 📁 Firestore 컬렉션 구조

```
challenges      # 챌린지 정보
participations  # userID + challengeID로 참여 여부 판별
proofs          # userID, challengeID, content, image_url, status(pending/승인)
fcmTokens       # userID → FCM 토큰 매핑 (푸시 알림용)
```


## 🚀 향후 개선 사항

- 인증 승인/반려 API 실제 구현 (관리자 권한 체크 포함)
- API 키/Firebase 인증정보 환경 변수(.env)로 분리
- 에러 핸들링 및 입력값 유효성 검사 강화

## 📦 실행 방법

```bash
npm install
node server.js
# http://localhost:3000 에서 서버 실행
```

> ⚠️ `firebase_credentials.json` (Firebase 서비스 계정 키)이 별도로 필요합니다. 보안상 저장소에 포함되어 있지 않으므로 Firebase 콘솔에서 발급받아 루트 경로에 추가해야 합니다.
