# CarGasPh — Master Testing Strategy & Quality Assurance Plan

> **Document Version**: 1.0.0  
> **Status**: APPROVED  
> **Target Platforms**: Android (API 26–35), iOS (16.0–18.x), Backend REST API (FastAPI / PostgreSQL 16)  
> **Last Updated**: 2026-09-30

---

## 1. Testing Frameworks & Tooling Stack

| Domain | Framework / Tool | Purpose |
|---|---|---|
| **Mobile Unit & Component Tests** | `Jest` + `@testing-library/react-native` | UI component rendering, custom hooks, Zustand store mutations, local formatters. |
| **Mobile Integration / E2E** | `Maestro` / `Detox` | Cross-platform navigation flow, form entry, permission modals, simulated GPS movement. |
| **Backend Unit & Integration Tests**| `Pytest` + `pytest-asyncio` + `httpx` | FastAPI endpoints, calculation engine math, JWT auth, database queries. |
| **Database & Migration Tests** | `Testcontainers` / Temporary PostgreSQL | Dockerized Postgres with PostGIS testing Alembic migrations and spatial queries. |
| **API Mocking & Network Simulation**| `MSW` (Mock Service Worker) / `pytest-mock` | Simulating 3rd-party API failures, network dropouts, rate-limit 429s, timeout 504s. |
| **Load & Stress Testing** | `Locust` / `k6` | High-concurrency route calculation and gas-station query stress testing. |
| **Security & SAST** | `Bandit` (Python), `npm audit`, `eslint-plugin-security` | Vulnerability scanning, credential leak prevention, SQL injection validation. |

---

## 2. Fuel Calculation Engine Test Scenarios (Authoritative Expected Results)

The fuel calculation engine is the financial core of CarGasPh. Every mathematical function must pass deterministic unit tests matching these exact benchmark cases.

```text
Core Formulas:
1. Liters Used = Distance (km) / Fuel Economy (km/L)
2. One-Way Cost = Liters Used × Fuel Price (₱/L)
3. Round-Trip Cost = 2 × One-Way Cost
4. Cost Per Kilometer (CPK) = Fuel Price (₱/L) / Fuel Economy (km/L)
5. Personal Rolling Fuel Economy = (Odo_Current - Odo_Previous) / Liters_Filled
6. Remaining Range = Remaining Fuel (L) × Fuel Economy (km/L)
```

### Scenario Matrix

| ID | Vehicle Name | Fuel Type | Distance (km) | Fuel Economy (km/L) | Price (₱/L) | Expected Liters | Expected One-Way (₱) | Expected Round-Trip (₱) | Expected CPK (₱/km) |
|---|---|---|---|---|---|---|---|---|---|
| **TC-CALC-01** | Yamaha Aerox 155 | Gas RON 91 | 120.00 | 40.00 | 62.00 | **3.000 L** | **₱186.00** | **₱372.00** | **₱1.55 / km** |
| **TC-CALC-02** | Yamaha Aerox 155 | Gas RON 91 | 74.00 | 40.00 | 62.00 | **1.850 L** | **₱114.70** | **₱229.40** | **₱1.55 / km** |
| **TC-CALC-03** | Honda Click 125i | Gas RON 91 | 150.00 | 48.00 | 62.00 | **3.125 L** | **₱193.75** | **₱387.50** | **₱1.29 / km** |
| **TC-CALC-04** | Yamaha NMAX 155 | Gas RON 95 | 150.00 | 38.00 | 65.50 | **3.947 L** | **₱258.55** | **₱517.11** | **₱1.72 / km** |
| **TC-CALC-05** | Toyota Vios 1.3E | Gas RON 95 | 74.00 | 14.50 | 65.50 | **5.103 L** | **₱334.28** | **₱668.56** | **₱4.52 / km** |
| **TC-CALC-06** | Mitsubishi Mirage G4 | Gas RON 91 | 110.00 | 16.20 | 61.80 | **6.790 L** | **₱419.63** | **₱839.26** | **₱3.81 / km** |
| **TC-CALC-07** | Isuzu D-Max 3.0 4x4 | Diesel | 240.00 | 11.20 | 58.20 | **21.429 L** | **₱1,247.14** | **₱2,494.29** | **₱5.20 / km** |
| **TC-CALC-08** | Toyota Fortuner 2.8 | Diesel | 65.00 | 9.80 | 58.20 | **6.633 L** | **₱386.02** | **₱772.04** | **₱5.94 / km** |
| **TC-CALC-09** | Zero Distance Check | Gas RON 91 | 0.00 | 40.00 | 62.00 | **0.000 L** | **₱0.00** | **₱0.00** | **₱1.55 / km** |
| **TC-CALC-10** | Divide by Zero Check | Gas RON 91 | 100.00 | 0.00 | 62.00 | **ERROR** | **ERROR** | **ERROR** | **ERROR** |

