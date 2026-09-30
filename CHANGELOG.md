# Changelog

All notable changes to the **CarGasPh** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note**: `CHANGELOG.md` is the canonical project changelog. `chaenlog.md` is maintained in sync for compatibility.

---

## [Unreleased]

### Added

- **Phase 2 Authentication & User Management**:
  - Pydantic v2 schemas in `backend/app/schemas/user_schema.py` for user registration, login, token responses, token rotation, and password resets.
  - JWT Bearer authentication dependency in `backend/app/api/deps.py` with automatic expiration and token type checks.
  - Endpoints in `backend/app/api/v1/endpoints/auth.py`:
    - `POST /auth/register`: Account creation with duplicate email verification and bcrypt hashing.
    - `POST /auth/login`: Credential authentication returning signed JWT access and refresh tokens.
    - `POST /auth/refresh`: Refresh token rotation preventing replay attacks.
    - `GET /auth/me`: Authenticated user profile retrieval.
    - `POST /auth/forgot-password` & `POST /auth/reset-password`: Signed temporary reset token workflow.
  - Endpoint in `backend/app/api/v1/endpoints/users.py`:
    - `PUT /users/me`: Update display name and password with current password verification.
  - Pytest test suite in `backend/tests/test_auth.py` verifying registration, duplicate prevention, credential verification, and unauthorized route protection.
  - Zod validation schemas in `mobile/src/utils/validation.ts` for login, registration, and forgot password.
  - Mobile authentication service in `mobile/src/services/auth.service.ts` wrapping fetch client and token persistence.
  - Reactive Zustand authentication store in `mobile/src/stores/useAuthStore.ts` with login, register, logout, session restoration, and token refresh.
  - Mobile navigation and screens in `mobile/app/(auth)/`:
    - `_layout.tsx`: Stack navigator with dark theme.
    - `login.tsx`: Login screen with React Hook Form, password visibility toggle, error banners, and redirect.
    - `register.tsx`: Registration screen with password policy verification and terms notice.
    - `forgot-password.tsx`: Password reset screen with success state confirmation.
  - Root gatekeeper in `mobile/app/index.tsx` routing authenticated motorists to `/(tabs)` and unauthenticated users to `/(auth)/login`.
  - Dynamic user profile and functional logout in `mobile/app/(tabs)/profile.tsx`.

- **Phase 1 Foundation & Project Setup**:
  - `docker-compose.yml` orchestrating `postgis/postgis:16-3.4`, `redis:7-alpine`, and FastAPI backend service with automated health checks and persistent volumes.
  - Technical documentation in `/docs` covering system architecture (`docs/architecture.md`), PostGIS spatial schema (`docs/database-schema.md`), and REST API specifications (`docs/api-specification.md`).
  - FastAPI backend structure with async SQLAlchemy 2.0 engine, connection pooling, and Alembic migration framework (`backend/alembic.ini`, `backend/alembic/env.py`).
  - 8 core SQLAlchemy PostGIS models: `User`, `VehicleMake`, `VehicleModel`, `VehicleVariant`, `UserVehicle`, `FuelType`, `FuelPriceRegion`, `FuelPrice`, `FuelPriceMovement`, `GasStationBrand`, `GasStation` (with `Geography(POINT, 4326)`), `SavedPlace`, `SavedRoute`, `TripHistory`, `FuelLog`, `OdometerLog`, `NewsArticle`, `NotificationRecord`, `ApiSyncLog`, and `UserReport`.
  - Pydantic v2 application settings with dynamic database connection assembly, CORS configuration, and security helpers for bcrypt hashing and JWT generation.
  - Production `/api/v1/health` endpoint probing live database connectivity and Redis cache ping status.
  - Async Pytest testing suite with ASGI transport client fixture in `backend/tests/conftest.py`.
  - Expo SDK 52 mobile client with typed routes, strict TypeScript configuration, ESLint, Prettier, and custom native permissions in `app.json`.
  - Global theme constants with Philippine peso formatting (`src/constants/theme.ts`), typed interfaces (`src/types/index.ts`), and secure API client with `expo-secure-store` JWT attachment (`src/services/api.ts`).
  - Zustand authentication store managing token lifecycle and session restoration.
  - Complete 5-tab mobile navigation (`Home`, `Map`, `Fuel`, `Garage`, `Profile`) featuring Philippine fuel rollback advisories, active vehicle cards, route cost estimators, and granular notification toggles.

- **Phase 0 Research & Technical Architecture**:
  - Comprehensive architectural blueprint in `planning.md` detailing cross-platform mobile architecture (React Native / Expo SDK 52 / Expo Router v4), backend services (FastAPI / SQLAlchemy 2.0 / PostgreSQL 16 + PostGIS), and spatial gas station caching.
  - Multi-tier data trust model (`OFFICIAL`, `VERIFIED_PARTNER`, `COMMUNITY_VERIFIED`, `COMMUNITY`, `ESTIMATED`) for Philippine Department of Energy (DOE) fuel pricing.
  - Hybrid vehicle catalog strategy combining external vehicle APIs with a curated Philippine local database for passenger cars and popular motorcycles (Aerox, NMAX, Click, Beat, PCX).
  - Exact fuel consumption, out-of-pocket trip cost, Cost-per-Kilometer ($\text{CPK}$), and range warning mathematical algorithms.
  - Master quality assurance and testing plan in `testing.md` including 12 deterministic fuel calculation benchmark scenarios, location permission matrix, and failure mode behaviors.
  - Development phase tracker in `progress.md` covering Phase 0 through Phase 15 with standardized status blocks.
  - Project overview, installation instructions, environment configuration, and deployment procedures in `README.md`.
  - Itemized three-tier infrastructure and operating cost model (Prototype, Small Production, Growing Production) with Google Maps optimization techniques.

### Changed
- Updated root `app/index.tsx` from hardcoded redirect to reactive session verification gatekeeper.
- Replaced mocked user in `app/(tabs)/profile.tsx` with dynamic user profile from `useAuthStore`.

### Security
- Password hashing with bcrypt (salt rounds $\ge 12$).
- Refresh token rotation in `/auth/refresh` generating new access + refresh token pairs to prevent token replay attacks.
- Isolated JWT tokens in iOS Keychain / Android Keystore using `expo-secure-store`.

---

## [0.1.0] - 2026-09-30

### Added
- Repository initialization and Phase 0 architectural documentation suite.
