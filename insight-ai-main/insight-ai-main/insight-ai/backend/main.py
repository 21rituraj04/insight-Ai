from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import re
from transformers import pipeline
from collections import Counter
import asyncio
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()

# -------- CORS --------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "AIzaSyCK0vf7PQdEXxedD54NLJEi11n3hRXhk5A"

# -------- MODELS --------
sentiment_model = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment"
)

emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base"
)

executor = ThreadPoolExecutor(max_workers=1)

# -------- CLEANING (FIXED) --------
def clean_comment(text):
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"[^a-zA-Z\s.,!?']", "", text)  # less strict
    text = text.strip()
    return text if len(text) > 3 else None


# -------- FETCH COMMENTS --------
def fetch_comments(video_id):
    url = "https://www.googleapis.com/youtube/v3/commentThreads"
    comments = []
    next_page = None

    for _ in range(3):
        params = {
            "part": "snippet",
            "videoId": video_id,
            "maxResults": 50,
            "key": API_KEY
        }

        if next_page:
            params["pageToken"] = next_page

        res = requests.get(url, params=params)
        data = res.json()

        for item in data.get("items", []):
            text = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
            cleaned = clean_comment(text)
            if cleaned:
                comments.append(cleaned)

        next_page = data.get("nextPageToken")
        if not next_page:
            break

    return comments


# -------- ANALYSIS --------
def run_analysis(comments):
    if not comments:
        return []   # ✅ prevents crash

    comments = comments[:40]

    label_map = {
        "LABEL_0": "Negative",
        "LABEL_1": "Neutral",
        "LABEL_2": "Positive"
    }

    try:
        sentiment_results = sentiment_model(comments, batch_size=32)
        emotion_results = emotion_model(comments, batch_size=32)
    except:
        return []

    results = []

    for comment, sent, emo in zip(comments, sentiment_results, emotion_results):

        sentiment = label_map.get(sent["label"], "Neutral")
        confidence = round(sent["score"], 3)
        emotion = emo["label"]

        # -------- SMART LOGIC --------
        if emotion in ["sadness", "fear"]:
            sentiment = "Negative"
        elif emotion == "joy":
            sentiment = "Positive"
        elif confidence < 0.6:
            sentiment = "Neutral"

        # -------- TOPIC --------
        c = comment.lower()
        if "price" in c:
            topic = "Price"
        elif "delivery" in c or "late" in c:
            topic = "Delivery"
        elif "quality" in c:
            topic = "Quality"
        else:
            topic = "General"

        results.append({
            "comment": comment,
            "sentiment": sentiment,
            "confidence": confidence,
            "emotion": emotion,
            "topic": topic
        })

    return results


# -------- API --------
class VideoRequest(BaseModel):
    video_id: str


@app.post("/analyze")
async def analyze_video(request: VideoRequest):

    comments = fetch_comments(request.video_id)

    if not comments:
        return {
            "results": [],
            "insights": ["No valid comments found"]
        }

    loop = asyncio.get_event_loop()
    results = await loop.run_in_executor(executor, run_analysis, comments)

    sentiments = [r["sentiment"] for r in results]
    count = Counter(sentiments)

    insights = [
        f"Positive: {count.get('Positive',0)}",
        f"Negative: {count.get('Negative',0)}",
        f"Neutral: {count.get('Neutral',0)}"
    ]

    return {
        "results": results,
        "insights": insights
    }