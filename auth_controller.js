const admin = require('firebase-admin');

// 사용자의 Firebase 토큰을 검증하고 uid 반환
const verifyToken = async (idToken) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (e) {
    console.error('🚫 유효하지 않은 토큰:', e);
    return null;
  }
};

module.exports = { verifyToken };
