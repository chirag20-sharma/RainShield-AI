# 🌧️ RainShield AI

### AI-Powered Parametric Income Protection for Gig Delivery Workers

🚀 Hackathon Project — AI + Insurance Technology + Climate Risk Protection

---

# 🚀 Quick Start Guide

## Prerequisites

- Node.js v16+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Git installed

## Installation Steps

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd RainShield-AI
```

### 2. Install dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### 3. Configure environment variables

```bash
# Copy backend environment template
cp backend/.env.example backend/.env

# Edit backend/.env with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/rainshield
# PORT=4000
```

### 4. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas cloud connection string in .env
```

### 5. Run the application

```bash
# From root directory - runs both frontend and backend
npm run dev

# Or run separately:
npm run dev-backend  # Backend only (port 4000)
npm run dev-frontend # Frontend only (port 3000)
```

### 6. Access the application

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- Health Check: http://localhost:4000/api/diagnostics/health

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID

### Policies
- `GET /api/policies` - Get all policies
- `POST /api/policies` - Create new policy
- `GET /api/policies/user/:userId` - Get user's policies

### Claims
- `GET /api/claims` - Get all claims
- `POST /api/claims` - Submit new claim
- `PUT /api/claims/:id` - Update claim status

### Payouts
- `GET /api/payouts` - Get all payouts
- `POST /api/payouts` - Process payout

### Triggers
- `POST /api/triggers/check` - Check weather triggers

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create alert
- `GET /api/alerts/user/:userId` - Get user alerts

### Diagnostics
- `GET /api/diagnostics/health` - Health check

## Project Structure

```
RainShield-AI/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Custom middleware
│   │   ├── jobs/              # Scheduled tasks
│   │   └── index.js           # Server entry
│   ├── .env                   # Environment variables (gitignored)
│   ├── .env.example           # Environment template
│   └── package.json
├── frontend/                   # React application
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.js             # Root component
│   │   └── index.js           # React entry
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json               # Root workspace config
└── README.md
```

## Troubleshooting

### Port already in use