### Scenario 11: Real-World Rolling Average Calculation (Full Tank Method)
- **Previous Log**: Odometer = $12,450\text{ km}$, Full Tank = Yes.
- **Current Log**: Odometer = $12,670\text{ km}$, Liters Filled = $5.50\text{ L}$, Price = $₱63.00/\text{L}$, Total = $₱346.50$, Full Tank = Yes.
- **Distance Covered**: $12,670 - 12,450 = 220\text{ km}$.
- **Calculated Economy**: $220 / 5.50 = 40.00\text{ km/L}$.
- **Expected Moving Average Update**: System incorporates this into user's personal profile.

### Scenario 12: Range Warning Alert
- **Vehicle Tank**: Yamaha Aerox ($5.5\text{ L}$ capacity).
- **User Input / Estimated Remaining Fuel**: $1.5\text{ L}$.
- **Fuel Economy**: $40\text{ km/L}$.
- **Estimated Remaining Range**: $1.5 \times 40 = 60\text{ km}$.
- **Route Calculated**: Manila to Lipa City ($82\text{ km}$).
- **Expected Assertion**:
  - `rangeWarningTriggered == true`
  - Alert banner rendered: *"⚠️ Route distance (82 km) exceeds your estimated range (60 km). Plan a gas stop along the route."*

---

## 3. Location & GPS Testing Strategy

### 3.1 Permission State Matrix
| State | OS Behavior | Expected App Behavior |
|---|---|---|
| **Not Determined** | Initial app launch on Map screen. | Display custom explanatory modal: *"CarGasPh requires your location to calculate routes and locate nearby gas stations"* before triggering native OS prompt. |
| **Granted Foreground** (`whileInUse`) | GPS position acquired. | Render blue dot on user coordinates; activate route origin auto-fill. |
| **Denied** | User tapped "Don't Allow". | Gracefully disable live GPS tracking; show informational banner: *"Location access disabled. You can still manually search and select starting locations."* |
| **Blocked Permanently** | User checked "Never ask again" (Android) or denied in iOS Settings. | Direct user to OS App Settings with a one-tap deep-link button (`Linking.openSettings()`). |

### 3.2 GPS Signal Loss & Degradation Simulation
- **Tunnel / Low Accuracy Simulation**: Accuracy degradation $> 50$ meters.
- **Expected Assertion**: App retains last known valid coordinate with low-confidence ring; does not spasm map camera.

---

## 4. Map & Navigation Integration Testing

- [ ] **TC-NAV-01: Autocomplete Latency & Debouncing**:
  - Assert that typing "BGC Taguig" triggers debounced API call after exactly 400ms.
  - Assert that single-letter entries ("B", "BG") do not trigger billing requests.
  - Assert that `sessionToken` is passed with every autocomplete request until destination selection.
- [ ] **TC-NAV-02: Route Polyline Decoding**:
  - Validate that encoded polyline strings from backend Routes proxy decode into valid `[{ latitude, longitude }]` arrays matching the expected route trajectory.
- [ ] **TC-NAV-03: Alternative Routes Handling**:
  - When backend returns primary and alternative routes (e.g. SLEX vs. Service Road), verify UI allows switching between them and recalculates fuel cost instantly based on the chosen route's distance.
- [ ] **TC-NAV-04: External Navigation Intent Launching**:
  - Tap "Navigate in Waze": Verifies intent URL `waze://?ll=14.5547,121.0244&navigate=yes`.
  - Tap "Navigate in Google Maps": Verifies intent URL `google.navigation:q=14.5547,121.0244`.

---

## 5. Philippine Fuel Price Ingestion & Trust Model Testing

- [ ] **TC-FUEL-01: DOE Parser Weekly Ingestion**:
  - Ingest simulated DOE Metro Manila PDF/HTML bulletin.
  - Verify prices parsed for RON 91, RON 95, RON 97+, Diesel, Kerosene match the bulletin.
  - Verify effective date matches the stated Tuesday 6:00 AM timestamp.
- [ ] **TC-FUEL-02: Movement Delta Calculation**:
  - Prior Week Diesel = $₱58.90/\text{L}$, New Week Diesel = $₱58.20/\text{L}$.
  - Assert `delta_amount == -0.70`, `movement_type == 'ROLLBACK'`.
  - Assert UI renders green badge with downward arrow `↓ -₱0.70/L`.
- [ ] **TC-FUEL-03: Data Trust Labeling**:
  - Assert that any price ingested from DOE displays badge `OFFICIAL`.
  - Assert that any unverified user submission displays badge `COMMUNITY (UNVERIFIED)`.
  - Assert that official prices and community estimates are never blended into a single unmarked number.

---

## 6. Gas Station Spatial Discovery Testing

- [ ] **TC-STN-01: PostGIS Radius Bounding**:
  - Insert stations at $2.1\text{ km}$, $4.8\text{ km}$, and $6.2\text{ km}$ from test coordinate ($14.5547, 121.0244$).
  - Query with $5000\text{m}$ radius limit.
  - Assert stations at $2.1\text{ km}$ and $4.8\text{ km}$ are returned; $6.2\text{ km}$ is excluded.
- [ ] **TC-STN-02: Brand Filtering**:
  - Select filter "Cleanfuel only".
  - Assert returned result set contains only `brand_name == 'Cleanfuel'`.

---

