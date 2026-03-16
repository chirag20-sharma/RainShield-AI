# Income Loss Predictor
# Predicts how much income a gig worker will lose due to
# upcoming environmental conditions: rain, heat, pollution, traffic

import numpy as np
from datetime import datetime

# Impact factors per condition type (fraction of income lost)
IMPACT_MATRIX = {
    'rain': {
        'light':  {'bike': 0.15, 'cycle': 0.25, 'foot': 0.30},
        'moderate': {'bike': 0.35, 'cycle': 0.50, 'foot': 0.60},
        'heavy':  {'bike': 0.55, 'cycle': 0.75, 'foot': 0.85},
        'extreme': {'bike': 0.70, 'cycle': 0.90, 'foot': 0.95},
    },
    'heat': {
        'moderate': {'bike': 0.10, 'cycle': 0.20, 'foot': 0.25},
        'high':     {'bike': 0.20, 'cycle': 0.35, 'foot': 0.45},
        'extreme':  {'bike': 0.35, 'cycle': 0.55, 'foot': 0.65},
    },
    'pollution': {
        'moderate': {'bike': 0.08, 'cycle': 0.15, 'foot': 0.20},
        'high':     {'bike': 0.18, 'cycle': 0.28, 'foot': 0.35},
        'hazardous': {'bike': 0.30, 'cycle': 0.45, 'foot': 0.55},
    },
    'traffic': {
        'moderate': {'bike': 0.10, 'cycle': 0.12, 'foot': 0.05},
        'heavy':    {'bike': 0.22, 'cycle': 0.25, 'foot': 0.08},
        'gridlock': {'bike': 0.35, 'cycle': 0.38, 'foot': 0.10},
    },
}

# Thresholds that trigger automatic parametric payout
PAYOUT_THRESHOLDS = {
    'rain':      {'value': 50,  'unit': 'mm/day'},
    'heat':      {'value': 42,  'unit': '°C'},
    'pollution': {'value': 300, 'unit': 'AQI'},
    'traffic':   {'value': 8,   'unit': 'congestion index'},
}


def _get_intensity(condition_type: str, value: float) -> str:
    """Map a raw sensor value to an intensity label."""
    if condition_type == 'rain':
        if value < 10:  return 'light'
        if value < 35:  return 'moderate'
        if value < 65:  return 'heavy'
        return 'extreme'
    if condition_type == 'heat':
        if value < 38:  return 'moderate'
        if value < 42:  return 'high'
        return 'extreme'
    if condition_type == 'pollution':
        if value < 150: return 'moderate'
        if value < 300: return 'high'
        return 'hazardous'
    if condition_type == 'traffic':
        if value < 5:   return 'moderate'
        if value < 8:   return 'heavy'
        return 'gridlock'
    return 'moderate'


def predict_income(data: dict) -> dict:
    """
    Predicts income loss for a worker given an environmental condition.

    data keys:
        condition_type  : 'rain' | 'heat' | 'pollution' | 'traffic'
        condition_value : raw sensor reading (mm, °C, AQI, index)
        normal_daily_income : float (default 600)
        vehicle_type    : 'bike' | 'cycle' | 'foot' (default 'bike')
        city            : str

    Returns dict with prediction details and payout trigger status.
    """
    condition_type  = data.get('condition_type', 'rain')
    condition_value = float(data.get('condition_value', 50))
    normal_income   = float(data.get('normal_daily_income', 600))
    vehicle         = data.get('vehicle_type', 'bike')
    city            = data.get('city', 'Mumbai')

    intensity = _get_intensity(condition_type, condition_value)

    impact_map = IMPACT_MATRIX.get(condition_type, IMPACT_MATRIX['rain'])
    intensity_map = impact_map.get(intensity, list(impact_map.values())[0])
    impact_factor = intensity_map.get(vehicle, 0.35)

    # Add small noise to simulate real-world variance
    noise = np.random.uniform(-0.03, 0.03)
    impact_factor = float(np.clip(impact_factor + noise, 0, 1))

    predicted_income = round(normal_income * (1 - impact_factor))
    predicted_loss   = round(normal_income - predicted_income)

    threshold = PAYOUT_THRESHOLDS.get(condition_type, {})
    payout_triggered = condition_value >= threshold.get('value', 999)

    LABELS = {
        'rain': 'Heavy Rainfall', 'heat': 'Extreme Heat',
        'pollution': 'High Pollution (AQI)', 'traffic': 'Traffic Congestion',
    }
    label = LABELS.get(condition_type, condition_type.title())

    message = (
        f"{label} expected in {city}. "
        f"Estimated income loss Rs.{predicted_loss}. "
        f"{'Insurance protection activated.' if payout_triggered else 'Monitor conditions.'}"
    )

    return {
        'city': city,
        'condition_type': condition_type,
        'condition_label': label,
        'condition_value': condition_value,
        'intensity': intensity,
        'vehicle_type': vehicle,
        'normal_daily_income': normal_income,
        'predicted_income': predicted_income,
        'predicted_loss': predicted_loss,
        'impact_factor': round(impact_factor, 3),
        'payout_triggered': payout_triggered,
        'payout_threshold': threshold,
        'message': message,
        'timestamp': datetime.utcnow().isoformat() + 'Z',
    }


def predict_weekly(data: dict) -> dict:
    """Run predictions for all 4 condition types and return a weekly risk summary."""
    conditions = [
        {'condition_type': 'rain',      'condition_value': data.get('rain_mm', 45)},
        {'condition_type': 'heat',      'condition_value': data.get('temp_c', 38)},
        {'condition_type': 'pollution', 'condition_value': data.get('aqi', 180)},
        {'condition_type': 'traffic',   'condition_value': data.get('traffic_index', 6)},
    ]
    base = {
        'normal_daily_income': data.get('normal_daily_income', 600),
        'vehicle_type': data.get('vehicle_type', 'bike'),
        'city': data.get('city', 'Mumbai'),
    }
    results = [predict_income({**base, **c}) for c in conditions]
    worst = max(results, key=lambda r: r['predicted_loss'])
    total_risk_loss = sum(r['predicted_loss'] for r in results)

    return {
        'weekly_summary': results,
        'worst_condition': worst,
        'total_estimated_weekly_loss': total_risk_loss,
        'any_payout_triggered': any(r['payout_triggered'] for r in results),
    }