```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

### MongoDB connection error

- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env
- Verify MongoDB port (default: 27017)

### Frontend can't connect to backend

- Verify backend is running on port 4000
- Check proxy setting in frontend/package.json
- Ensure CORS is enabled in backend

---

# 1. Problem Statement

Gig economy delivery workers such as those working with **Zomato, Swiggy, Zepto, Amazon, Dunzo, and other delivery platforms** depend heavily on daily deliveries for income.

However, their earnings are highly vulnerable to **environmental disruptions**, including:

* Heavy rainfall
* Extreme heat
* Flooding
* Severe air pollution
* Traffic congestion caused by weather

During such disruptions, gig workers may lose **20–30% of their weekly earnings** because:

* Customers order less
* Roads become unsafe
* Platforms temporarily pause operations
* Delivery efficiency drops significantly

### Key Challenges

* Gig workers lack **income protection**
* Traditional insurance requires **manual claims**
* Policies are **too complex or expensive**
* Temporary income loss due to environmental factors is **not covered**

As a result, gig workers face **financial instability during climate or environmental disruptions**.

---

# 2. Proposed Solution

## RainShield AI

RainShield AI is an **AI-powered parametric insurance platform** designed specifically for gig delivery workers.

Instead of traditional claim-based insurance, RainShield uses **parametric triggers** based on environmental conditions.

When predefined environmental thresholds are crossed, **payouts are triggered automatically**.

### Example

| Condition     | Threshold   | Automatic Payout |
| ------------- | ----------- | ---------------- |
| Rainfall      | > 60 mm/day | ₹200             |
| Extreme Heat  | > 42°C      | ₹150             |
| Air Pollution | AQI > 300   | ₹150             |

### Benefits

* No manual claims
* Instant payouts
* Affordable weekly premium
* Fully automated system

---

# 3. Core Innovation: AI Income Loss Predictor

RainShield AI introduces a **Predictive Income Loss Model**.

Instead of reacting after disruptions occur, the system predicts **potential income loss before it happens**.

### Example

Normal daily income: **₹600**

Weather forecast: **Heavy rain tomorrow**

Predicted deliveries drop → earnings **₹350**

Estimated income loss:

₹600 − ₹350 = **₹250**

Worker receives notification:

> ⚠️ Heavy rain expected tomorrow
> Estimated income loss: ₹250
> Insurance protection activated

If the rainfall threshold is actually crossed, the system **automatically triggers the payout**.

This creates a **proactive AI-driven insurance system**.

---

# 4. User Persona Scenario

### Persona: Rahul – Delivery Worker

* Age: 26
* City: Ahmedabad
* Platform: Zomato + Swiggy
* Average daily earnings: ₹650
* Weekly earnings: ₹4500

### Problem

On rainy days, deliveries drop significantly.

Rainy day income:

₹350

Daily loss:

₹650 − ₹350 = **₹300**

### With RainShield AI

Rahul purchases protection:

Weekly premium: **₹30**

Rainfall trigger occurs.

Automatic payout: **₹200**

RainShield helps Rahul reduce income loss during weather disruptions.

---

# 5. System Workflow

## Step 1 — Worker Onboarding

User registers by entering:

* Name
* Phone number
* City
* Delivery platform
* Average weekly income
* Payout method (UPI)

User profile is created in the system.

---

## Step 2 — AI Risk Assessment

The AI Risk Engine evaluates:

* Location weather volatility
* Historical rainfall patterns
* Heat index frequency
* Pollution levels

The system generates a **Risk Score (0–100)**.

Example:

Ahmedabad risk score → **62**

---

## Step 3 — Dynamic Weekly Premium Calculation

Premium is calculated using:

* Risk score
* Historical weather disruption frequency
* Income range

Example pricing:

| Risk Level  | Weekly Premium |
| ----------- | -------------- |
| Low Risk    | ₹20            |
| Medium Risk | ₹30            |
| High Risk   | ₹40            |

---

## Step 4 — Policy Activation

The worker purchases a **weekly policy**.

Policy duration:

**7 days**

Coverage activates instantly.

---

## Step 5 — Environmental Monitoring

The system continuously monitors external data sources:

* Weather APIs
* Pollution APIs
* Traffic data
* Government alerts

---

## Step 6 — Income Loss Prediction

The AI prediction engine forecasts potential disruptions.

Worker receives notification:

> Storm predicted tomorrow
> Estimated income loss ₹250

---

## Step 7 — Trigger Detection

Example trigger:

Rainfall > 60 mm

The system validates the event using weather API data.

---

## Step 8 — Automatic Claim Generation

If a trigger condition is satisfied:

A claim is automatically generated.

No action is required from the worker.

---

## Step 9 — Fraud Detection

The system validates claim authenticity using:

* Screenshot verification
* Location validation
* Behavioral anomaly detection

---

## Step 10 — Instant Payout

If the claim is valid:

The payout is transferred using:

* UPI
* Digital wallet
* Payment sandbox

---

# 6. Weekly Premium Pricing Model

Example:

Worker weekly income:

₹4500

Coverage amount:

Up to **₹1000 weekly protection**

Weekly premium:

₹30

### Payout Structure

| Event        | Payout |
| ------------ | ------ |
| Heavy Rain   | ₹200   |
| Extreme Heat | ₹150   |
| Severe AQI   | ₹150   |

Maximum weekly payout: **₹1000**

---

# 7. Parametric Trigger Definitions

| Condition          | Trigger            |
| ------------------ | ------------------ |
| Heavy Rain         | Rainfall > 60 mm   |
| Extreme Heat       | Temperature > 42°C |
| Severe Pollution   | AQI > 300          |
| Flood Warning      | Government alert   |
| Traffic Congestion | > 80% road delay   |

---

# 8. AI / Machine Learning Components

## 1 Risk Scoring Model

Inputs:

* City
* Historical weather volatility
* Frequency of disruptions
* Worker income

Output:

Risk score.

---

## 2 Income Loss Predictor

Inputs:

* Weather forecast
* Historical delivery activity
* Traffic congestion
* Pollution levels

Output:

Predicted income drop.

---

## 3 Fraud Detection Model

Detects:

* Fake earnings screenshots
* Duplicate claims
* Manipulated income reporting

---

## 4 Behavioral Anomaly Detection

Detects suspicious behavior patterns.

Example:

Worker reports low income while activity data shows high delivery volume.

---

# 9. Fraud Detection Mechanisms

## Screenshot Verification

Workers upload delivery earnings screenshot.

OCR extracts:

* Earnings amount
* Date
* Platform name

---

## Location Validation

Worker GPS is verified against:

* Registered city
* Weather trigger location

---

## Duplicate Claim Detection

System prevents:

* Multiple claims for the same event
* Multiple claims by the same worker

---

## Activity Mismatch Detection

Example:

Worker reports no deliveries.

But traffic and platform data indicate normal activity.

The system flags the claim.

---

# 10. Technology Stack (MERN)

### Frontend

* React 18
* React Scripts
* Axios (API calls)
* CSS3

### Backend

* Node.js
* Express.js
* Mongoose (MongoDB ODM)
* CORS
* Morgan (HTTP logging)
* Dotenv (Environment config)
* Nodemon (Development)

### Database

* MongoDB (Local/Atlas)

### AI Services

* Income Loss Prediction (ML model)
* Fraud Detection (Pattern analysis)
* Risk Scoring Engine

### External APIs

* Weather API (OpenWeatherMap/WeatherAPI)
* AQI API (Air Quality Index)
* Traffic API
* Payment sandbox (Mock UPI)

---

# 11. Backend Service Architecture

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── userController.js        # User management logic
│   │   ├── policyController.js      # Policy CRUD operations
│   │   ├── claimController.js       # Claim processing
│   │   ├── payoutController.js      # Payout handling
│   │   ├── triggerController.js     # Weather trigger checks
│   │   └── diagnosticsController.js # Health checks
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Policy.js                # Policy schema
│   │   ├── Claim.js                 # Claim schema
│   │   ├── Payout.js                # Payout schema
│   │   └── Alert.js                 # Alert schema
│   ├── routes/
│   │   ├── users.js                 # /api/users
│   │   ├── policies.js              # /api/policies
│   │   ├── claims.js                # /api/claims
│   │   ├── payouts.js               # /api/payouts
│   │   ├── triggers.js              # /api/triggers
│   │   ├── alerts.js                # /api/alerts
│   │   └── diagnostics.js           # /api/diagnostics
│   ├── services/
│   │   ├── weatherTrigger.js        # Weather API integration
│   │   ├── fraudDetection.js        # Fraud detection logic
│   │   ├── incomeLossPrediction.js  # Income prediction AI
│   │   └── paymentService.js        # Payment processing
│   ├── middleware/
│   │   └── errorHandler.js          # Global error handling
│   ├── jobs/
│   │   └── triggerJob.js            # Scheduled weather checks
│   └── index.js                     # Server entry point
```

