# Changelog

All notable changes to the **CarGasPh** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note**: `CHANGELOG.md` is the canonical project changelog. `chaenlog.md` is maintained in sync for compatibility.

---

## [Unreleased]

### Added

- **Phase 3 Vehicle Garage & Philippine Catalog**:
  - Curated seed dataset in `backend/app/core/vehicle_seeds.py` representing top 30 Philippine motorcycles (Aerox 155, NMAX 155, Click 125/160, BeAT 110, PCX 160, ADV 160, Burgman Street, Raider R150 Fi) and top 50 Philippine cars/SUVs/MPVs/Pickups (Vios, Innova, Wigo, Hilux, Fortuner, Mirage G4, Xpander, D-Max, Navara, Ranger, Ertiga Hybrid).
  - Idempotent seeding script in `backend/app/core/seed.py` initializing vehicle makes, models, variants, canonical fuel types, and regional pricing zones.
  - Pydantic v2 schemas in `backend/app/schemas/vehicle_schema.py` for catalog discovery, search items, and user vehicle validation (enforcing strictly positive tank capacity and fuel economy).
  - Catalog discovery endpoints in `backend/app/api/v1/endpoints/vehicles.py`:
    - `GET /vehicles/makes`: List manufacturers by category.
    - `GET /vehicles/models`: List models by manufacturer.
    - `GET /vehicles/variants`: List trims with official fuel ratings.
    - `GET /vehicles/search`: Full-text catalog search.
  - User Garage CRUD endpoints in `backend/app/api/v1/endpoints/garage.py`:
    - `GET /garage`: List user's garage vehicles.
    - `POST /garage`: Add vehicle with automatic default designation for the initial vehicle.
    - `GET /garage/default`: Retrieve primary active default vehicle.
    - `GET /garage/{id}`: Single vehicle retrieval with access control.
    - `PUT /garage/{id}`: Update nickname, fuel economy, tank size, or odometer.
    - `PATCH /garage/{id}/default`: Set vehicle as active default (unsetting others).
    - `DELETE /garage/{id}`: Remove vehicle (automatically promoting next vehicle to default if needed).
  - Pytest automated test suite in `backend/tests/test_garage.py` validating catalog search, validation constraints, default promotion, and range math.
  - Mobile vehicle service in `mobile/src/services/vehicle.service.ts` connecting catalog and garage APIs.
  - Zustand garage store in `mobile/src/stores/useGarageStore.ts` managing vehicle collection, active default selection, and optimistic updates.
  - Interactive Add Vehicle Wizard in `mobile/app/garage/add-vehicle.tsx` with two-wheeler vs car toggle, debounced Philippine catalog search with spec autofill, custom manual entry, and default vehicle toggle.
  - Vehicle Detail Screen in `mobile/app/garage/[id].tsx` with full tank range calculations, cost-per-km metrics, default switcher, and deletion confirmation dialog.
  - Updated Garage Tab (`mobile/app/(tabs)/garage.tsx`) with pull-to-refresh, empty state, and direct navigation to vehicle details.
  - Updated Home Tab (`mobile/app/(tabs)/index.tsx`) binding the Active Vehicle Card to real garage data.

- **Phase 2 Authentication & User Management**:
  - Pydantic v2 schemas in `backend/app/schemas/user_schema.py` for user registration, login, token responses, token rotation, and password resets.
  - JWT Bearer authentication dependency in `backend/app/api/deps.py` with automatic expiration and token type checks.
  - Endpoints in `backend/app/api/v1/endpoints/auth.py` and `users.py`.
  - Pytest test suite in `backend/tests/test_auth.py`.
  - Zod validation schemas in `mobile/src/utils/validation.ts`.
  - Mobile authentication service in `mobile/src/services/auth.service.ts`.
  - Reactive Zustand authentication store in `mobile/src/stores/useAuthStore.ts`.
  - Mobile authentication screens in `mobile/app/(auth)/` (`login.tsx`, `register.tsx`, `forgot-password.tsx`).
  - Root session restoration gatekeeper in `mobile/app/index.tsx`.
  - Dynamic user profile and functional logout in `mobile/app/(tabs)/profile.tsx`.

- **Phase 1 Foundation & Project Setup**:
  - `docker-compose.yml` orchestrating `postgis/postgis:16-3.4`, `redis:7-alpine`, and FastAPI backend service.
  - Technical documentation in `/docs`.
  - FastAPI backend structure with async SQLAlchemy 2.0 engine, Alembic migrations, and PostGIS models.
  - Expo SDK 52 mobile client with typed routes, strict TypeScript, and 5 core tab screens.

- **Phase 0 Research & Technical Architecture**:
  - Comprehensive architectural blueprint in `planning.md`.
  - Master quality assurance and testing plan in `testing.md`.
  - Development phase tracker in `progress.md`.
  - Project documentation in `README.md`.

### Changed
- Home tab Active Vehicle Card updated from static mockup to dynamic reactive state synced with the active garage default vehicle.

---

## [0.1.0] - 2026-09-30

### Added
- Repository initialization and Phase 0 architectural documentation suite.
