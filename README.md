# CarGasPh 🇵🇭

> **Intelligent Navigation, Vehicle Garage, and Fuel Intelligence for Filipino Motorists**

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-green.svg)](https://expo.dev)
[![Mobile](https://img.shields.io/badge/Mobile-React%20Native%20%7C%20Expo%20SDK%2052-blue.svg)](https://reactnative.dev)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-009688.svg)](https://fastapi.tiangolo.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%2016%20%2B%20PostGIS-336791.svg)](https://postgis.net)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

---

## 📌 Overview

**CarGasPh** is a specialized mobile platform designed specifically for the unique realities of driving and riding in the Philippines. While conventional navigation platforms provide turn-by-turn directions, they fail to answer the most pressing financial questions facing Filipino motorists:

> *"How much fuel will this trip consume?"*  
> *"What will this trip cost me in pesos?"*  
> *"Will my motorcycle or car make it without running empty?"*  
> *"Did gasoline and diesel increase or rollback this week?"*  
> *"Where is the nearest verified gas station along my route?"*

CarGasPh seamlessly unifies **GPS Navigation**, **Vehicle Garage Profiles**, **Official Philippine Fuel Prices (DOE)**, **Trip Fuel-Cost Estimation**, **Gas Station Discovery**, and **Fuel News** into a single, high-performance mobile application.

---

## ✨ Key Features

- **🚗 Multi-Vehicle Garage**: Manage motorcycles (Yamaha Aerox, NMAX, Honda Click, etc.) and passenger vehicles (Toyota Vios, Hilux, Wigo, Innova, etc.) with custom tank capacities and baseline fuel economy ratings.
- **🗺️ Intelligent Map & Routing**: Interactive vector maps, search autocomplete, traffic-aware driving route polyline, distance in kilometers, and estimated travel duration.
- **⛽ Real-Time Trip Fuel Calculator**: Instantly calculates Liters Required, Estimated Trip Fuel Cost (One-Way and Round-Trip), and Cost-per-Kilometer ($\text{CPK}$) based on the active vehicle and current pump prices.
- **📊 Philippine Fuel Intelligence**: Authoritative weekly Department of Energy (DOE) prevailing prices for Gasoline (RON 91, RON 95, RON 97+), Diesel, and Kerosene.
- **📈 Fuel Price Movement Tracker**: Clear visual indicators for weekly Price Hikes ($\uparrow$), Rollbacks ($\downarrow$), and Unchanged rates with effective dates and historical trend charts.
- **📍 Gas Station Discovery**: Locate nearby stations (Petron, Shell, Caltex, Cleanfuel, Seaoil, Unioil, Phoenix) within a 5km radius using spatial PostGIS queries.
- **📰 Fuel News & Advisories**: Curated stream of official DOE advisories, excise tax updates, and Philippine motoring developments.
- **📝 Personal Fuel Logbook**: Track actual pump fill-ups (full-to-full method) to compute your vehicle's true moving average fuel economy.

---

## 🏗️ Architecture & Technology Stack

```text
┌────────────────────────────────────────────────────────┐
│                   MOBILE CLIENT                        │
│  React Native (Expo SDK 52) • Expo Router v4           │
│  TypeScript • Zustand • TanStack Query v5              │
│  React Hook Form + Zod • react-native-maps             │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTPS / REST (TLS 1.3)
┌──────────────────────────▼─────────────────────────────┐
│                 BACKEND SERVICE                        │
│  FastAPI (Python 3.11+) • Pydantic v2 • SQLAlchemy 2.0 │
│  Alembic Migrations • Redis Caching • Docker           │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 PERSISTENCE LAYER                      │
│  PostgreSQL 16 + PostGIS Spatial Extension             │
│  Spatial Indexing (GIST) for Gas Station Search        │
└────────────────────────────────────────────────────────┘
```

---

## 📋 System Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js**: `v20.x` or `v22.x` (LTS)
- **Package Manager**: `npm` (v10+) or `bun`
- **Python**: `3.11` or `3.12`
- **Docker & Docker Compose**: For local PostgreSQL + PostGIS and Redis
- **Expo CLI**: `npm install -g expo-cli eas-cli`
- **Git**

---

## 🔑 Environment Variables Setup

### 1. Backend Environment (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Configure the following variables:

```ini
# Application
PROJECT_NAME="CarGasPh Backend"
ENVIRONMENT="development" # development | staging | production
API_V1_STR="/api/v1"
SECRET_KEY="your-super-secret-jwt-signing-key-change-in-prod"
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

# Database (PostgreSQL 16 + PostGIS)
POSTGRES_SERVER=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=cargasph_dev
DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/cargasph_dev"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Google Maps Platform (Server-side key for Routes & Places proxy)
GOOGLE_MAPS_SERVER_KEY="AIzaSyYourServerRestrictedGoogleKey"
```

### 2. Mobile Client Environment (`mobile/.env`)

Copy `mobile/.env.example` to `mobile/.env`:

```bash
cp mobile/.env.example mobile/.env
```

```ini
EXPO_PUBLIC_API_URL="http://localhost:8000/api/v1"
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID="AIzaSyYourAndroidRestrictedKey"
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS="AIzaSyYourIOSRestrictedKey"
```

---

## 🚀 Quickstart Installation Guide

### Step 1: Start Database & Cache Containers
From the repository root:

```bash
docker compose up -d postgres redis
```

Verify PostGIS is running:
```bash
docker compose exec postgres psql -U postgres -d cargasph_dev -c "SELECT PostGIS_Version();"
```

### Step 2: Backend Setup & Migrations
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Seed initial vehicle catalog & DOE price data
python -m app.core.seed

# Start FastAPI development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### Step 3: Mobile Client Setup
```bash
cd ../mobile
npm install

# Start Expo development server
npx expo start
```
- Press `a` for Android Emulator
- Press `i` for iOS Simulator
- Scan QR code via Expo Go or run a custom Development Build (`npx expo run:android` / `npx expo run:ios`).

---

## 🗺️ Google Maps Platform Configuration

To prevent unauthorized usage and quota exhaustion, apply strict Google Cloud restrictions:

1. **Android Maps Key**:
   - In Google Cloud Console $\rightarrow$ Credentials $\rightarrow$ Restrict API Key.
   - Set Application Restriction: **Android apps**.
   - Package Name: `com.cargasph.app`.
   - Add SHA-1 certificate fingerprints (both Debug and Release keystore fingerprints).
   - API Restrictions: Restrict strictly to **Maps SDK for Android**.
2. **iOS Maps Key**:
   - Application Restriction: **iOS apps**.
   - Bundle Identifier: `ph.cargas.app`.
   - API Restrictions: Restrict strictly to **Maps SDK for iOS**.
3. **Backend Server Key**:
   - Application Restriction: **IP addresses** (Backend production server static IPs).
   - API Restrictions: Restrict to **Routes API** and **Places API (New)**.

---

## 🧪 Testing Commands

### Backend Tests
```bash
cd backend
pytest -v --cov=app tests/
```

### Mobile Tests
```bash
cd mobile
npm test
```

---

## 📱 Production Build & Release

### Android Release (EAS Build)
```bash
cd mobile
eas build --platform android --profile production
```
Produces an optimized `.aab` (Android App Bundle) ready for upload to Google Play Console.

### iOS Release (EAS Build)
```bash
cd mobile
eas build --platform ios --profile production
```
Produces an optimized `.ipa` ready for TestFlight and Apple App Store Review.

---

## 📂 Project Repository Structure

```text
CarGasPh/
├── docs/                        # Architectural diagrams & specifications
├── backend/                     # FastAPI backend application
│   ├── app/                     # Application source code
│   │   ├── api/v1/              # Versioned API routes
│   │   ├── core/                # Config, security, database connectors
│   │   ├── models/              # SQLAlchemy PostGIS ORM models
│   │   ├── schemas/             # Pydantic validation schemas
│   │   └── services/            # Fuel engine, Google proxy, DOE parser
│   ├── alembic/                 # Migration scripts
│   ├── tests/                   # Pytest test suite
│   ├── Dockerfile
│   └── requirements.txt
├── mobile/                      # React Native / Expo application
│   ├── app/                     # Expo Router file-based screens
│   ├── src/
│   │   ├── components/          # Atomic reusable UI components
│   │   ├── services/            # API & external service clients
│   │   ├── stores/              # Zustand state stores
│   │   ├── types/               # TypeScript interfaces
│   │   └── utils/               # Math, fuel formulas, formatters
│   ├── app.json                 # Expo configuration
│   └── package.json
├── docker-compose.yml           # Local development infrastructure
├── planning.md                  # Comprehensive technical blueprint
├── testing.md                   # Complete QA test strategy
├── progress.md                  # Development phase tracker
├── CHANGELOG.md                 # Canonical release changelog
└── README.md                    # Project documentation (this file)
```

---

## 🛡️ License

Copyright © 2026 CarGasPh Team. All rights reserved.  
Unauthorized distribution, copying, or modification is strictly prohibited.
