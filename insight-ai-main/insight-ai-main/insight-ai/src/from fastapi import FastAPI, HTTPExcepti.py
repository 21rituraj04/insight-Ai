from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import re
from transformers import pipeline
from collections import Counter
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "AIzaSyCK0vf7PQdEXxedD54NLJEi11n3hRXhk5A"

# -------- LOAD MODEL ONCE --------
logger.info("Loading sentiment model...")
sentiment_model = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment",
    truncation=True,
    max_length=512
)

logger.info("Model loaded.")

executor = ThreadPoolExecutor(max_workers=1)


# -------- HELPERS --------
def clean_comment(text):
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    text = text.strip()
    if not re.match(r"^[A-Za-z\s]+$", text):
        return None
    return text if len(text) > 3 else None


def fetch_comments(video_id: str):
    url = "https://www.googleapis.com/youtube/v3/commentThreads"
    comments = []
    next_page_token = None
    video_owner_id = None

    for i in range(4):
        params = {
            "part": "snippet",
            "videoId": video_id,
            "maxResults": 50,
            "key": API_KEY
        }

        if next_page_token:
            params["pageToken"] = next_page_token

        resp = requests.get(url, params=params, timeout=10)

        if resp.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail=f"YouTube API error {resp.status_code}"
            )

        data = resp.json()

        if "items" not in data:
            raise HTTPException(
                status_code=404,
                detail="No comments found"
            )

        if i == 0:
            try:
                video_owner_id = data["items"][0]["snippet"]["topLevelComment"]["snippet"]["authorChannelId"]["value"]
            except:
                video_owner_id = None

        for item in data.get("items", []):
            snippet = item["snippet"]["topLevelComment"]["snippet"]
            author_id = snippet.get("authorChannelId", {}).get("value")

            if video_owner_id and author_id == video_owner_id:
                continue

            cleaned = clean_comment(snippet["textDisplay"])
            if cleaned:
                comments.append(cleaned)

        next_page_token = data.get("nextPageToken")
        if not next_page_token:
            break

    return comments


# -------- FAST ANALYSIS --------
def run_analysis(comments: list):
    comments = comments[:40]  # ⚡ reduced load

    label_map = {
        "LABEL_0": "Negative",
        "LABEL_1": "Neutral",
        "LABEL_2": "Positive"
    }

    logger.info(f"Running fast sentiment on {len(comments)} comments...")

    try:
        sentiment_results = sentiment_model(
            comments,
            batch_size=32,
            truncation=True
        )
    except Exception as e:
        logger.error(f"Sentiment failed: {e}")
        sentiment_results = [{"label": "LABEL_1", "score": 0.5}] * len(comments)

    results = []

    for comment, sent in zip(comments, sentiment_results):
        try:
            sentiment = label_map.get(sent["label"], "Neutral")
            confidence = round(sent["score"], 3)

            # 🔥 FAST topic detection
            c = comment.lower()
            if "price" in c or "cost" in c:
                topic = "Price"
            elif "delivery" in c or "late" in c or "shipping" in c:
                topic = "Delivery"
            elif "quality" in c or "good" in c or "bad" in c:
                topic = "Quality"
            else:
                topic = "General"

            results.append({
                "comment": comment,
                "sentiment": sentiment,
                "confidence": confidence,
                "topic": topic
            })

        except Exception as e:
            logger.warning(f"Skipped comment: {e}")
            continue

    logger.info(f"Analysis complete: {len(results)} results")
    return results


class VideoRequest(BaseModel):
    video_id: str


@app.post("/analyze")
async def analyze_video(request: VideoRequest):
    video_id = request.video_id
    logger.info(f"Request received for video: {video_id}")

    try:
        comments = fetch_comments(video_id)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Fetch failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch comments")

    if not comments:
        return {
            "video_id": video_id,
            "total_comments": 0,
            "results": [],
            "insights": ["No valid comments found"]
        }

    loop = asyncio.get_event_loop()
    results = await loop.run_in_executor(executor, run_analysis, comments)

    sentiments = [r["sentiment"] for r in results]
    topics = [r["topic"] for r in results]

    sent_count = Counter(sentiments)
    topic_count = Counter(topics)

    total = len(results)
    pos_pct = round(sent_count.get("Positive", 0) / total * 100) if total else 0
    neg_pct = round(sent_count.get("Negative", 0) / total * 100) if total else 0

    insights = []

    if neg_pct > pos_pct:
        insights.append(f"⚠️ Customers are mostly dissatisfied ({neg_pct}% negative)")
    else:
        insights.append(f"✅ Customers are generally satisfied ({pos_pct}% positive)")

    if topic_count:
        top_topic = topic_count.most_common(1)[0][0]
        insights.append(f"💬 Most discussed topic: {top_topic}")

    neg_topics = [r["topic"] for r in results if r["sentiment"] == "Negative"]
    if neg_topics:
        issue = Counter(neg_topics).most_common(1)[0][0]
        insights.append(f"🚨 Major complaint area: {issue}")

    return {
        "video_id": video_id,
        "total_comments": len(results),
        "results": results,
        "insights": insights
    }