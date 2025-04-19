# app.py
import os
import time
import traceback
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# ─── Load env ────────────────────────────────────────────────────────────────
load_dotenv()
GEMINI_API_KEY     = os.environ.get("GEMINI_API_KEY")
AMAD_CLIENT_ID     = os.environ.get("AMADEUS_CLIENT_ID")
AMAD_CLIENT_SECRET = os.environ.get("AMADEUS_CLIENT_SECRET")

if not GEMINI_API_KEY:
    print("⚠️  Missing GEMINI_API_KEY in .env")
if not AMAD_CLIENT_ID or not AMAD_CLIENT_SECRET:
    print("⚠️  Missing AMADEUS_CLIENT_ID / _SECRET in .env")

# ─── Flask + CORS ────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

# ─── Gemini Setup ────────────────────────────────────────────────────────────
try:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")
except Exception as e:
    print("Error loading Gemini model:", e)
    gemini_model = None

def remove_code_fences(text: str) -> str:
    return text.replace("```json","").replace("```","").strip()

# ─── Amadeus OAuth2 Cache ────────────────────────────────────────────────────
_amad_token = None
_amad_expires = 0

def get_amadeus_token():
    global _amad_token, _amad_expires
    if _amad_token and time.time() < _amad_expires - 60:
        return _amad_token

    resp = requests.post(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        data={
            "grant_type":    "client_credentials",
            "client_id":     AMAD_CLIENT_ID,
            "client_secret": AMAD_CLIENT_SECRET
        }
    )
    resp.raise_for_status()
    j = resp.json()
    _amad_token = j["access_token"]
    _amad_expires = time.time() + j.get("expires_in", 1800)
    return _amad_token

# ─── /api/generate ───────────────────────────────────────────────────────────
@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json() or {}
    prompt = data.get("prompt","").strip()
    if not prompt:
        return jsonify({"error":"No prompt provided"}), 400
    if not gemini_model:
        return jsonify({"error":"Gemini model unavailable"}), 500

    try:
        resp = gemini_model.generate_content(prompt)
        text = resp.text if resp and resp.text else "No response from Gemini."
        return jsonify({"reply": remove_code_fences(text)})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ─── /api/hotels ─────────────────────────────────────────────────────────────
@app.route("/api/hotels", methods=["POST"])
def hotels():
    data      = request.get_json() or {}
    city      = data.get("cityCode")
    check_in  = data.get("checkInDate")
    check_out = data.get("checkOutDate")
    adults    = data.get("adults",1)

    if not city or not check_in or not check_out:
        return jsonify({"error":"Missing parameters"}), 400

    try:
        token = get_amadeus_token()
        headers = {"Authorization":f"Bearer {token}"}

        # 1) Get hotel IDs by city
        list_r = requests.get(
            "https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city",
            headers=headers, params={"cityCode":city}
        )
        list_r.raise_for_status()
        data_list = list_r.json().get("data",[])
        if not data_list:
            return jsonify({"error":"No hotels found"}), 404

        hotel_ids = [h["hotelId"] for h in data_list][:5]
        ids_csv   = ",".join(hotel_ids)

        # 2) Get offers (v3)
        offers_r = requests.get(
            "https://test.api.amadeus.com/v3/shopping/hotel-offers",
            headers=headers,
            params={
                "hotelIds":     ids_csv,
                "checkInDate":  check_in,
                "checkOutDate": check_out,
                "adults":       adults,
                "roomQuantity": 1,
                "bestRateOnly": "true",
                "currency":     "USD",
                "sort":         "PRICE"
            }
        )
        offers_r.raise_for_status()
        return jsonify(offers_r.json())

    except requests.HTTPError as he:
        traceback.print_exc()
        return jsonify({"error":he.response.text}), he.response.status_code
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error":str(e)}), 500

# ─── Root ────────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return "Trip Planner API (Gemini + Amadeus) running!"

# ─── Run ─────────────────────────────────────────────────────────────────────
if __name__=="__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
