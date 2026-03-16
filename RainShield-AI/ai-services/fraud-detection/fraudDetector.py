# Fraud Detection System
# Detects: false income reporting, duplicate claims,
# behavioral anomalies, location mismatch, activity mismatch

import hashlib
from datetime import datetime, timedelta


def _flag(reason, severity='medium'):
    return {'flagged': True, 'reason': reason, 'severity': severity}


def check_income_reporting(claimed_income: float, platform: str, city: str) -> dict:
    """
    Detects false income reporting by comparing against platform/city benchmarks.
    """
    BENCHMARKS = {
        ('zomato',  'Mumbai'): (400, 1200),
        ('swiggy',  'Mumbai'): (380, 1150),
        ('zomato',  'Delhi'):  (350, 1100),
        ('swiggy',  'Delhi'):  (330, 1050),
        ('dunzo',   'Bangalore'): (300, 900),
    }
    key = (platform.lower(), city)
    low, high = BENCHMARKS.get(key, (200, 1500))

    if claimed_income < low * 0.5:
        return _flag(f'Income Rs.{claimed_income} is suspiciously low for {platform}/{city}', 'high')
    if claimed_income > high * 1.5:
        return _flag(f'Income Rs.{claimed_income} exceeds benchmark ceiling for {platform}/{city}', 'high')
    return {'flagged': False}


def check_duplicate_claim(new_claim: dict, existing_claims: list) -> dict:
    """
    Detects duplicate claims within a 24-hour window for the same type.
    new_claim: {user_id, type, date}
    existing_claims: list of same shape
    """
    new_date = datetime.fromisoformat(new_claim['date']) if isinstance(new_claim['date'], str) else new_claim['date']
    window = timedelta(hours=24)

    for c in existing_claims:
        c_date = datetime.fromisoformat(c['date']) if isinstance(c['date'], str) else c['date']
        if c['type'] == new_claim['type'] and abs((new_date - c_date).total_seconds()) < window.total_seconds():
            return _flag(f'Duplicate {new_claim["type"]} claim within 24 hours', 'high')
    return {'flagged': False}


def check_location_validity(claimed_city: str, gps_city: str) -> dict:
    """
    Validates that the worker's GPS location matches their registered city.
    """
    if claimed_city.lower().strip() != gps_city.lower().strip():
        return _flag(f'Location mismatch: registered={claimed_city}, GPS={gps_city}', 'high')
    return {'flagged': False}


def check_behavioral_anomaly(activity_data: dict) -> dict:
    """
    Detects anomalies in delivery activity patterns.
    activity_data: {deliveries_today, avg_deliveries, hours_active, claim_type}
    """
    deliveries = activity_data.get('deliveries_today', 0)
    avg = activity_data.get('avg_deliveries', 10)
    hours = activity_data.get('hours_active', 8)
    claim_type = activity_data.get('claim_type', '')

    # If claiming rain disruption but still made many deliveries
    if claim_type in ('rain', 'heat', 'pollution') and deliveries > avg * 0.8:
        return _flag(
            f'Activity mismatch: {deliveries} deliveries on claimed disruption day (avg={avg})',
            'high'
        )
    # Unusually high deliveries in short time
    if hours > 0 and (deliveries / hours) > 5:
        return _flag(f'Suspicious delivery rate: {deliveries} in {hours}h', 'medium')

    return {'flagged': False}


def check_screenshot_validity(screenshot_data: dict) -> dict:
    """
    Simulates OCR/screenshot validation.
    screenshot_data: {reported_amount, ocr_amount, timestamp_match (bool)}
    """
    reported = float(screenshot_data.get('reported_amount', 0))
    ocr = float(screenshot_data.get('ocr_amount', 0))
    timestamp_match = screenshot_data.get('timestamp_match', True)

    if not timestamp_match:
        return _flag('Screenshot timestamp does not match claim date', 'high')
    if ocr > 0 and abs(reported - ocr) / max(ocr, 1) > 0.15:
        return _flag(f'Screenshot amount Rs.{ocr} differs from reported Rs.{reported} by >15%', 'high')
    return {'flagged': False}


def run_full_fraud_check(payload: dict) -> dict:
    """
    Runs all fraud checks and returns a consolidated report.
    payload keys: claimed_income, platform, city, gps_city,
                  new_claim, existing_claims, activity_data, screenshot_data
    """
    results = {}
    flags = []

    results['income'] = check_income_reporting(
        payload.get('claimed_income', 600),
        payload.get('platform', 'zomato'),
        payload.get('city', 'Mumbai')
    )

    results['duplicate'] = check_duplicate_claim(
        payload.get('new_claim', {'user_id': '', 'type': 'rain', 'date': datetime.now().isoformat()}),
        payload.get('existing_claims', [])
    )

    results['location'] = check_location_validity(
        payload.get('city', 'Mumbai'),
        payload.get('gps_city', 'Mumbai')
    )

    results['behavior'] = check_behavioral_anomaly(
        payload.get('activity_data', {})
    )

    results['screenshot'] = check_screenshot_validity(
        payload.get('screenshot_data', {'reported_amount': 0, 'ocr_amount': 0, 'timestamp_match': True})
    )

    for key, val in results.items():
        if val.get('flagged'):
            flags.append({'check': key, 'reason': val['reason'], 'severity': val['severity']})

    overall_fraud = len(flags) > 0
    high_severity = any(f['severity'] == 'high' for f in flags)

    return {
        'fraud_detected': overall_fraud,
        'auto_reject': high_severity,
        'flags': flags,
        'checks': results,
        'fraud_score': min(len(flags) * 25, 100),
    }
