# 🚀 InsightAI — YouTube Sentiment Analyzer

🔗 Live Demo: https://ppourel.github.io/insight-ai/

---

## ✨ Overview

**InsightAI** is an intelligent web application that analyzes YouTube comments and transforms them into meaningful insights such as:

* 😊 Sentiment (Positive / Negative / Neutral)
* 😤 Emotion detection
* 🏷️ Topic classification
* 📊 Interactive dashboard

No more reading hundreds of comments manually — let AI do the work.

---

## 🔥 Features

✨ **AI-Powered Analysis**

* Sentiment detection using transformer models
* Emotion classification (joy, sadness, fear, etc.)

📊 **Interactive Dashboard**

* Clean UI with dynamic filtering
* KPI cards (Positive / Negative / Neutral)

⚡ **Real-Time Processing**

* Paste YouTube link → Get results instantly

🎯 **Smart Insights**

* Detects topics like:

  * Price 💰
  * Delivery 🚚
  * Quality ⭐

🌙 **Dark Mode Support**

* Toggle between light and dark themes

---

## 🧠 Tech Stack

### Frontend ⚛️

* React
* Chart.js
* Modern CSS

### Backend ⚡

* FastAPI
* Transformers (HuggingFace)
* YouTube Data API

---

## 🖥️ How It Works

```text
1️⃣ Paste YouTube URL  
        ↓  
2️⃣ Extract comments  
        ↓  
3️⃣ Clean & preprocess data  
        ↓  
4️⃣ AI analyzes sentiment + emotion  
        ↓  
5️⃣ Display insights in dashboard  
```

---

## 📦 Installation

### 1. Clone repository

```bash
git clone https://github.com/YOUR_USERNAME/insight-ai.git
cd insight-ai
```

---

### 2. Setup Backend

```bash
pip install -r requirements.txt
```

Create `.env` file:

```env
API_KEY=your_youtube_api_key
```

Run backend:

```bash
uvicorn main:app --reload
```

---

### 3. Setup Frontend

```bash
npm install
npm start
```

---

## 🌐 Deployment

### Frontend

* Deploy on **GitHub Pages**

### Backend

* Deploy on **Render / Railway**

⚠️ Important:
Update API URL in frontend:

```js
fetch("https://your-backend-url.onrender.com/analyze")
```

---

## 🔐 Environment Variables

| Variable | Description          |
| -------- | -------------------- |
| API_KEY  | YouTube Data API key |

---

## 📸 Screenshots (Add your images here)

* Dashboard view
* Sentiment analysis results
* Dark mode

---

## 🚧 Limitations

* Works best with English comments 🇬🇧
* Depends on available YouTube comments
* AI predictions may not always be perfect

---

## 🔮 Future Improvements

* 🌍 Multi-language support
* 📱 Instagram / Facebook integration
* 📄 Export reports (PDF)
* ⚡ Real-time analytics

---

## 👨‍💻 Author

**Purab Pourel**
📍 Assam, India

📧 Email: [purabpourel01@gmail.com](mailto:purabpourel01@gmail.com)

---

## ⭐ Support

If you like this project:

👉 Give it a **star ⭐ on GitHub**
👉 Share with others 🚀

---


