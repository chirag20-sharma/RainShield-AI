🌧️ RainShield AI
AI-Powered Parametric Income Protection for Gig Delivery Workers

🚀 Hackathon Project — AI + Insurance Technology + Climate Risk Protection

1. Problem Statement

Gig delivery workers depend on daily orders for survival. Platforms like Zomato, Swiggy, and others provide flexibility—but zero protection against environmental disruptions.

When conditions worsen:

Heavy rain reduces orders

Extreme heat reduces working hours

Pollution and traffic slow deliveries

The result is not inconvenience—it is direct income loss.

A worker earning ₹600/day can drop to ₹300–₹350 during disruptions.

This is not a rare event. It happens multiple times every week in Indian cities.

2. Why Existing Systems Fail

Traditional insurance models are not built for:

Short-term income shocks

Daily wage dependency

Real-time payouts

Even parametric systems fail because they:

Trust single signals (like GPS)

Ignore coordinated fraud

Assume users behave honestly

In reality, systems are attacked, not used.

3. Solution: RainShield AI

RainShield AI is a parametric, AI-driven income protection system.

Instead of waiting for claims:

The system monitors environmental conditions

Predicts income loss in advance

Automatically triggers payouts

Example
Condition	Threshold	Payout
Rainfall	> 60 mm	₹200
Heat	> 42°C	₹150
AQI	> 300	₹150

No forms. No delays. No manual approval.

4. Core Innovation: Income Loss Predictor

RainShield does not just react—it predicts.

Example

Normal income: ₹600
Forecast: Heavy rain

Predicted income: ₹350

Loss: ₹250

User receives:

⚠️ Rain expected tomorrow
Estimated loss ₹250
Protection activated

This shifts insurance from reactive → proactive.

5. User Scenario
Rahul – Delivery Worker

Daily income: ₹650

Rainy day income: ₹350

Loss: ₹300

With RainShield:

Weekly premium: ₹30

Automatic payout: ₹200

RainShield doesn’t eliminate loss—but reduces financial shock.

6. System Workflow

User onboarding

AI risk scoring

Weekly premium calculation

Policy activation (7 days)

Real-time environmental monitoring

Income prediction alerts

Trigger validation

Automatic claim creation

Fraud validation

Instant payout

7. Parametric Triggers
Condition	Trigger
Rainfall	> 60 mm
Heat	> 42°C
AQI	> 300
Flood	Govt alert
Traffic	> 80% congestion
8. AI System Overview
Risk Scoring

Evaluates environmental volatility + location

Income Predictor

Forecast → expected earnings drop

Fraud Engine

Detects anomalies and coordinated attacks

Behavioral Model

Analyzes patterns, not just inputs

🚨 9. Adversarial Defense & Anti-Spoofing Strategy
The Threat

A coordinated group uses GPS spoofing to fake presence in a high-risk zone and trigger payouts.

This is not theoretical—it is the most realistic failure mode.

1️⃣ Differentiation: Real vs Fake Worker

We do NOT trust GPS alone.

We analyze behavioral consistency over time.

Real Worker

Movement matches road networks

Stops and starts frequently

Activity aligns with delivery patterns

Network conditions fluctuate in bad weather

Fake Worker

Perfect linear movement

Static device but changing GPS

No delivery activity

Identical behavior across multiple users

👉 The system evaluates pattern realism, not just location.

2️⃣ Data Beyond GPS

We correlate multiple signals:

Device Signals

Accelerometer (real movement vs static)

Gyroscope patterns

Network Signals

IP consistency

Network switching behavior

Latency fluctuations

Behavioral Signals

Delivery frequency

Active time windows

Route entropy

Environmental Cross-check

Nearby worker activity

Traffic conditions

Weather severity vs actual movement

3️⃣ Coordinated Fraud Detection

We treat fraud as a group problem.

We detect:

Users with identical movement patterns

Simultaneous claims from same region

Clustered behavioral similarity

A single anomaly is ignored.
A synchronized pattern is flagged.

4️⃣ UX Balance (Critical)

We do NOT punish users instantly.

Risk-Based Actions
Risk	Action
Low	Instant payout
Medium	Delayed payout
High	Soft verification
Soft Verification

Quick in-app interaction

Passive validation

Cross-check with nearby users

Design Principle

No hard rejection without strong evidence.
Minimize false positives.

🧠 10. Real-World Failure Analysis & Trade-offs

Most systems fail because they assume perfect data.

We assume:

Data is noisy

Users can cheat

APIs are imperfect

Trade-off 1: Speed vs Accuracy

Instant payouts = high fraud risk

Solution:

Risk-tiered payout delays

Trade-off 2: UX vs Security

Too strict → bad experience
Too loose → system collapse

Solution:

Invisible checks first

Escalation only when needed

Trade-off 3: Individual vs Group Fraud

Fraud is rarely individual.

Solution:

Graph-based detection

Behavioral clustering

Key Insight

“Fraud is not about fake data.
It is about unnatural patterns.”

🚀 11. What Makes This Different

RainShield AI is designed for:

Real-world failure

Adversarial behavior

System abuse scenarios

Not just happy-path users.

12. Technology Stack

Frontend: React
Backend: Node.js, Express
Database: MongoDB
AI: Python (Scikit-learn)
APIs: Weather, AQI, Traffic

13. Backend Architecture

API Gateway

Risk Engine

Trigger Engine

Fraud Engine

AI Prediction Engine

Payment Service

14. Database Design
Users
userId, city, income, riskScore
Policies
policyId, premium, duration
Claims
claimId, trigger, fraudScore
Payouts
payoutId, amount, status
15. System Architecture
Frontend (React)
      |
   Backend API
      |
----------------------------
| Risk | Trigger | Fraud | AI |
----------------------------
      |
    MongoDB
      |
   Payment System
16. MVP Screens

Login / Signup

Onboarding

Buy Policy

Dashboard

Alerts

Claims

Payouts

17. Analytics Dashboard

Active users

Trigger events

Total payouts

Fraud alerts

Risk heatmap

18. Financial Model

100 users × ₹30 = ₹3000

Payouts ≈ ₹1500

Remaining margin: ₹1500

19. Parametric Rules

Rain > 60mm → ₹200

Heat > 42°C → ₹150

AQI > 300 → ₹150

🏁 Final Thought

RainShield AI is not just an insurance product.

It is a system designed under one assumption:

If it can be exploited, it will be exploited.

And built to survive that.