Core services:

### API Gateway (Express)

Handles incoming requests and routes them to controllers.

### Risk Engine (Service Layer)

Calculates premiums and risk scores based on location and weather patterns.

### Trigger Engine (Service + Job)

Monitors environmental conditions via external APIs.

### AI Prediction Engine (Service)

Predicts income loss using weather forecasts and historical data.

### Fraud Detection Engine (Service)

Validates claims using pattern analysis and anomaly detection.

### Payment Service

Handles payouts via UPI/payment sandbox.

---

# 12. Database Design (MongoDB Schemas)

## Users Collection (User.js)

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  city: String,
  platform: String,
  avgWeeklyIncome: Number,
  riskScore: Number,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  createdAt: Date (default: Date.now)
}
```

---

## Policies Collection (Policy.js)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  premium: Number (required),
  coverage: Number (required),
  startDate: Date (required),
  endDate: Date (required),
  status: String (enum: ['active', 'expired', 'cancelled']),
  triggers: [{
    type: String,
    threshold: Number,
    payout: Number
  }],
  createdAt: Date (default: Date.now)
}
```

---

## Claims Collection (Claim.js)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  policyId: ObjectId (ref: 'Policy'),
  triggerType: String (required),
  triggerValue: Number,
  amount: Number (required),
  fraudScore: Number,
  status: String (enum: ['pending', 'approved', 'rejected', 'paid']),
  evidence: {
    screenshot: String,
    location: Object,
    timestamp: Date
  },
  createdAt: Date (default: Date.now)
}
```

---

## Payouts Collection (Payout.js)

```javascript
{
  _id: ObjectId,
  claimId: ObjectId (ref: 'Claim'),
  userId: ObjectId (ref: 'User'),
  amount: Number (required),
  method: String (enum: ['upi', 'bank', 'wallet']),
  transactionId: String,
  status: String (enum: ['pending', 'completed', 'failed']),
  processedAt: Date,
  createdAt: Date (default: Date.now)
}
```

---

## Alerts Collection (Alert.js)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  type: String (enum: ['rain', 'flood', 'storm', 'heat', 'pollution']),
  severity: String (enum: ['low', 'medium', 'high']),
  message: String (required),
  location: {
    latitude: Number,
    longitude: Number
  },
  sentAt: Date (default: Date.now),
  status: String (enum: ['sent', 'delivered', 'failed'])
}
```

---

