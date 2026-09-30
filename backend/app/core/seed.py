import asyncio
import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.core.vehicle_seeds import PHILIPPINE_VEHICLE_SEEDS
from app.models.vehicle import VehicleMake, VehicleModel, VehicleVariant
from app.models.fuel import FuelType, FuelPriceRegion

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


STANDARD_FUEL_TYPES = [
    {"code": "RON91", "display_name": "Gasoline Unleaded (RON 91)", "description": "Regular Unleaded gasoline with minimum Research Octane Number 91."},
    {"code": "RON95", "display_name": "Gasoline Premium (RON 95)", "description": "Premium gasoline with minimum Research Octane Number 95."},
    {"code": "RON97", "display_name": "Gasoline Racing (RON 97+)", "description": "High-octane Super Premium / Racing gasoline."},
    {"code": "DIESEL", "display_name": "Automotive Diesel Oil", "description": "Clean diesel fuel for commercial and passenger diesel engines."},
    {"code": "KEROSENE", "display_name": "Kerosene", "description": "Illuminating and heating kerosene."},
]

STANDARD_REGIONS = [
    {"code": "NCR", "name": "Metro Manila (NCR)", "description": "National Capital Region (Metro Manila)"},
    {"code": "REGION_3", "name": "Central Luzon (Region III)", "description": "Pampanga, Bulacan, Bataan, Nueva Ecija, Tarlac, Zambales"},
    {"code": "REGION_4A", "name": "CALABARZON (Region IV-A)", "description": "Cavite, Laguna, Batangas, Rizal, Quezon"},
]


async def seed_fuel_types_and_regions(db: AsyncSession):
    logger.info("Checking Fuel Types...")
    for item in STANDARD_FUEL_TYPES:
        q = select(FuelType).where(FuelType.code == item["code"])
        res = await db.execute(q)
        existing = res.scalar_one_or_none()
        if not existing:
            ft = FuelType(code=item["code"], display_name=item["display_name"], description=item["description"])
            db.add(ft)
            logger.info(f"Added Fuel Type: {item['code']}")

    logger.info("Checking Fuel Price Regions...")
    for item in STANDARD_REGIONS:
        q = select(FuelPriceRegion).where(FuelPriceRegion.code == item["code"])
        res = await db.execute(q)
        existing = res.scalar_one_or_none()
        if not existing:
            reg = FuelPriceRegion(code=item["code"], name=item["name"], description=item["description"])
            db.add(reg)
            logger.info(f"Added Fuel Region: {item['code']}")

    await db.commit()


async def seed_vehicles(db: AsyncSession):
    logger.info("Seeding Philippine Vehicle Catalog...")
    makes_cache = {}

    for entry in PHILIPPINE_VEHICLE_SEEDS:
        make_name = entry["make"]
        category = entry["category"]
        model_name = entry["model"]
        year_start = entry.get("year_start")
        year_end = entry.get("year_end")

        # 1. Make
        if make_name not in makes_cache:
            q = select(VehicleMake).where(VehicleMake.name == make_name)
            res = await db.execute(q)
            make_obj = res.scalar_one_or_none()
            if not make_obj:
                make_obj = VehicleMake(name=make_name, category=category)
                db.add(make_obj)
                await db.flush()
                logger.info(f"Created Make: {make_name} ({category})")
            makes_cache[make_name] = make_obj.id

        make_id = makes_cache[make_name]

        # 2. Model
        q_model = select(VehicleModel).where(VehicleModel.make_id == make_id, VehicleModel.name == model_name)
        res_model = await db.execute(q_model)
        model_obj = res_model.scalar_one_or_none()
        if not model_obj:
            model_obj = VehicleModel(make_id=make_id, name=model_name, year_start=year_start, year_end=year_end)
            db.add(model_obj)
            await db.flush()
            logger.info(f"Created Model: {make_name} {model_name}")

        model_id = model_obj.id

        # 3. Variants
        for v in entry["variants"]:
            v_name = v["name"]
            v_year = v["year"]
            q_var = select(VehicleVariant).where(
                VehicleVariant.model_id == model_id,
                VehicleVariant.name == v_name,
                VehicleVariant.year == v_year,
            )
            res_var = await db.execute(q_var)
            var_obj = res_var.scalar_one_or_none()
            if not var_obj:
                var_obj = VehicleVariant(
                    model_id=model_id,
                    name=v_name,
                    year=v_year,
                    engine_displacement=v.get("displacement"),
                    transmission=v.get("transmission"),
                    fuel_type=v["fuel_type"],
                    tank_capacity_liters=v["tank_capacity"],
                    official_fuel_economy_kml=v["fuel_economy"],
                    fuel_economy_source=v.get("source", "MANUFACTURER"),
                )
                db.add(var_obj)

    await db.commit()
    logger.info("Successfully seeded Philippine Vehicle and Motorcycle Database.")


async def main():
    async with AsyncSessionLocal() as session:
        await seed_fuel_types_and_regions(session)
        await seed_vehicles(session)


if __name__ == "__main__":
    asyncio.run(main())
