const axios = require('axios');
const { getFcmToken, sendPushNotification } = require('./firebase_init');

// 날씨 API에서 날씨 정보 가져오기
const getWeather = async () => {
  const apiKey = 'your_api_key';  // OpenWeatherMap API 키
  const city = 'Seoul';  // 원하는 도시
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("날씨 데이터를 가져오는 데 실패했습니다.", error);
    return null;
  }
};

// 날씨에 맞는 푸시 알림 보내기
const sendWeatherAlert = async (userId) => {
  const weatherData = await getWeather();
  
  if (weatherData) {
    const description = weatherData.weather[0].description;
    const temperature = weatherData.main.temp;
    
    // 날씨에 맞는 알림 내용
    let message = '';
    if (description.includes('clear')) {
      message = `오늘 날씨 맑아요 🌞 기온은 ${temperature}°C입니다.`;
    } else if (description.includes('cloud')) {
      message = `오늘 날씨 흐려요 ☁️ 기온은 ${temperature}°C입니다.`;
    } else {
      message = `오늘 날씨는 ${description}입니다. 기온은 ${temperature}°C입니다.`;
    }

    // Firestore에서 FCM 토큰 가져오기
    const fcmToken = await getFcmToken(userId);

    if (fcmToken) {
      // FCM 메시지 전송
      const response = await sendPushNotification(fcmToken, "오늘의 날씨 알림", message);
      return response;
    } else {
      return { status: 'fail', message: 'FCM 토큰을 찾을 수 없습니다.' };
    }
  }

  return { status: 'fail', message: '날씨 정보를 가져올 수 없습니다.' };
};

module.exports = { sendWeatherAlert };
