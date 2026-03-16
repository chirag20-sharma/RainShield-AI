import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'risk-scoring'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'fraud-detection'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'income-predictor'))

from flask import Flask, request, jsonify
from flask_cors import CORS
from riskModel import calculate_risk_score
from fraudDetector import run_full_fraud_check
from predictor import predict_income, predict_weekly

app = Flask(__name__)
CORS(app)


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'RainShield AI Services'})


# ── Risk Scoring ──────────────────────────────────────────────
@app.route('/api/risk-score', methods=['POST'])
def risk_score():
    """
    Body: { city, vehicle_type, platform, normal_daily_income,
            claims_last_30_days, disruption_days_last_30 }
    """
    data = request.get_json(force=True)
    if not data:
        return jsonify({'error': 'JSON body required'}), 400
    result = calculate_risk_score(data)
    return jsonify({'status': 'success', 'data': result})


# ── Fraud Detection ───────────────────────────────────────────
@app.route('/api/fraud-check', methods=['POST'])
def fraud_check():
    """
    Body: { claimed_income, platform, city, gps_city,
            new_claim, existing_claims, activity_data, screenshot_data }
    """
    data = request.get_json(force=True)
    if not data:
        return jsonify({'error': 'JSON body required'}), 400
    result = run_full_fraud_check(data)
    return jsonify({'status': 'success', 'data': result})


# ── Income Loss Predictor ─────────────────────────────────────
@app.route('/api/predict-income', methods=['POST'])
def predict_income_route():
    """
    Body: { condition_type, condition_value, normal_daily_income,
            vehicle_type, city }
    """
    data = request.get_json(force=True)
    if not data:
        return jsonify({'error': 'JSON body required'}), 400
    result = predict_income(data)
    return jsonify({'status': 'success', 'data': result})


@app.route('/api/predict-weekly', methods=['POST'])
def predict_weekly_route():
    """
    Body: { rain_mm, temp_c, aqi, traffic_index,
            normal_daily_income, vehicle_type, city }
    """
    data = request.get_json(force=True)
    if not data:
        return jsonify({'error': 'JSON body required'}), 400
    result = predict_weekly(data)
    return jsonify({'status': 'success', 'data': result})


# ── Combined: full worker assessment ─────────────────────────
@app.route('/api/assess-worker', methods=['POST'])
def assess_worker():
    """
    Runs risk scoring + weekly income prediction in one call.
    Body: { city, vehicle_type, platform, normal_daily_income,
            claims_last_30_days, disruption_days_last_30,
            rain_mm, temp_c, aqi, traffic_index }
    """
    data = request.get_json(force=True)
    if not data:
        return jsonify({'error': 'JSON body required'}), 400

    risk = calculate_risk_score(data)
    weekly = predict_weekly(data)

    return jsonify({
        'status': 'success',
        'data': {
            'risk_assessment': risk,
            'income_forecast': weekly,
        }
    })


if __name__ == '__main__':
    port = int(os.environ.get('AI_PORT', 5001))
    sys.stdout.reconfigure(encoding='utf-8')
    print(f'[AI] RainShield AI Services running on http://localhost:{port}')
    app.run(host='0.0.0.0', port=port, debug=True)
