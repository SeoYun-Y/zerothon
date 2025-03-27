const express = require('express');
const { db } = require('./firebase_init');
const challengeRouter = require('./challenge_detail');
const proofRouter = require('./proof_upload');
const approvalRouter = require('./proof_approval');
const { sendWeatherAlert } = require('./weather_alert');
const bodyParser = require('body-parser');
const proofUploadRouter = require('./proof_upload');  // proof_upload 라우터 import


const app = express();

// 미들웨어 설정
app.use(express.json()); // JSON 본문 파싱을 위한 미들웨어
app.use(bodyParser.json());  // JSON 본문 파싱을 위한 미들웨어


// 📍 라우터 등록 (하나 이상 등록 가능)
app.use('/api/challenges', challengeRouter);
app.use('/api/proofs', proofRouter);
app.use('/api/approvals', approvalRouter);
app.use('/api/proofs', proofUploadRouter);

// 기본 GET 요청
app.get('/', (req, res) => {
  res.json({ message: '🚀 백엔드 서버 작동 중입니다!' });
});

// Firestore 테스트 API
app.get('/test', async (req, res) => {
  try {
    await db.collection('test').add({ message: 'Hello Seoyun!', from: 'Express' });
    res.json({ status: '✅ Firestore 연결 성공!' });
  } catch (error) {
    console.error('Firestore 연결 실패:', error);
    res.status(500).json({ error: 'Firestore 연결 실패' });
  }
});

// 날씨 알림 보내기 API
app.post('/send_weather_alert', async (req, res) => {
  const { user_id } = req.body; // 요청 본문에서 user_id 받기
  if (!user_id) {
    return res.status(400).json({ error: 'user_id는 필수입니다.' });
  }

  try {
    const response = await sendWeatherAlert(user_id);
    res.json(response);
  } catch (error) {
    console.error('날씨 알림 전송 실패:', error);
    res.status(500).json({ error: '날씨 알림 전송 실패' });
  }
});

// 서버 실행
app.listen(3000, () => {
  console.log('서버가 3000번 포트에서 실행 중입니다!');
});
