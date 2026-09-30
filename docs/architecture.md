# CarGasPh — System Architecture Documentation

## 1. High-Level System Architecture

CarGasPh is partitioned into three discrete layers:
1. **Client Tier**: Cross-platform React Native / Expo application targeting iOS and Android.
2. **Service Tier**: Asynchronous Python FastAPI microservices, providing JWT authentication, vehicle data normalization, fuel calculation pipelines, and proxy caching for 3rd-party services.
3. **Data Tier**: PostgreSQL 16 with PostGIS spatial extension for geofencing and nearest-neighbor gas station spatial queries, supplemented by an in-memory Redis layer for route and session caching.

```text
       +---------------------------------------------+
       |           Mobile Client (Expo SDK 52)       |
       |  React Native • TypeScript • Zustand • Maps |
       +----------------------+----------------------+
                              |
                              | HTTPS (TLS 1.3)
                              v
       +---------------------------------------------+
       |         Cloudflare Edge / Nginx Proxy       |
       +----------------------+----------------------+
                              |
                              v
       +---------------------------------------------+
       |             FastAPI Backend (ASGI)          |
       |  Auth • Garage • Fuel Intel • Route Proxy   |
       +-----------+-------------------+-------------+
                   |                   |
         Async SQL |         Key-Value |
                   v                   v
       +--------------------+  +---------------------+
       |   PostgreSQL 16    |  |       Redis 7       |
       |     + PostGIS      |  | (Route & Tile Cache)|
       +--------------------+  +---------------------+
```

## 2. Component Responsibilities

### Mobile Client (`/mobile`)
- **Navigation Engine**: Screen transitions, tab navigation, dynamic route previews via `expo-router`.
- **Location Awareness**: Foreground GPS polling using `expo-location` with user permission management.
- **Client Cache**: Stale-while-revalidate strategy managed by `@tanstack/react-query` to ensure instant UI rendering even under weak Philippine LTE/3G signals.
- **Hardware Security**: Refresh tokens and sensitive credentials stored strictly inside iOS Keychain / Android Keystore using `expo-secure-store`.

### Backend Engine (`/backend`)
- **Route Proxy & Rate Limiting**: Intercepts Google Routes API queries, rounds coordinates to 3 decimal places to normalize cache keys, checks Redis cache, and falls back to Google Routes v2 only when necessary.
- **Fuel Intelligence Pipeline**: Ingestion worker that parses weekly Department of Energy (DOE) price monitoring bulletins and adjustment advisories.
- **Fuel Calculation Micro-Engine**: Mathematical module computing liters used, one-way/round-trip cost, Cost-per-Kilometer (CPK), and range warnings.
- **Spatial Gas Station Service**: PostGIS spatial queries (`ST_DWithin`, `ST_Distance`) returning gas stations within a 5km radius of any coordinate point or route corridor.
