"""
Curated Seed Dataset of Top Philippine Vehicles & Motorcycles.
Data sources: Manufacturer Specifications, Philippine DOE Eco Run data, Motoring Media Standardized Tests.
"""

PHILIPPINE_VEHICLE_SEEDS = [
    # =========================================================================
    # MOTORCYCLES (Top 30 Philippine Two-Wheelers)
    # =========================================================================
    # Yamaha
    {
        "make": "Yamaha", "category": "motorcycle", "model": "Aerox 155", "year_start": 2021, "year_end": 2026,
        "variants": [
            {"name": "Standard 155", "year": 2024, "displacement": "155 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 5.5, "fuel_economy": 40.0, "source": "TEST_DRIVE"},
            {"name": "Connected ABS 155", "year": 2025, "displacement": "155 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 5.5, "fuel_economy": 39.5, "source": "COMMUNITY_AVERAGE"},
        ]
    },
    {
        "make": "Yamaha", "category": "motorcycle", "model": "NMAX 155", "year_start": 2020, "year_end": 2026,
        "variants": [
            {"name": "Standard 155", "year": 2024, "displacement": "155 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 7.1, "fuel_economy": 38.0, "source": "TEST_DRIVE"},
            {"name": "ABS Connected 155", "year": 2025, "displacement": "155 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 7.1, "fuel_economy": 37.5, "source": "COMMUNITY_AVERAGE"},
        ]
    },
    {
        "make": "Yamaha", "category": "motorcycle", "model": "Mio i125", "year_start": 2018, "year_end": 2026,
        "variants": [
            {"name": "Mio i125 Standard", "year": 2024, "displacement": "125 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 4.2, "fuel_economy": 45.0, "source": "MANUFACTURER"},
            {"name": "Mio i125 S", "year": 2025, "displacement": "125 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 4.2, "fuel_economy": 45.5, "source": "MANUFACTURER"},
        ]
    },
    {
        "make": "Yamaha", "category": "motorcycle", "model": "Mio Gravis 125", "year_start": 2020, "year_end": 2026,
        "variants": [
            {"name": "Gravis 125", "year": 2024, "displacement": "125 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 4.2, "fuel_economy": 43.0, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Yamaha", "category": "motorcycle", "model": "Mio Fazzio 125", "year_start": 2022, "year_end": 2026,
        "variants": [
            {"name": "Fazzio Hybrid 125", "year": 2025, "displacement": "125 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 5.1, "fuel_economy": 46.0, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Yamaha", "category": "motorcycle", "model": "Sniper 155", "year_start": 2021, "year_end": 2026,
        "variants": [
            {"name": "Sniper 155 Standard", "year": 2024, "displacement": "155 cc", "transmission": "Manual (6-speed)", "fuel_type": "Gasoline RON 95", "tank_capacity": 5.4, "fuel_economy": 44.0, "source": "TEST_DRIVE"},
            {"name": "Sniper 155R", "year": 2025, "displacement": "155 cc", "transmission": "Manual (6-speed)", "fuel_type": "Gasoline RON 95", "tank_capacity": 5.4, "fuel_economy": 43.5, "source": "COMMUNITY_AVERAGE"},
        ]
    },
    {
        "make": "Yamaha", "category": "motorcycle", "model": "XSR 155", "year_start": 2020, "year_end": 2026,
        "variants": [
            {"name": "XSR 155 Retro", "year": 2024, "displacement": "155 cc", "transmission": "Manual (6-speed)", "fuel_type": "Gasoline RON 95", "tank_capacity": 10.4, "fuel_economy": 41.0, "source": "TEST_DRIVE"},
        ]
    },

    # Honda (Motorcycles)
    {
        "make": "Honda", "category": "motorcycle", "model": "Click 125", "year_start": 2019, "year_end": 2026,
        "variants": [
            {"name": "Click 125 V3", "year": 2024, "displacement": "125 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 5.5, "fuel_economy": 48.0, "source": "MANUFACTURER"},
            {"name": "Click 125 Special Edition", "year": 2025, "displacement": "125 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 5.5, "fuel_economy": 48.0, "source": "MANUFACTURER"},
        ]
    },
    {
        "make": "Honda", "category": "motorcycle", "model": "Click 160", "year_start": 2022, "year_end": 2026,
        "variants": [
            {"name": "Click 160 CBS", "year": 2024, "displacement": "157 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 5.5, "fuel_economy": 42.5, "source": "TEST_DRIVE"},
            {"name": "Click 160 ABS", "year": 2025, "displacement": "157 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 5.5, "fuel_economy": 42.0, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Honda", "category": "motorcycle", "model": "BeAT 110", "year_start": 2017, "year_end": 2026,
        "variants": [
            {"name": "BeAT Combi-Brake (ISS)", "year": 2024, "displacement": "110 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 4.2, "fuel_economy": 55.0, "source": "GOVERNMENT_TEST"},
            {"name": "BeAT Playful 110", "year": 2025, "displacement": "110 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 4.2, "fuel_economy": 55.0, "source": "MANUFACTURER"},
        ]
    },
    {
        "make": "Honda", "category": "motorcycle", "model": "PCX 160", "year_start": 2021, "year_end": 2026,
        "variants": [
            {"name": "PCX 160 CBS", "year": 2024, "displacement": "157 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 8.1, "fuel_economy": 45.0, "source": "MANUFACTURER"},
            {"name": "PCX 160 ABS", "year": 2025, "displacement": "157 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 8.1, "fuel_economy": 44.5, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Honda", "category": "motorcycle", "model": "ADV 160", "year_start": 2022, "year_end": 2026,
        "variants": [
            {"name": "ADV 160 ABS", "year": 2024, "displacement": "157 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 8.1, "fuel_economy": 43.0, "source": "TEST_DRIVE"},
            {"name": "ADV 160 Connected", "year": 2025, "displacement": "157 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 8.1, "fuel_economy": 42.5, "source": "COMMUNITY_AVERAGE"},
        ]
    },
    {
        "make": "Honda", "category": "motorcycle", "model": "Wave 110", "year_start": 2016, "year_end": 2026,
        "variants": [
            {"name": "Wave 110R Drum/Disc", "year": 2024, "displacement": "110 cc", "transmission": "Manual (4-speed rotary)", "fuel_type": "Gasoline RON 91", "tank_capacity": 3.7, "fuel_economy": 58.0, "source": "GOVERNMENT_TEST"},
        ]
    },
    {
        "make": "Honda", "category": "motorcycle", "model": "Winner X 150", "year_start": 2024, "year_end": 2026,
        "variants": [
            {"name": "Winner X Standard", "year": 2024, "displacement": "149 cc", "transmission": "Manual (6-speed)", "fuel_type": "Gasoline RON 95", "tank_capacity": 4.5, "fuel_economy": 45.0, "source": "TEST_DRIVE"},
            {"name": "Winner X Racing ABS", "year": 2025, "displacement": "149 cc", "transmission": "Manual (6-speed)", "fuel_type": "Gasoline RON 95", "tank_capacity": 4.5, "fuel_economy": 44.0, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Honda", "category": "motorcycle", "model": "TMX 125 Alpha", "year_start": 2015, "year_end": 2026,
        "variants": [
            {"name": "TMX 125 Alpha", "year": 2024, "displacement": "125 cc", "transmission": "Manual (5-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 8.6, "fuel_economy": 50.0, "source": "COMMUNITY_AVERAGE"},
        ]
    },

    # Suzuki (Motorcycles)
    {
        "make": "Suzuki", "category": "motorcycle", "model": "Burgman Street 125", "year_start": 2020, "year_end": 2026,
        "variants": [
            {"name": "Burgman Street Standard", "year": 2024, "displacement": "124 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 5.5, "fuel_economy": 46.0, "source": "TEST_DRIVE"},
            {"name": "Burgman Street 125 EX", "year": 2025, "displacement": "124 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 5.5, "fuel_economy": 48.0, "source": "MANUFACTURER"},
        ]
    },
    {
        "make": "Suzuki", "category": "motorcycle", "model": "Raider R150 Fi", "year_start": 2017, "year_end": 2026,
        "variants": [
            {"name": "Raider R150 Fi DOHC", "year": 2024, "displacement": "147 cc", "transmission": "Manual (6-speed)", "fuel_type": "Gasoline RON 95", "tank_capacity": 4.0, "fuel_economy": 42.0, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Suzuki", "category": "motorcycle", "model": "Smash 115", "year_start": 2016, "year_end": 2026,
        "variants": [
            {"name": "Smash 115 Disc/Spoke", "year": 2024, "displacement": "113 cc", "transmission": "Manual (4-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 4.3, "fuel_economy": 56.0, "source": "GOVERNMENT_TEST"},
            {"name": "Smash 115 Fi", "year": 2025, "displacement": "113 cc", "transmission": "Manual (4-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 4.3, "fuel_economy": 60.0, "source": "MANUFACTURER"},
        ]
    },
    {
        "make": "Suzuki", "category": "motorcycle", "model": "Avenis 125", "year_start": 2022, "year_end": 2026,
        "variants": [
            {"name": "Avenis 125 Standard", "year": 2024, "displacement": "124 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 5.2, "fuel_economy": 47.0, "source": "TEST_DRIVE"},
        ]
    },

    # Kawasaki & Kymco
    {
        "make": "Kawasaki", "category": "motorcycle", "model": "Barako II 175", "year_start": 2017, "year_end": 2026,
        "variants": [
            {"name": "Barako II Kick/Electric", "year": 2024, "displacement": "177 cc", "transmission": "Manual (4-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 12.0, "fuel_economy": 38.0, "source": "COMMUNITY_AVERAGE"},
        ]
    },
    {
        "make": "Kymco", "category": "motorcycle", "model": "Dink R 150", "year_start": 2023, "year_end": 2026,
        "variants": [
            {"name": "Dink R 150 Dual ABS", "year": 2025, "displacement": "150 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 6.8, "fuel_economy": 36.0, "source": "TEST_DRIVE"},
        ]
    },

    # =========================================================================
    # CARS, SUVS, MPVS, PICKUPS, VANS (Top 50 Philippine Vehicles)
    # =========================================================================
    # Toyota
    {
        "make": "Toyota", "category": "car", "model": "Vios", "year_start": 2018, "year_end": 2026,
        "variants": [
            {"name": "1.3 Base/J MT", "year": 2024, "displacement": "1329 cc", "transmission": "Manual (5-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 42.0, "fuel_economy": 15.0, "source": "TEST_DRIVE"},
            {"name": "1.3 XE / XLE CVT", "year": 2024, "displacement": "1329 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 42.0, "fuel_economy": 14.5, "source": "TEST_DRIVE"},
            {"name": "1.5 G CVT", "year": 2025, "displacement": "1496 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 95", "tank_capacity": 42.0, "fuel_economy": 13.8, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Toyota", "category": "car", "model": "Wigo", "year_start": 2019, "year_end": 2026,
        "variants": [
            {"name": "1.0 J MT", "year": 2024, "displacement": "998 cc", "transmission": "Manual (5-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 33.0, "fuel_economy": 18.5, "source": "MANUFACTURER"},
            {"name": "1.0 G D-CVT", "year": 2025, "displacement": "998 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 33.0, "fuel_economy": 17.8, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Toyota", "category": "mpv", "model": "Innova", "year_start": 2016, "year_end": 2026,
        "variants": [
            {"name": "2.8 E Diesel MT", "year": 2024, "displacement": "2755 cc", "transmission": "Manual (5-speed)", "fuel_type": "Diesel", "tank_capacity": 55.0, "fuel_economy": 12.5, "source": "COMMUNITY_AVERAGE"},
            {"name": "2.8 G / V Diesel AT", "year": 2025, "displacement": "2755 cc", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 55.0, "fuel_economy": 11.8, "source": "TEST_DRIVE"},
            {"name": "Zenix 2.0 Q Hybrid", "year": 2025, "displacement": "1987 cc", "transmission": "Automatic (e-CVT)", "fuel_type": "Gasoline RON 95", "tank_capacity": 52.0, "fuel_economy": 21.0, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Toyota", "category": "pickup", "model": "Hilux", "year_start": 2016, "year_end": 2026,
        "variants": [
            {"name": "2.4 G 4x2 MT", "year": 2024, "displacement": "2393 cc", "transmission": "Manual (6-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 12.2, "source": "TEST_DRIVE"},
            {"name": "2.4 Conquest 4x2 AT", "year": 2024, "displacement": "2393 cc", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 11.5, "source": "TEST_DRIVE"},
            {"name": "2.8 Conquest / GR-S 4x4 AT", "year": 2025, "displacement": "2755 cc", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 10.2, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Toyota", "category": "suv", "model": "Fortuner", "year_start": 2016, "year_end": 2026,
        "variants": [
            {"name": "2.4 G 4x2 AT", "year": 2024, "displacement": "2393 cc", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 10.8, "source": "TEST_DRIVE"},
            {"name": "2.8 Q / LTD 4x2 AT", "year": 2025, "displacement": "2755 cc", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 10.0, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Toyota", "category": "suv", "model": "Raize", "year_start": 2022, "year_end": 2026,
        "variants": [
            {"name": "1.2 E MT", "year": 2024, "displacement": "1198 cc", "transmission": "Manual (5-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 36.0, "fuel_economy": 16.5, "source": "TEST_DRIVE"},
            {"name": "1.2 G CVT", "year": 2024, "displacement": "1198 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 36.0, "fuel_economy": 15.8, "source": "TEST_DRIVE"},
            {"name": "1.0 Turbo CVT", "year": 2025, "displacement": "998 cc Turbo", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 95", "tank_capacity": 36.0, "fuel_economy": 14.8, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Toyota", "category": "mpv", "model": "Rush", "year_start": 2018, "year_end": 2026,
        "variants": [
            {"name": "1.5 E / G AT", "year": 2024, "displacement": "1496 cc", "transmission": "Automatic (4-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 45.0, "fuel_economy": 11.5, "source": "COMMUNITY_AVERAGE"},
        ]
    },
    {
        "make": "Toyota", "category": "van", "model": "Hiace", "year_start": 2019, "year_end": 2026,
        "variants": [
            {"name": "2.8 Commuter Deluxe MT", "year": 2024, "displacement": "2755 cc", "transmission": "Manual (6-speed)", "fuel_type": "Diesel", "tank_capacity": 70.0, "fuel_economy": 10.5, "source": "COMMUNITY_AVERAGE"},
            {"name": "2.8 GL Grandia AT", "year": 2025, "displacement": "2755 cc", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 70.0, "fuel_economy": 9.8, "source": "TEST_DRIVE"},
        ]
    },

    # Mitsubishi
    {
        "make": "Mitsubishi", "category": "car", "model": "Mirage G4", "year_start": 2018, "year_end": 2026,
        "variants": [
            {"name": "1.2 GLX MT", "year": 2024, "displacement": "1193 cc", "transmission": "Manual (5-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 35.0, "fuel_economy": 17.5, "source": "TEST_DRIVE"},
            {"name": "1.2 GLS CVT", "year": 2025, "displacement": "1193 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 35.0, "fuel_economy": 16.2, "source": "GOVERNMENT_TEST"},
        ]
    },
    {
        "make": "Mitsubishi", "category": "mpv", "model": "Xpander", "year_start": 2018, "year_end": 2026,
        "variants": [
            {"name": "1.5 GLX MT", "year": 2024, "displacement": "1499 cc", "transmission": "Manual (5-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 45.0, "fuel_economy": 12.8, "source": "TEST_DRIVE"},
            {"name": "1.5 GLS / Cross AT", "year": 2025, "displacement": "1499 cc", "transmission": "Automatic (4-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 45.0, "fuel_economy": 11.6, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Mitsubishi", "category": "suv", "model": "Montero Sport", "year_start": 2016, "year_end": 2026,
        "variants": [
            {"name": "2.4 GLS 4x2 AT", "year": 2024, "displacement": "2442 cc MIVEC", "transmission": "Automatic (8-speed)", "fuel_type": "Diesel", "tank_capacity": 68.0, "fuel_economy": 11.2, "source": "TEST_DRIVE"},
            {"name": "2.4 Black Series 4x2 AT", "year": 2025, "displacement": "2442 cc MIVEC", "transmission": "Automatic (8-speed)", "fuel_type": "Diesel", "tank_capacity": 68.0, "fuel_economy": 11.0, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Mitsubishi", "category": "pickup", "model": "Strada / Triton", "year_start": 2019, "year_end": 2026,
        "variants": [
            {"name": "2.4 GLX 4x2 MT", "year": 2024, "displacement": "2442 cc", "transmission": "Manual (6-speed)", "fuel_type": "Diesel", "tank_capacity": 75.0, "fuel_economy": 12.0, "source": "TEST_DRIVE"},
            {"name": "2.4 Athlete 4x4 AT", "year": 2025, "displacement": "2442 cc Bi-Turbo", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 75.0, "fuel_economy": 10.5, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Mitsubishi", "category": "van", "model": "L300", "year_start": 2019, "year_end": 2026,
        "variants": [
            {"name": "2.2 Euro 4 CRDi MT", "year": 2024, "displacement": "2268 cc", "transmission": "Manual (5-speed)", "fuel_type": "Diesel", "tank_capacity": 55.0, "fuel_economy": 11.0, "source": "COMMUNITY_AVERAGE"},
        ]
    },

    # Nissan
    {
        "make": "Nissan", "category": "pickup", "model": "Navara", "year_start": 2016, "year_end": 2026,
        "variants": [
            {"name": "2.5 Calibre 4x2 AT", "year": 2024, "displacement": "2488 cc", "transmission": "Automatic (7-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 11.4, "source": "TEST_DRIVE"},
            {"name": "2.5 PRO-4X 4x4 AT", "year": 2025, "displacement": "2488 cc", "transmission": "Automatic (7-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 10.1, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Nissan", "category": "suv", "model": "Terra", "year_start": 2018, "year_end": 2026,
        "variants": [
            {"name": "2.5 VE / VL 4x2 AT", "year": 2024, "displacement": "2488 cc", "transmission": "Automatic (7-speed)", "fuel_type": "Diesel", "tank_capacity": 78.0, "fuel_economy": 10.5, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Nissan", "category": "car", "model": "Almera", "year_start": 2021, "year_end": 2026,
        "variants": [
            {"name": "1.0 Turbo EL MT", "year": 2024, "displacement": "999 cc Turbo", "transmission": "Manual (5-speed)", "fuel_type": "Gasoline RON 95", "tank_capacity": 35.0, "fuel_economy": 17.2, "source": "TEST_DRIVE"},
            {"name": "1.0 Turbo VL CVT", "year": 2025, "displacement": "999 cc Turbo", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 95", "tank_capacity": 35.0, "fuel_economy": 16.0, "source": "TEST_DRIVE"},
        ]
    },

    # Isuzu
    {
        "make": "Isuzu", "category": "pickup", "model": "D-Max", "year_start": 2020, "year_end": 2026,
        "variants": [
            {"name": "1.9 RZ4E Single Cab / LT MT", "year": 2024, "displacement": "1898 cc", "transmission": "Manual (6-speed)", "fuel_type": "Diesel", "tank_capacity": 76.0, "fuel_economy": 14.0, "source": "GOVERNMENT_TEST"},
            {"name": "3.0 LS-A 4x2 AT", "year": 2024, "displacement": "2999 cc", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 76.0, "fuel_economy": 11.5, "source": "TEST_DRIVE"},
            {"name": "3.0 LS-E 4x4 AT", "year": 2025, "displacement": "2999 cc", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 76.0, "fuel_economy": 10.8, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Isuzu", "category": "suv", "model": "mu-X", "year_start": 2021, "year_end": 2026,
        "variants": [
            {"name": "1.9 RZ4E LS AT", "year": 2024, "displacement": "1898 cc", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 12.5, "source": "TEST_DRIVE"},
            {"name": "3.0 LS-E 4x2 AT", "year": 2025, "displacement": "2999 cc", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 11.0, "source": "TEST_DRIVE"},
        ]
    },

    # Suzuki (Cars)
    {
        "make": "Suzuki", "category": "mpv", "model": "Ertiga", "year_start": 2019, "year_end": 2026,
        "variants": [
            {"name": "1.5 GL MT", "year": 2024, "displacement": "1462 cc", "transmission": "Manual (5-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 45.0, "fuel_economy": 14.5, "source": "TEST_DRIVE"},
            {"name": "1.5 Hybrid GLX AT", "year": 2025, "displacement": "1462 cc Smart Hybrid", "transmission": "Automatic (4-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 45.0, "fuel_economy": 16.5, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Suzuki", "category": "car", "model": "S-Presso", "year_start": 2020, "year_end": 2026,
        "variants": [
            {"name": "1.0 GL MT", "year": 2024, "displacement": "998 cc", "transmission": "Manual (5-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 27.0, "fuel_economy": 21.0, "source": "GOVERNMENT_TEST"},
            {"name": "1.0 GL AGS", "year": 2025, "displacement": "998 cc Dualjet", "transmission": "Auto Gear Shift (AGS)", "fuel_type": "Gasoline RON 91", "tank_capacity": 27.0, "fuel_economy": 22.0, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Suzuki", "category": "suv", "model": "Jimny", "year_start": 2019, "year_end": 2026,
        "variants": [
            {"name": "1.5 AllGrip 3-Door AT", "year": 2024, "displacement": "1462 cc", "transmission": "Automatic (4-speed)", "fuel_type": "Gasoline RON 95", "tank_capacity": 40.0, "fuel_economy": 11.0, "source": "TEST_DRIVE"},
            {"name": "1.5 AllGrip 5-Door AT", "year": 2025, "displacement": "1462 cc", "transmission": "Automatic (4-speed)", "fuel_type": "Gasoline RON 95", "tank_capacity": 40.0, "fuel_economy": 10.5, "source": "TEST_DRIVE"},
        ]
    },

    # Honda (Cars)
    {
        "make": "Honda", "category": "car", "model": "City", "year_start": 2020, "year_end": 2026,
        "variants": [
            {"name": "1.5 S / V CVT", "year": 2024, "displacement": "1498 cc i-VTEC", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 40.0, "fuel_economy": 15.5, "source": "TEST_DRIVE"},
            {"name": "1.5 RS Sensing CVT", "year": 2025, "displacement": "1498 cc i-VTEC", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 95", "tank_capacity": 40.0, "fuel_economy": 15.0, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Honda", "category": "suv", "model": "BR-V", "year_start": 2022, "year_end": 2026,
        "variants": [
            {"name": "1.5 S MT", "year": 2024, "displacement": "1498 cc", "transmission": "Manual (6-speed)", "fuel_type": "Gasoline RON 91", "tank_capacity": 42.0, "fuel_economy": 14.5, "source": "TEST_DRIVE"},
            {"name": "1.5 VX Sensing CVT", "year": 2025, "displacement": "1498 cc", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 42.0, "fuel_economy": 13.8, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Honda", "category": "car", "model": "Civic", "year_start": 2021, "year_end": 2026,
        "variants": [
            {"name": "1.5 V Turbo CVT", "year": 2024, "displacement": "1498 cc VTEC Turbo", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 95", "tank_capacity": 47.0, "fuel_economy": 13.5, "source": "TEST_DRIVE"},
            {"name": "1.5 RS Turbo CVT", "year": 2025, "displacement": "1498 cc VTEC Turbo", "transmission": "Automatic (CVT)", "fuel_type": "Gasoline RON 95", "tank_capacity": 47.0, "fuel_economy": 13.0, "source": "TEST_DRIVE"},
        ]
    },

    # Ford
    {
        "make": "Ford", "category": "pickup", "model": "Ranger", "year_start": 2022, "year_end": 2026,
        "variants": [
            {"name": "2.0 Turbo XL / XLT 4x2 AT", "year": 2024, "displacement": "1996 cc Single Turbo", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 11.2, "source": "TEST_DRIVE"},
            {"name": "2.0 Bi-Turbo Wildtrak 4x4 AT", "year": 2025, "displacement": "1996 cc Bi-Turbo", "transmission": "Automatic (10-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 9.8, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Ford", "category": "suv", "model": "Everest", "year_start": 2022, "year_end": 2026,
        "variants": [
            {"name": "2.0 Turbo Trend 4x2 AT", "year": 2024, "displacement": "1996 cc Single Turbo", "transmission": "Automatic (6-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 10.4, "source": "TEST_DRIVE"},
            {"name": "2.0 Bi-Turbo Titanium+ 4x4 AT", "year": 2025, "displacement": "1996 cc Bi-Turbo", "transmission": "Automatic (10-speed)", "fuel_type": "Diesel", "tank_capacity": 80.0, "fuel_economy": 9.2, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Ford", "category": "suv", "model": "Territory", "year_start": 2020, "year_end": 2026,
        "variants": [
            {"name": "1.5 EcoBoost Titanium AT", "year": 2025, "displacement": "1499 cc EcoBoost", "transmission": "Automatic (7-speed DCT)", "fuel_type": "Gasoline RON 95", "tank_capacity": 60.0, "fuel_economy": 10.5, "source": "COMMUNITY_AVERAGE"},
        ]
    },

    # Hyundai & Geely
    {
        "make": "Hyundai", "category": "mpv", "model": "Stargazer", "year_start": 2022, "year_end": 2026,
        "variants": [
            {"name": "1.5 Smartstream GLS IVT", "year": 2025, "displacement": "1497 cc", "transmission": "Intelligent Variable (IVT)", "fuel_type": "Gasoline RON 91", "tank_capacity": 40.0, "fuel_economy": 14.0, "source": "TEST_DRIVE"},
        ]
    },
    {
        "make": "Geely", "category": "suv", "model": "Coolray", "year_start": 2019, "year_end": 2026,
        "variants": [
            {"name": "1.5 Turbo Premium / Sport", "year": 2024, "displacement": "1477 cc 3-Cyl Turbo", "transmission": "Automatic (7-speed DCT)", "fuel_type": "Gasoline RON 95", "tank_capacity": 45.0, "fuel_economy": 11.8, "source": "TEST_DRIVE"},
        ]
    },
]
