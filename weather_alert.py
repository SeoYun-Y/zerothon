from firebase_init import get_fcm_token, send_push_notification
import requests

# 날씨 API에서 날씨 정보 가져오기
def get_weather():
    api_key = 'your_api_key'  # OpenWeatherMap API 키
    city = 'Seoul'  # 원하는 도시
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
    
    response = requests.get(url)
    if response.status_code == 200:
        weather_data = response.json()
        return weather_data
    else:
        print("날씨 데이터를 가져오는 데 실패했습니다.")
        return None

# 날씨에 맞는 푸시 알림 보내기
def send_weather_alert(user_id):
    weather_data = get_weather()
    
    if weather_data:
        description = weather_data['weather'][0]['description']
        temperature = weather_data['main']['temp']
        
        # 날씨에 맞는 알림 내용
        if 'clear' in description:
            message = f"오늘 날씨 맑아요 🌞 기온은 {temperature}°C입니다."
        elif 'cloud' in description:
            message = f"오늘 날씨 흐려요 ☁️ 기온은 {temperature}°C입니다."
        else:
            message = f"오늘 날씨는 {description}입니다. 기온은 {temperature}°C입니다."
        
        # Firestore에서 FCM 토큰 가져오기
        fcm_token = get_fcm_token(user_id)
        
        if fcm_token:
            # FCM 메시지 전송
            response = send_push_notification(fcm_token, "오늘의 날씨 알림", message)
            return response
        else:
            return {"status": "fail", "message": "FCM 토큰을 찾을 수 없습니다."}
    return {"status": "fail", "message": "날씨 정보를 가져올 수 없습니다."}
