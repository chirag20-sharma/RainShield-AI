# Risk Scoring Model
# Scores a worker's insurance risk (0-100) based on:
# location, historical weather disruptions, vehicle type, income volatility

import numpy as np

CITY_RISK = {
    # High rainfall / coastal / flood-prone cities
    'Mumbai': 75, 'Chennai': 72, 'Kolkata': 70, 'Kochi': 74, 'Guwahati': 73,
    'Bhubaneswar': 71, 'Visakhapatnam': 69, 'Mangalore': 73, 'Thiruvananthapuram': 72,
    'Kozhikode': 71, 'Thrissur': 70, 'Patna': 68, 'Varanasi': 65, 'Agra': 60,
    # Moderate risk cities
    'Delhi': 58, 'Hyderabad': 52, 'Pune': 50, 'Nagpur': 55, 'Surat': 60,
    'Ahmedabad': 55, 'Indore': 50, 'Bhopal': 52, 'Lucknow': 57, 'Kanpur': 56,
    'Jaipur': 48, 'Jodhpur': 42, 'Udaipur': 47, 'Ajmer': 45, 'Kota': 46,
    'Raipur': 54, 'Ranchi': 56, 'Dhanbad': 55, 'Jamshedpur': 54,
    'Vijayawada': 58, 'Guntur': 57, 'Tirupati': 55, 'Warangal': 53,
    'Coimbatore': 52, 'Madurai': 54, 'Salem': 51, 'Tiruchirappalli': 53,
    'Mysuru': 48, 'Hubli': 49, 'Belgaum': 50, 'Davangere': 48,
    'Amritsar': 50, 'Ludhiana': 51, 'Jalandhar': 50, 'Chandigarh': 49,
    'Dehradun': 55, 'Haridwar': 56, 'Meerut': 54, 'Ghaziabad': 55,
    'Noida': 54, 'Faridabad': 53, 'Gurugram': 52,
    'Nashik': 52, 'Aurangabad': 50, 'Solapur': 48, 'Kolhapur': 53,
    'Vadodara': 54, 'Rajkot': 50, 'Bhavnagar': 52, 'Jamnagar': 51,
    'Gwalior': 50, 'Jabalpur': 53, 'Ujjain': 49,
    'Allahabad': 57, 'Gorakhpur': 58, 'Bareilly': 55, 'Aligarh': 54,
    'Siliguri': 65, 'Asansol': 60, 'Durgapur': 59,
    'Jammu': 52, 'Srinagar': 58,
    'Shimla': 55, 'Manali': 57,
    'Imphal': 65, 'Shillong': 68, 'Aizawl': 66, 'Kohima': 64,
    'Agartala': 67, 'Gangtok': 63, 'Itanagar': 66, 'Dispur': 67,
    # Lower risk / dry cities
    'Bangalore': 45, 'Leh': 30, 'Bikaner': 35, 'Jaisalmer': 32,
    'Puducherry': 60, 'Panaji': 65, 'Silvassa': 55, 'Daman': 58,
    'Port Blair': 70, 'Kavaratti': 68,
}

VEHICLE_RISK = {'cycle': 20, 'foot': 15, 'bike': 5}

PLATFORM_STABILITY = {'dunzo': 10, 'other': 8, 'swiggy': 4, 'zomato': 3}


def calculate_risk_score(user_data: dict) -> dict:
    """
    user_data keys:
        city, vehicle_type, platform, normal_daily_income,
        claims_last_30_days (int), disruption_days_last_30 (int)
    Returns dict with score (0-100), risk_level, weekly_premium, coverage_amount
    """
    city = user_data.get('city', 'Mumbai')
    vehicle = user_data.get('vehicle_type', 'bike')
    platform = user_data.get('platform', 'zomato')
    income = float(user_data.get('normal_daily_income', 600))
    claims = int(user_data.get('claims_last_30_days', 0))
    disruption_days = int(user_data.get('disruption_days_last_30', 3))

    # Base score from city weather risk
    base = CITY_RISK.get(city, 50)

    # Vehicle exposure penalty
    vehicle_penalty = VEHICLE_RISK.get(vehicle, 5)

    # Platform instability penalty
    platform_penalty = PLATFORM_STABILITY.get(platform, 5)

    # Historical claims penalty (each claim adds 5 pts, max 20)
    claims_penalty = min(claims * 5, 20)

    # Disruption frequency penalty (each day adds 1 pt, max 10)
    disruption_penalty = min(disruption_days, 10)

    # Income volatility: lower income = higher relative risk
    income_factor = max(0, (800 - income) / 800 * 10)

    raw_score = base + vehicle_penalty + platform_penalty + claims_penalty + disruption_penalty + income_factor
    score = int(np.clip(raw_score, 0, 100))

    if score >= 70:
        risk_level = 'high'
    elif score >= 45:
        risk_level = 'medium'
    else:
        risk_level = 'low'

    # Dynamic weekly premium: 4-8% of weekly income based on risk
    premium_rate = 0.04 + (score / 100) * 0.04
    weekly_premium = round(income * 7 * premium_rate)

    # Coverage = 7 days income
    coverage_amount = round(income * 7)

    return {
        'score': score,
        'risk_level': risk_level,
        'weekly_premium': weekly_premium,
        'coverage_amount': coverage_amount,
        'breakdown': {
            'city_base': base,
            'vehicle_penalty': vehicle_penalty,
            'platform_penalty': platform_penalty,
            'claims_penalty': claims_penalty,
            'disruption_penalty': disruption_penalty,
            'income_factor': round(income_factor, 2),
        }
    }
