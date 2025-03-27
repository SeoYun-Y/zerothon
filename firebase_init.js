const admin = require('firebase-admin');
const serviceAccount = require('./firebase_credentials.json');

// Firebase 인증
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'weatherhero-debaf.firebasestorage.app',  // 정확한 버킷명
  });
} else {
  console.log('Firebase app already initialized.');
}

// Firestore, Storage 초기화
const db = admin.firestore();
const bucket = admin.storage().bucket();

// FCM 메시지 전송 함수
const sendPushNotification = async (token, title, body) => {
  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return { status: 'success', message_id: response };
  } catch (e) {
    console.error('Error sending message:', e);
    return { status: 'fail', error: e.message };
  }
};

// FCM 토큰을 Firestore에 저장하는 함수
const saveFcmToken = async (userId, fcmToken) => {
  const userRef = db.collection('fcmTokens').doc(userId);
  await userRef.set({ token: fcmToken });
  console.log(`FCM Token saved for user ${userId}`);
};

// Firestore에서 FCM 토큰 가져오는 함수
const getFcmToken = async (userId) => {
  const tokenRef = db.collection('fcmTokens').doc(userId);
  const tokenDoc = await tokenRef.get();

  if (tokenDoc.exists) {
    return tokenDoc.data().token;
  } else {
    return null;  // 토큰이 없을 경우
  }
};

module.exports = { db, bucket, sendPushNotification, saveFcmToken, getFcmToken };
