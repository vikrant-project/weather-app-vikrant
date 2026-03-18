# 🌤️ Weather App - Real-time Weather Forecast Application

A beautiful, modern weather application that provides real-time weather data, 5-day forecasts, and dynamic backgrounds that change based on weather conditions. Built with Flask and vanilla CSS featuring stunning glassmorphism design.

![Weather App Banner](https://via.placeholder.com/1200x300/f093fb/ffffff?text=Weather+App+-+Real-time+Forecasts)

## 🎯 Project Overview

The **Weather App** is a full-stack web application that delivers accurate weather information for any city worldwide. With its intuitive interface, animated weather effects, and responsive design, users can easily check current conditions and upcoming forecasts. The app features automatic location detection, search history, and theme customization.

## ✨ Key Features

### 🔍 Weather Search
- **Search by City Name** - Find weather for any city worldwide
- **Auto Location Detection** - Use browser geolocation to get local weather instantly
- **Recent Searches** - Quick access to last 5 searched cities
- **Intelligent Error Handling** - Clear messages for invalid cities or API issues

### 🌡️ Weather Display
- **Current Temperature** - Large, easy-to-read temperature display
- **Celsius/Fahrenheit Toggle** - Switch between temperature units instantly
- **Feels Like Temperature** - Real feel temperature display
- **Weather Conditions** - Clear descriptions (Sunny, Cloudy, Rainy, etc.)
- **Animated Weather Icons** - Beautiful emoji-based weather icons
- **Detailed Metrics** - Humidity, wind speed, sunrise, and sunset times

### 📅 5-Day Forecast
- **Daily Forecasts** - See weather predictions for the next 5 days
- **High/Low Temperatures** - Daily temperature ranges
- **Weather Icons** - Visual representation of each day's conditions
- **Horizontal Scroll Cards** - Beautiful card-based forecast display

### 🎨 Visual Experience
- **Dynamic Backgrounds** - Background changes based on weather conditions:
  - ☀️ Clear/Sunny → Warm orange/yellow gradient
  - ☁️ Cloudy → Cool gray/blue gradient
  - 🌧️ Rainy → Deep blue gradient with rain animation
  - ❄️ Snowy → White/light blue gradient with snow animation
  - 🌙 Night → Dark navy/purple gradient
  - ⛈️ Thunderstorm → Dark gray with dramatic effect
- **Glassmorphism Design** - Modern frosted glass effect cards
- **Smooth Animations** - Fade-in effects, floating icons, and hover animations
- **Weather Animations** - Rain drops falling, snow flakes, and cloud movements

### 🌓 Theme Customization
- **Dark/Light Mode Toggle** - Manual theme switch button
- **Auto System Detection** - Automatically matches your system theme
- **Persistent Preference** - Remembers your theme choice

### 📱 Responsive Design
- **Mobile Friendly** - Fully responsive on all devices
- **Tablet Optimized** - Perfect layout for medium screens
- **Desktop Enhanced** - Beautiful full-screen experience

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask (Python 3.8+)
- **HTTP Client**: Requests library
- **API**: OpenWeatherMap API (free tier)

### Frontend
- **HTML5** - Semantic markup
- **Vanilla CSS3** - No frameworks, pure custom styling
  - Glassmorphism effects
  - CSS Grid & Flexbox
  - Custom animations
  - Media queries for responsiveness
- **Vanilla JavaScript** - No libraries
  - Fetch API for HTTP requests
  - LocalStorage for data persistence
  - Geolocation API
  - System theme detection

### APIs
- **OpenWeatherMap API**
  - Current Weather Data API
  - 5 Day / 3 Hour Forecast API
  - Free tier (1000 calls/day)

## 📂 Project Structure

```
weather-app/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── README.md               # This file
├── .gitignore              # Git ignore rules
├── static/
│   ├── style.css           # All CSS styles and animations
│   └── script.js           # All JavaScript functionality
└── templates/
    └── index.html          # Main HTML page
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Internet connection
- OpenWeatherMap API key (free)

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd weather-app
```

### Step 2: Get Your Free API Key

1. **Go to OpenWeatherMap**
   - Visit: https://openweathermap.org/api

2. **Create Account**
   - Click "Sign Up" and create a free account
   - Verify your email address

3. **Get API Key**
   - Log in to your account
   - Go to "API keys" section in your profile
   - Copy your default API key (or create a new one)
   - **Note**: New API keys may take 10-15 minutes to activate

4. **Add API Key to App**
   - Open `app.py` in a text editor
   - Find the line: `API_KEY = "YOUR_API_KEY_HERE"`
   - Replace `YOUR_API_KEY_HERE` with your actual API key
   - Save the file

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- Flask - Web framework
- Requests - HTTP library for API calls
- Werkzeug - WSGI utility library

### Step 4: Run the Application
```bash
python app.py
```

You should see:
```
🌤️  Weather App Starting...

📍 Access the app at: http://localhost:5000

✅ API key configured
```

### Step 5: Open in Browser
- Navigate to: `http://localhost:5000`
- The app will load with New Delhi weather by default
- Start searching for your city!

## 🎯 Usage Guide

### Searching for Weather
1. **By City Name**:
   - Type city name in the search box
   - Press Enter or click Search button
   - Examples: "London", "Tokyo", "New York"

2. **By Location**:
   - Click the 📍 location button
   - Allow location access when prompted
   - Weather for your current location will display

3. **Using Recent Searches**:
   - Click any city chip below the search bar
   - Instantly loads that city's weather

### Changing Temperature Units
- Click **°C** button for Celsius (default)
- Click **°F** button for Fahrenheit
- All temperatures update instantly

### Theme Toggle
- Click the **☀️/🌙** button in the header
- Toggle between light and dark modes
- Your preference is saved automatically

## 🌈 Weather Conditions & Backgrounds

The app dynamically changes its background based on current weather:

| Weather Condition | Background | Animation |
|------------------|------------|------------|
| ☀️ Clear/Sunny (Day) | Warm orange/yellow gradient | Floating sun icon |
| 🌙 Clear (Night) | Dark navy/purple gradient | Floating moon icon |
| ☁️ Cloudy | Cool gray/blue gradient | Moving clouds |
| 🌧️ Rainy | Deep blue gradient | Falling rain drops |
| 🌦️ Drizzle | Light blue gradient | Light rain effect |
| ⛈️ Thunderstorm | Dark gray | Lightning effect |
| ❄️ Snowy | White/light blue gradient | Falling snowflakes |
| 🌫️ Mist/Fog | Gray gradient | Foggy overlay |

## 🐛 Troubleshooting

### "API key not configured" Error
**Problem**: You see this error when searching for weather

**Solution**:
1. Make sure you've added your API key to `app.py`
2. Replace `YOUR_API_KEY_HERE` with your actual key
3. Restart the Flask server

### "City not found" Error
**Problem**: Search returns city not found

**Solution**:
1. Check spelling of city name
2. Try with country name: "Paris, FR"
3. Use major city names (avoid small towns)

### API Key Not Working
**Problem**: Valid API key but still getting errors

**Solution**:
1. New API keys take 10-15 minutes to activate
2. Wait and try again
3. Check if you've exceeded free tier limit (1000 calls/day)

### Location Detection Not Working
**Problem**: Location button doesn't work

**Solution**:
1. Make sure you're using HTTPS or localhost
2. Allow location permissions in browser
3. Check browser console for errors

### App Not Loading
**Problem**: Server starts but page doesn't load

**Solution**:
```bash
# Check if port 5000 is already in use
python app.py

# Try a different port
# Edit app.py and change port in last line
app.run(debug=True, host='0.0.0.0', port=5001)
```

## 📝 API Documentation

### Endpoints

#### Get Weather by City
```
GET /api/weather/city/<city_name>
```

**Response Example**:
```json
{
  "city": "New Delhi",
  "country": "IN",
  "temperature": 25,
  "feels_like": 27,
  "humidity": 60,
  "wind_speed": 15.5,
  "description": "Clear Sky",
  "main": "Clear",
  "icon": "01d",
  "sunrise": "06:30",
  "sunset": "18:45",
  "forecast": [...]
}
```

#### Get Weather by Coordinates
```
GET /api/weather/coordinates?lat=<latitude>&lon=<longitude>
```

## 🔒 Privacy & Data

- **No User Data Stored**: The app doesn't store any personal information
- **Local Storage Only**: Recent searches stored locally in browser
- **Location Privacy**: Location data only used for weather API call
- **No Tracking**: No analytics or tracking scripts

## 🚀 Future Enhancements

- [ ] Hourly forecast display
- [ ] Weather alerts and warnings
- [ ] Air quality index
- [ ] UV index display
- [ ] Weather radar map
- [ ] Multiple location favorites
- [ ] Weather widgets
- [ ] PWA support for mobile installation
- [ ] Share weather on social media

## 👨‍💻 About the Developer

**Vikrant Rana**
- 🎓 BCA Aspirant
- 📍 Location: Delhi, India
- 💼 Role: Full Stack Developer
- 🎯 Passion: Building beautiful and functional web applications

This project was developed to showcase full-stack development skills, API integration, responsive design, and modern UI/UX practices using vanilla technologies.

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- **OpenWeatherMap** - For providing free weather API
- **Google Fonts** - Inter and Poppins font families
- **Flask Community** - For the excellent web framework
- **Python Community** - For amazing tools and libraries

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify your API key is correctly configured
3. Check browser console for JavaScript errors
4. Ensure you have a stable internet connection

## 🌟 Features Showcase

### Beautiful Glassmorphism UI
Modern frosted glass effect with backdrop blur and transparency

### Smooth Animations
- Fade-in effects when loading data
- Floating weather icons
- Hover effects on cards
- Rain and snow animations

### Smart Theme System
- Auto-detects system preference
- Manual override option
- Smooth theme transitions
- Persistent across sessions

### Responsive Everywhere
- Mobile-first approach
- Touch-friendly buttons
- Optimized for all screen sizes
- Works on any device

---

**Built with ❤️ by Vikrant Rana | © 2024 Weather App**

*Get accurate weather forecasts anytime, anywhere!* 🌤️
