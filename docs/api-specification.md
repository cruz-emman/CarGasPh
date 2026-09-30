# CarGasPh — REST API Specification (v1)

Base URL: `/api/v1`

---

## 1. Authentication Endpoints (`/auth`)
- `POST /auth/register` — Register a new motorist account.
- `POST /auth/login` — Authenticate credentials and receive Access + Refresh tokens.
- `POST /auth/refresh` — Rotate refresh token and issue new access token.
- `GET /auth/me` — Retrieve current authenticated user profile.

---

## 2. Vehicle Catalog & Garage (`/vehicles` & `/garage`)
- `GET /vehicles/makes` — List all vehicle makes (optionally filtered by category: `car` or `motorcycle`).
- `GET /vehicles/models?make_id={id}` — List models for a make.
- `GET /vehicles/variants?model_id={id}` — List trim variants with fuel economy data.
- `GET /garage` — List user's garage vehicles.
- `POST /garage` — Add a vehicle to garage (preloaded variant or custom specs).
- `PUT /garage/{id}` — Update user vehicle details.
- `PATCH /garage/{id}/default` — Set vehicle as default/active.
- `DELETE /garage/{id}` — Remove vehicle from garage.

---

## 3. Fuel Prices & Intelligence (`/fuel-prices`)
- `GET /fuel-prices/latest?region={code}` — Get latest prevailing prices by fuel product (RON 91, RON 95, RON 97+, Diesel, Kerosene).
- `GET /fuel-prices/movements` — Get weekly price adjustments (Hikes/Rollbacks with effective dates).
- `GET /fuel-prices/history?fuel_type={type}&range=1M|3M|6M|1Y` — Historical time-series data points.

---

## 4. Routing & Fuel Calculations (`/routes`)
- `POST /routes/calculate` — Proxy to Google Routes API with Redis caching.
  - **Body**: `{ origin: { lat, lng }, destination: { lat, lng }, vehicle_id?: string, travel_mode: "DRIVE" | "TWO_WHEELER" }`
  - **Response**: `{ distance_km, duration_seconds, polyline, fuel_required_liters, estimated_cost_php, round_trip_cost_php, cpk_php, range_warning }`

---

## 5. Gas Stations (`/stations`)
- `GET /stations/nearby?lat={lat}&lng={lng}&radius_meters=5000&brand={brand}` — PostGIS spatial query for nearby stations.

---

## 6. Fuel News & Advisories (`/news`)
- `GET /news/latest?limit=20` — Aggregated fuel news and DOE announcements.

---

## 7. Fuel Logbook (`/fuel-logs`)
- `GET /fuel-logs?vehicle_id={id}` — List fill-up logs for a vehicle.
- `POST /fuel-logs` — Record a pump fill-up (computes real-world km/L and updates rolling average).
