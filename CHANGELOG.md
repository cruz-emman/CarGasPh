# Changelog

All notable changes to the **CarGasPh** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note**: `CHANGELOG.md` is the canonical project changelog. `chaenlog.md` is maintained in sync for compatibility.

---

## [Unreleased]

### Added

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
- Replaced standard generic car database assumptions with normalized Philippine vehicle and motorcycle schemas.
- Replaced direct mobile client Google Places calls with backend PostGIS spatial tile caching (7-day TTL) to prevent API cost escalation.

### Fixed
- N/A (Phase 0 initial architecture release).

### Removed
- N/A.

### Security
- Established zero-secret policy for client mobile bundles; third-party Google Maps server keys and database credentials restricted to backend environment.
- Configured Google Cloud Console platform restrictions (Android SHA-1 fingerprint and iOS Bundle Identifier) for mobile map rendering keys.
- Architected location data governance with zero raw GPS breadcrumb retention on server to protect driver privacy.

---

## [0.1.0] - 2026-09-30

### Added
- Repository initialization and Phase 0 architectural documentation suite.
