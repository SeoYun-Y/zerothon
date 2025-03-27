const express = require('express');
const { db } = require('./firebase_init');
const { verifyToken } = require('./auth_controller');

const router = express.Router();

router.get('/challenges/:challenge_id', async (req, res) => {
  try {
    const { challenge_id } = req.params;
    const idToken = req.headers['authorization'];  // 요청 헤더에서 Firebase ID 토큰 가져오기

    if (!idToken) {
      return res.status(400).json({ error: '토큰이 없습니다.' });
    }

    const userId = await verifyToken(idToken);
    if (!userId) {
      return res.status(400).json({ error: '유효하지 않은 토큰입니다.' });
    }

    // 챌린지 문서 불러오기
    const challengeRef = db.collection('challenges').doc(challenge_id);
    const doc = await challengeRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: '챌린지를 찾을 수 없습니다.' });
    }

    const challengeData = doc.data();

    // 사용자가 참여했는지 확인
    const querySnapshot = await db.collection('participations')
      .where('userID', '==', userId)
      .where('challengeID', '==', challenge_id)
      .get();

    const participated = !querySnapshot.empty;  // 참여 여부 확인

    return res.status(200).json({
      challenge: challengeData,
      participated: participated
    });

  } catch (error) {
    console.error('Error fetching challenge:', error);
    return res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
