# CarGasPh — Database Schema & Data Dictionary

The persistence layer uses **PostgreSQL 16** with the **PostGIS** geospatial extension enabled.

---

## 1. Core Tables Summary

| Table Name | Description | Key Fields / Indexes |
|---|---|---|
| `users` | Registered motorists and administrators | `id (UUID)`, `email (UNIQUE)`, `password_hash`, `role` |
| `vehicle_makes` | Vehicle manufacturers (Toyota, Yamaha, Honda) | `id`, `name (UNIQUE)`, `vehicle_category` |
| `vehicle_models` | Vehicle model families (Vios, Aerox, Click) | `id`, `make_id (FK)`, `name` |
| `vehicle_variants` | Exact trims and specs (1.3E Dual VVT-i, 155 ABS) | `id`, `model_id (FK)`, `tank_capacity_liters`, `official_fuel_economy_kml` |
| `user_vehicles` | User garage vehicles | `id (UUID)`, `user_id (FK)`, `variant_id (FK)`, `is_default` |
| `fuel_types` | Canonical fuel products | `id`, `code (RON91, RON95, RON97, DIESEL, KEROSENE)` |
| `fuel_price_regions` | Geographic price zones | `id`, `code (NCR, REGION_3, REGION_4A)`, `name` |
| `fuel_prices` | Authoritative retail prices | `id (UUID)`, `fuel_type_id (FK)`, `region_id (FK)`, `price_avg`, `date_effective` |
| `fuel_price_movements` | Weekly price adjustment advisories | `id (UUID)`, `fuel_type_id (FK)`, `delta_amount`, `movement_type (HIKE/ROLLBACK)` |
| `gas_station_brands` | Station corporate brands | `id`, `name (Petron, Shell, Caltex, Cleanfuel, Seaoil)` |
| `gas_stations` | Station locations with PostGIS points | `id (UUID)`, `brand_id (FK)`, `location (GEOGRAPHY)`, `GIST(location)` index |
| `fuel_logs` | Actual fill-up logs for personal economy | `id (UUID)`, `user_vehicle_id (FK)`, `odometer_km`, `liters_filled`, `total_amount` |
| `news_articles` | Fuel news and DOE advisory metadata | `id (UUID)`, `title`, `summary`, `source_url`, `published_at` |

---

## 2. Spatial Queries

Gas stations are retrieved using spatial distance queries over PostGIS `GEOGRAPHY(Point, 4326)`:

```sql
SELECT 
    gs.id,
    gs.name,
    b.name AS brand,
    ST_Distance(gs.location, ST_MakePoint(:longitude, :latitude)::geography) AS distance_meters
FROM gas_stations gs
JOIN gas_station_brands b ON b.id = gs.brand_id
WHERE ST_DWithin(gs.location, ST_MakePoint(:longitude, :latitude)::geography, :radius_meters)
ORDER BY distance_meters ASC
LIMIT 50;
```
