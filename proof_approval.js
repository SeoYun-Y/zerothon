const express = require('express');
const multer = require('multer');
const { db, bucket } = require('./firebase_init');
const uuid = require('uuid');

// multer 설정: 업로드 파일 처리
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// 인증글 업로드 API
router.post('/', upload.single('file'), async (req, res) => {
  const { user_id, challenge_id, content } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: '파일이 필요합니다.' });
  }

  try {
    // ✅ 1. 파일명 만들고 Storage에 업로드
    const filename = `proofs/${uuid.v4()}.jpg`;  // 고유 파일명 생성
    const blob = bucket.file(filename);

    // Firebase Storage에 파일 업로드
    await blob.save(file.buffer, { contentType: file.mimetype });
    const imageUrl = blob.publicUrl();  // 업로드된 이미지 URL 가져오기

    // ✅ 2. 인증글을 Firestore에 저장
    await db.collection('proofs').add({
      userID: user_id,
      challengeID: challenge_id,
      content: content,
      image_url: imageUrl,
      status: 'pending'  // 기본 상태: 승인 대기
    });

    return res.status(200).json({
      status: 'success',
      message: '🔥 인증 업로드 성공!',
      image_url: imageUrl
    });

  } catch (error) {
    console.error('❌ 인증 업로드 오류 발생:', error);
    return res.status(500).json({
      status: 'fail',
      message: '🚨 인증 업로드 실패!',
      error: error.message
    });
  }
});

module.exports = router;
