"""
AI Travel Planner – Flask backend
---------------------------------
• Gemini 1.5 Flash (/api/generate)
• Amadeus Hotel Offers (/api/hotels)
• Aviationstack Flight Search (/api/flights) – free‑tier fallback
• MongoDB Destination Fetch (/api/destinations/<name>, /api/destinations)
"""

import os, time, traceback, requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from pymongo import MongoClient
from bson.objectid import ObjectId
from urllib.parse import unquote

# ─── Load env & DB Config ───────────────────────────────────────────────
load_dotenv()
GEMINI_API_KEY        = os.getenv("GEMINI_API_KEY")
AMADEUS_CLIENT_ID     = os.getenv("AMADEUS_CLIENT_ID")
AMADEUS_CLIENT_SECRET = os.getenv("AMADEUS_CLIENT_SECRET")
AVIATIONSTACK_KEY     = os.getenv("AVIATIONSTACK_KEY")
MONGO_URI             = os.getenv("MONGO_URI", "mongodb://localhost:27017")
AVIATIONSTACK_BASE    = "http://api.aviationstack.com"

mongo     = MongoClient(MONGO_URI)
db        = mongo["travel_planner"]
destinations_col = db["destinations"]

# ─── Flask Setup ────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

# ─── Gemini Config ──────────────────────────────────────────────────────
try:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")
except Exception as e:
    print("⚠️  Gemini init failed:", e)
    gemini_model = None

def _strip_code_fences(t: str) -> str:
    return t.replace("```json", "").replace("```", "").strip()

# ─── Amadeus Token Cache ────────────────────────────────────────────────
_amad_token, _amad_exp = None, 0
def _amad_token_get():
    global _amad_token, _amad_exp
    if _amad_token and time.time() < _amad_exp - 60:
        return _amad_token
    r = requests.post(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        data={
            "grant_type": "client_credentials",
            "client_id": AMADEUS_CLIENT_ID,
            "client_secret": AMADEUS_CLIENT_SECRET
        }, timeout=15
    )
    r.raise_for_status()
    j = r.json()
    _amad_token = j["access_token"]
    _amad_exp = time.time() + j.get("expires_in", 1800)
    return _amad_token

# ─── Gemini Endpoint ────────────────────────────────────────────────────
@app.route("/api/generate", methods=["POST"])
def generate():
    b = request.get_json() or {}
    prompt = (b.get("prompt") or "").strip()
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400
    if not gemini_model:
        return jsonify({"error": "Gemini unavailable"}), 500
    try:
        res  = gemini_model.generate_content(prompt)
        text = res.text if res and res.text else "No response."
        return jsonify({"reply": _strip_code_fences(text)})
    except Exception as exc:
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500

# ─── Hotel Search via Amadeus ───────────────────────────────────────────
@app.route("/api/hotels", methods=["POST"])
def hotels():
    b = request.get_json() or {}
    city = b.get("cityCode")
    cin  = b.get("checkInDate")
    cout = b.get("checkOutDate")
    adults = b.get("adults", 1)
    if not all([city, cin, cout]):
        return jsonify({"error": "cityCode, checkInDate, checkOutDate required"}), 400
    try:
        token = _amad_token_get()
        headers = {"Authorization": f"Bearer {token}"}
        # Step 1: Hotel IDs
        lst = requests.get(
            "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city",
            headers=headers, params={"cityCode": city}, timeout=15
        )
        lst.raise_for_status()
        hotel_ids = [d["hotelId"] for d in lst.json().get("data", [])][:5]
        if not hotel_ids:
            return jsonify({"error": "No hotels found"}), 404
        # Step 2: Offers
        offers = requests.get(
            "https://test.api.amadeus.com/v3/shopping/hotel-offers",
            headers=headers,
            params={
                "hotelIds": ",".join(hotel_ids),
                "checkInDate": cin,
                "checkOutDate": cout,
                "adults": adults,
                "roomQuantity": 1,
                "bestRateOnly": "true",
                "currency": "USD",
                "sort": "PRICE"
            }, timeout=15
        )
        offers.raise_for_status()
        return jsonify(offers.json())
    except requests.HTTPError as he:
        traceback.print_exc()
        return jsonify({"error": he.response.text}), he.response.status_code
    except Exception as exc:
        traceback.print_exc()
        return jsonify({"error": str(exc)}), 500