## 7. Vehicle Database & Catalog Testing

- [x] **TC-VEH-01: Philippine Motorcycle & Car Catalog Integrity**:
  - Preloaded seeds queryable for top Philippine motorcycles (Aerox 155, Click 125, NMAX 155, BeAT) and cars (Vios, Innova, Mirage G4, Hilux, D-Max). *(Verified in test_garage.py)*
- [x] **TC-VEH-02: Vehicle Creation Validation Bounds**:
  - Submitting negative tank capacity or zero fuel economy returns HTTP 422 Unprocessable Entity. *(Verified in test_garage.py)*
- [x] **TC-VEH-03: Default Vehicle Exclusivity & Promotion**:
  - First vehicle automatically set to default. Setting another vehicle as default unsets previous default. *(Verified in test_garage.py)*
- [x] **TC-VEH-04: Full Tank Range Computation**:
  - Verifies computed `estimated_full_range_km` matches exact `tank_capacity_liters * custom_fuel_economy_kml`. *(Verified in test_garage.py)*

---

## 8. Network Failure, Offline & Quota Exceeded Testing

```text
┌───────────────────────────────┬─────────────────────────────────────────────────────────────────┐
│ Failure Condition             │ Expected App Behavior                                           │
├───────────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ HTTP 429 Rate Limit Exceeded  │ App shows non-blocking toast: "Server busy. Please wait a       │
│                               │ moment." Backs off exponentially.                               │
├───────────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ HTTP 500 / 503 Backend Crash  │ App renders error state with "Retry" button. Cached local data   │
│                               │ (garage, previous route) remains interactive.                   │
├───────────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ Complete Network Disconnect   │ Offline banner appears at top: "Offline Mode — displaying       │
│ (Airplane Mode)               │ cached fuel prices". Fuel calculator allows manual km entry.   │
├───────────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ Google Maps Quota Exceeded    │ Backend falls back gracefully: alerts admin; returns cached     │
│ (Over Query Limit)            │ distance estimates or notifies user to retry shortly.           │
└───────────────────────────────┴─────────────────────────────────────────────────────────────────┘
```

---

## 9. Security, Authentication & Data Protection Testing

- [x] **TC-SEC-01: Password Hashing Verification**:
  - Assert passwords in database are hashed with bcrypt (salt rounds $\ge 12$). Plaintext password never written to logs or database. *(Verified in test_auth.py)*
- [x] **TC-SEC-02: JWT Expiry & Refresh Cycle**:
  - Rotation in `/auth/refresh` issues fresh access + refresh token pair. *(Verified in test_auth.py)*
- [x] **TC-SEC-03: Duplicate Registration Prevention**:
  - Assert attempting to register an already-registered email returns HTTP 400 with "already exists". *(Verified in test_auth.py)*
- [x] **TC-SEC-04: Unauthorized Access Protection**:
  - Assert accessing `/auth/me` without Bearer token returns HTTP 401. *(Verified in test_auth.py)*
- [ ] **TC-SEC-05: Mobile Key Leak Prevention**:
  - Decompile test Android `.apk` / Inspect iOS bundle.
  - Verify that database credentials, JWT secret keys, and Google Maps server secret keys are NOT present anywhere in binary assets or string tables.

---

## 10. Platform-Specific Testing (Android & iOS)

### 10.1 Android Specifics (Tested on Android 11, 13, 15)
- [ ] Android Hardware Back Button handling (does not unexpectedly exit app during multi-step add-vehicle flow).
- [ ] Soft keyboard avoiding view behavior on small screens (e.g. 5.5" displays).
- [ ] Dark Mode and Light Mode theme contrast compliance (WCAG AA standard).

### 10.2 iOS Specifics (Tested on iPhone SE, iPhone 14/15 Pro)
- [ ] Safe Area Inset compliance (Dynamic Island and bottom home bar do not obscure navigation cards).
- [ ] Location permission dialog correctly presents custom string from `NSLocationWhenInUseUsageDescription`.
- [ ] Push notification authorization modal respects user decision.

---

## 11. Production Smoke Test Checklist

Execute this checklist immediately after every production backend deploy or mobile release:

- [ ] 1. Fresh user registration succeeds with valid verification email.
- [ ] 2. Login succeeds and returns valid JWT access and refresh tokens.
- [ ] 3. Default vehicle loads in Garage tab without errors.
- [ ] 4. Adding a new vehicle (e.g. Honda Click 125i) persists and updates default selection.
- [ ] 5. Map tab renders Google Maps tiles centered on Metro Manila.
- [ ] 6. Search for destination "Tagaytay City" returns route polyline and distance ($\approx 74\text{ km}$).
- [ ] 7. Trip fuel cost calculates and displays Liters, Price, and Total ₱.
- [ ] 8. Fuel tab displays latest official DOE fuel prices with source and date.
- [ ] 9. Price movement shows correct Hike / Rollback indicator.
- [ ] 10. Gas station tab populates nearby stations within 5km.
- [ ] 11. Fuel news feed displays at least 5 recent headlines with working external source links.
- [ ] 12. Logging out clears secure tokens and redirects to Login screen.
