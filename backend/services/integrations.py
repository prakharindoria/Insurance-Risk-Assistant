# Mock integrations for external APIs
import random

def fetch_cibil_score(client_details: str) -> dict:
    """Mock fetching CIBIL score based on details"""
    score = random.randint(300, 900)
    return {
        "source": "CIBIL",
        "score": score,
        "risk_level": "High" if score < 600 else "Medium" if score < 750 else "Low"
    }

def fetch_environmental_risk(location: str) -> dict:
    """Mock fetching environmental risk"""
    risks = ["Flood", "Earthquake", "Fire", "None"]
    risk = random.choice(risks)
    return {
        "source": "Environmental API",
        "primary_risk": risk,
        "severity": random.choice(["Low", "Medium", "High"]) if risk != "None" else "None"
    }