# 13. System Architecture (Actual Implementation)

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Port 3000)                     │
│                      React Application                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Dashboard │  │  Policy  │  │  Claims  │  │  Alerts  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/Axios (Proxy)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Port 4000)                      │
│                   Express.js REST API                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Routes (API Endpoints)                  │  │
│  │  /api/users  /api/policies  /api/claims  /api/...   │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Controllers                         │  │
│  │  userController  policyController  claimController  │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Services                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │ Weather  │  │  Fraud   │  │ Income   │          │  │
│  │  │ Trigger  │  │Detection │  │Prediction│          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       ▼                                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Models (Mongoose)                       │  │
│  │  User  Policy  Claim  Payout  Alert                 │  │
│  └────────────────────┬─────────────────────────────────┘  │
└────────────────────────┼────────────────────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Database                           │
│  users  policies  claims  payouts  alerts                  │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                         │
│  Weather API  │  AQI API  │  Payment Gateway               │
└─────────────────────────────────────────────────────────────┘
```

---

# 14. MVP UI Screens (Frontend Structure)

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   └── Dashboard.js        # Main dashboard component
│   ├── App.js                  # Root component with routing
│   ├── App.css                 # Application styles
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
└── package.json
```

### Planned Screens:

1. **Login / Signup** - User authentication
2. **Worker Onboarding** - Profile setup
3. **Buy Weekly Policy** - Policy purchase flow
4. **Dashboard** (Currently implemented)
   - Coverage status
   - Risk alerts
   - Predicted income loss
   - Backend health status
5. **Weather Risk Alerts** - Real-time notifications
6. **Claim Status** - Track claim progress
7. **Payout History** - Transaction history

---

# 15. Analytics Dashboard

Admin analytics include:

* Total insured workers
* Active policies
* Weather triggers activated
* Total payouts
* Fraud alerts
* Risk heatmap by city

---

# 16. Development Roadmap

### Phase 1 ✅ COMPLETED

- [x] MERN project structure setup
- [x] MongoDB connection configuration
- [x] Express.js REST API setup
- [x] Mongoose models (User, Policy, Claim, Payout, Alert)
- [x] API routes and controllers
- [x] React frontend initialization
- [x] Basic Dashboard component
- [x] Monorepo workspace configuration

### Phase 2 🚧 IN PROGRESS

- [ ] Parametric trigger engine implementation
- [ ] Weather API integration
- [ ] Trigger detection logic
- [ ] Scheduled jobs for monitoring

### Phase 3 📋 PLANNED

- [ ] AI income prediction model
- [ ] Historical data analysis
- [ ] Prediction API endpoints

### Phase 4 📋 PLANNED

- [ ] Fraud detection system
- [ ] Screenshot verification
- [ ] Anomaly detection

### Phase 5 📋 PLANNED

- [ ] Complete React dashboard UI
- [ ] Policy purchase flow
- [ ] Claims management interface
- [ ] Alert notifications

### Phase 6 📋 PLANNED

- [ ] Payment simulation and testing
- [ ] UPI integration (sandbox)
- [ ] End-to-end testing

---

# 17. Example Parametric Rules

Rule 1:

IF rainfall > 60mm
AND policy active
THEN payout ₹200

Rule 2:

IF temperature > 42°C
THEN payout ₹150

Rule 3:

IF AQI > 300
THEN payout ₹150

---

# 18. Financial Model Example

100 workers insured.

Weekly premium:

₹30

Total weekly premium pool:

₹3000

Average payouts:

₹1500

Remaining margin:

₹1500

Used for:

* operating cost
* reserve fund
* platform maintenance

---

# 19. Project Name & Branding

Possible names:

* RainShield AI
* GigGuard
* DeliverSafe
* ClimateCover
* RideSecure AI
* WeatherPay

Recommended name:

**RainShield AI**

Tagline:

**"Protecting gig workers from climate income shocks."**

---

# 20. 2-Minute Demo Video Script

Hello everyone.

Gig delivery workers depend on daily deliveries for their income. However, environmental disruptions like heavy rain, extreme heat, and air pollution can significantly reduce their ability to work.

RainShield AI is an AI-powered parametric insurance platform designed specifically for gig delivery workers.

Workers pay a small weekly premium of around ₹30.

Our AI system continuously monitors weather, pollution, and traffic data in real time.

If predefined environmental thresholds are crossed, payouts are triggered automatically without requiring any manual claim.

Additionally, RainShield AI includes a predictive Income Loss Predictor.

Using weather forecasts and historical delivery data, the system estimates potential income loss before disruptions occur and notifies the worker.

For example:
Heavy rain expected tomorrow. Estimated income loss ₹250. Insurance protection activated.

If the event occurs, the system automatically processes payouts through UPI.

RainShield AI is built using the MERN stack with AI-based risk assessment and fraud detection.

This platform provides gig workers with financial protection against environmental disruptions and introduces a smarter, automated model for insurance.

Thank you.
