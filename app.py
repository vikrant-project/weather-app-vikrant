from flask import Flask, render_template, jsonify, request
import requests
import os
from datetime import datetime

app = Flask(__name__)

# OpenWeatherMap API Configuration
# Get your free API key from: https://openweathermap.org/api
API_KEY = "YOUR_API_KEY_HERE"  # Replace with your actual API key
BASE_URL = "https://api.openweathermap.org/data/2.5"

@app.route('/')
def index():
    """Render the main weather app page"""
    return render_template('index.html')

@app.route('/api/weather/city/<city_name>')
def get_weather_by_city(city_name):
    """
    Get current weather data for a specific city
    Returns: JSON with weather data or error message
    """
    if API_KEY == "YOUR_API_KEY_HERE":
        return jsonify({
            'error': 'API key not configured',
            'message': 'Please add your OpenWeatherMap API key in app.py. Get it free from https://openweathermap.org/api'
        }), 400
    
    try:
        # Get current weather
        weather_url = f"{BASE_URL}/weather?q={city_name}&appid={API_KEY}&units=metric"
        weather_response = requests.get(weather_url, timeout=10)
        
        if weather_response.status_code == 404:
            return jsonify({
                'error': 'City not found',
                'message': f'Could not find weather data for "{city_name}". Please check the city name and try again.'
            }), 404
        
        if weather_response.status_code != 200:
            return jsonify({
                'error': 'API error',
                'message': 'Failed to fetch weather data. Please try again later.'
            }), weather_response.status_code
        
        weather_data = weather_response.json()
        
        # Get 5-day forecast
        forecast_url = f"{BASE_URL}/forecast?q={city_name}&appid={API_KEY}&units=metric"
        forecast_response = requests.get(forecast_url, timeout=10)
        forecast_data = forecast_response.json() if forecast_response.status_code == 200 else None
        
        # Process forecast data to get daily forecasts
        daily_forecasts = []
        if forecast_data and 'list' in forecast_data:
            # Group by day and take noon forecast
            seen_dates = set()
            for item in forecast_data['list']:
                date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
                time = datetime.fromtimestamp(item['dt']).strftime('%H:%M')
                
                # Take the forecast around noon (12:00)
                if date not in seen_dates and '12:00' in time:
                    seen_dates.add(date)
                    daily_forecasts.append({
                        'date': datetime.fromtimestamp(item['dt']).strftime('%a, %b %d'),
                        'temp': round(item['main']['temp']),
                        'temp_min': round(item['main']['temp_min']),
                        'temp_max': round(item['main']['temp_max']),
                        'description': item['weather'][0]['description'].title(),
                        'icon': item['weather'][0]['icon'],
                        'main': item['weather'][0]['main']
                    })
                    
                    if len(daily_forecasts) >= 5:
                        break
        
        # Format response
        result = {
            'city': weather_data['name'],
            'country': weather_data['sys']['country'],
            'temperature': round(weather_data['main']['temp']),
            'feels_like': round(weather_data['main']['feels_like']),
            'temp_min': round(weather_data['main']['temp_min']),
            'temp_max': round(weather_data['main']['temp_max']),
            'humidity': weather_data['main']['humidity'],
            'pressure': weather_data['main']['pressure'],
            'wind_speed': round(weather_data['wind']['speed'] * 3.6, 1),  # Convert m/s to km/h
            'description': weather_data['weather'][0]['description'].title(),
            'main': weather_data['weather'][0]['main'],
            'icon': weather_data['weather'][0]['icon'],
            'sunrise': datetime.fromtimestamp(weather_data['sys']['sunrise']).strftime('%H:%M'),
            'sunset': datetime.fromtimestamp(weather_data['sys']['sunset']).strftime('%H:%M'),
            'timezone': weather_data['timezone'],
            'forecast': daily_forecasts
        }
        
        return jsonify(result)
    
    except requests.exceptions.Timeout:
        return jsonify({
            'error': 'Request timeout',
            'message': 'The request took too long. Please try again.'
        }), 408
    
    except requests.exceptions.RequestException as e:
        return jsonify({
            'error': 'Network error',
            'message': 'Failed to connect to weather service. Please check your internet connection.'
        }), 500
    
    except Exception as e:
        return jsonify({
            'error': 'Unexpected error',
            'message': str(e)
        }), 500

@app.route('/api/weather/coordinates')
def get_weather_by_coordinates():
    """
    Get current weather data by latitude and longitude
    Query params: lat, lon
    Returns: JSON with weather data or error message
    """
    if API_KEY == "YOUR_API_KEY_HERE":
        return jsonify({
            'error': 'API key not configured',
            'message': 'Please add your OpenWeatherMap API key in app.py'
        }), 400
    
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not lat or not lon:
        return jsonify({
            'error': 'Missing parameters',
            'message': 'Latitude and longitude are required'
        }), 400
    
    try:
        # Get current weather
        weather_url = f"{BASE_URL}/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
        weather_response = requests.get(weather_url, timeout=10)
        
        if weather_response.status_code != 200:
            return jsonify({
                'error': 'API error',
                'message': 'Failed to fetch weather data'
            }), weather_response.status_code
        
        weather_data = weather_response.json()
        
        # Get 5-day forecast
        forecast_url = f"{BASE_URL}/forecast?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
        forecast_response = requests.get(forecast_url, timeout=10)
        forecast_data = forecast_response.json() if forecast_response.status_code == 200 else None
        
        # Process forecast data
        daily_forecasts = []
        if forecast_data and 'list' in forecast_data:
            seen_dates = set()
            for item in forecast_data['list']:
                date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
                time = datetime.fromtimestamp(item['dt']).strftime('%H:%M')
                
                if date not in seen_dates and '12:00' in time:
                    seen_dates.add(date)
                    daily_forecasts.append({
                        'date': datetime.fromtimestamp(item['dt']).strftime('%a, %b %d'),
                        'temp': round(item['main']['temp']),
                        'temp_min': round(item['main']['temp_min']),
                        'temp_max': round(item['main']['temp_max']),
                        'description': item['weather'][0]['description'].title(),
                        'icon': item['weather'][0]['icon'],
                        'main': item['weather'][0]['main']
                    })
                    
                    if len(daily_forecasts) >= 5:
                        break
        
        # Format response
        result = {
            'city': weather_data['name'],
            'country': weather_data['sys']['country'],
            'temperature': round(weather_data['main']['temp']),
            'feels_like': round(weather_data['main']['feels_like']),
            'temp_min': round(weather_data['main']['temp_min']),
            'temp_max': round(weather_data['main']['temp_max']),
            'humidity': weather_data['main']['humidity'],
            'pressure': weather_data['main']['pressure'],
            'wind_speed': round(weather_data['wind']['speed'] * 3.6, 1),
            'description': weather_data['weather'][0]['description'].title(),
            'main': weather_data['weather'][0]['main'],
            'icon': weather_data['weather'][0]['icon'],
            'sunrise': datetime.fromtimestamp(weather_data['sys']['sunrise']).strftime('%H:%M'),
            'sunset': datetime.fromtimestamp(weather_data['sys']['sunset']).strftime('%H:%M'),
            'timezone': weather_data['timezone'],
            'forecast': daily_forecasts
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'error': 'Unexpected error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    print("""\n🌤️  Weather App Starting...\n""")
    print("📍 Access the app at: http://localhost:5000\n")
    
    if API_KEY == "YOUR_API_KEY_HERE":
        print("⚠️  WARNING: API key not configured!")
        print("   Get your free API key from: https://openweathermap.org/api")
        print("   Then update the API_KEY variable in app.py\n")
    else:
        print("✅ API key configured\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