# ─── Flight Search via Aviationstack ────────────────────────────────────
@app.route("/api/flights", methods=["POST", "GET"])
def flights():
    if not AVIATIONSTACK_KEY:
        return jsonify({"error": "AVIATIONSTACK_KEY missing"}), 500
    src = request.args if request.method == "GET" else (request.get_json() or {})
    params_full = {
        "access_key": AVIATIONSTACK_KEY,
        "dep_iata": src.get("dep_iata"),
        "arr_iata": src.get("arr_iata"),
        "flight_date": src.get("flight_date"),
        "flight_number": src.get("flight_number"),
        "limit": 20
    }
    params_full = {k: v for k, v in params_full.items() if v}
    if len(params_full) <= 1:
        return jsonify({"error": "Provide dep_iata, arr_iata, or flight_number"}), 400

    def call(p):
        r = requests.get(f"{AVIATIONSTACK_BASE}/v1/flights", params=p, timeout=15)
        try:
            return r.status_code, r.json()
        except ValueError:
            return r.status_code, {"error": r.text}

    status, body = call(params_full)
    if status == 403 and isinstance(body, dict) and body.get("error", {}).get("code") == "function_access_restricted":
        minimal = {"access_key": AVIATIONSTACK_KEY, "limit": 20}
        for k in ("flight_number", "dep_iata", "arr_iata"):
            if k in params_full:
                minimal[k] = params_full[k]
                break
        status, body = call(minimal)
    return jsonify(body), status

# ─── Fetch All Destinations ─────────────────────────────────────────────
@app.route("/api/destinations", methods=["GET"])
def get_all_destinations():
    try:
        destinations = list(destinations_col.find({}, {"_id": 0}))
        return jsonify(destinations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── Fetch Destination by Name ──────────────────────────────────────────
@app.route("/api/destinations/<string:name>", methods=["GET"])
def get_destination(name):
    doc = destinations_col.find_one({"name": name})
    if not doc:
        return jsonify({"error": "Destination not found"}), 404
    return jsonify({
        "id": str(doc.get("_id")),
        "name": doc.get("name"),
        "heroImage": doc.get("heroImage"),
        "tagline": doc.get("tagline"),
        "overview": doc.get("overview"),
        "topAttractions": doc.get("topAttractions", []),
        "bestTimeToVisit": doc.get("bestTimeToVisit"),
        "recommendedDuration": doc.get("recommendedDuration"),
        "localTips": doc.get("localTips", []),
        "weatherSummary": doc.get("weatherSummary", {}),
        "currency": doc.get("currency"),
        "language": doc.get("language"),
        "googleMapEmbed": doc.get("googleMapEmbed")
    })
    
@app.route("/api/tours", methods=["GET"])
def get_all_tours():
    all_tours = list(db["tours"].find({}, {"_id": 0}))  # Exclude _id for frontend unless needed
    return jsonify(all_tours)

@app.route("/api/tours/<string:name>", methods=["GET"])
def get_tour_by_name(name):
    decoded_name = unquote(name)
    tour = db["tours"].find_one({"name": decoded_name})
    if not tour:
        return jsonify({"error": "Tour not found"}), 404
    return jsonify({
        "id": str(tour.get("_id")),
        "name": tour.get("name"),
        "location": tour.get("location"),
        "image": tour.get("image"),
        "description": tour.get("description"),
        "price": tour.get("price"),
        "duration": tour.get("duration"),
        "highlights": tour.get("highlights", [])
    })
    
# ─── /api/chat ───────────────────────────────────────────────────────────────
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    user_message = data.get("message", "").strip()
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    if not gemini_model:
        return jsonify({"error": "Gemini model unavailable"}), 500

    # System prompt to restrict Gemini to travel-related queries only
    system_prompt = (
        "You are a helpful travel assistant. "
        "Answer only travel-related questions (such as about destinations, flights, hotels, itineraries, visas, packing, transportation, local customs, travel safety, etc). "
        "If the user's question is not related to travel, politely reply: "
        "'I'm designed to answer travel-related questions. Please ask me something about travel.'"
    )

    try:
        # Gemini API expects a conversation; provide system prompt and user message
        full_prompt = (
        "You are a helpful travel assistant. "
        "Answer only travel-related questions (such as about destinations, flights, hotels, itineraries, visas, packing, transportation, local customs, travel safety, etc). "
        "If the user's question is not related to travel, politely reply: "
        "'I'm designed to answer travel-related questions. Please ask me something about travel.'\n\n"
        f"User: {user_message}"
        )
        response = gemini_model.generate_content(full_prompt)
        text = response.text if response and response.text else "No response from Gemini."
        return jsonify({"reply": _strip_code_fences(text)})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ─── Root Endpoint ──────────────────────────────────────────────────────
@app.route("/")
def root():
    return "🌍 AI Travel Planner API is running"

# ─── Main ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
