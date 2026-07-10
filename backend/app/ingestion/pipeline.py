"""
Ingestion pipeline: reads all CSVs from data/satellites, data/stations,
data/debris, and writes SpaceObject + OrbitalElement rows to the database.

Load order matters: stations are loaded FIRST. active_sat.csv (the master
satellite catalog) also includes ISS module entries, so if satellites loaded
first, those NORAD IDs would get tagged type='satellite' and the station
loader would then skip them as duplicates — silently losing the station tag.
Loading stations first means they claim the correct type before satellites
ever sees those IDs.

Note: active_sat.csv also already includes Starlink satellites, so
starlink.csv is a redundant subset — duplicates by norad_cat_id are
expected and skipped there too, keeping whichever copy is encountered first.

Run directly: python -m app.ingestion.pipeline
"""

import logging

from app.db import SessionLocal, init_db
from app.models.models import SpaceObject
from app.ingestion.loaders import satellite_loader, station_loader, debris_loader

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def run_pipeline():
    init_db()
    session = SessionLocal()

    loaders = [
        ("stations", station_loader),
        ("satellites", satellite_loader),
        ("debris", debris_loader),
    ]

    # Load existing NORAD IDs once, up front, instead of querying per-row.
    seen_norad_ids = {row[0] for row in session.query(SpaceObject.norad_cat_id).all()}

    total_new = 0
    total_duplicates = 0

    try:
        for label, loader in loaders:
            logger.info(f"Loading {label}...")
            pairs = loader.load_all()
            new_this_batch = 0

            for obj, element in pairs:
                if obj.norad_cat_id in seen_norad_ids:
                    total_duplicates += 1
                    continue  # already have this object (e.g. Starlink in active_sat.csv,
                              # or ISS modules already claimed by the stations loader)

                seen_norad_ids.add(obj.norad_cat_id)
                session.add(obj)
                session.add(element)
                new_this_batch += 1

            session.commit()
            total_new += new_this_batch
            logger.info(f"  → {new_this_batch} new objects added for {label}")

        logger.info(f"Done. New objects: {total_new}, duplicates skipped: {total_duplicates}")

    except Exception:
        session.rollback()
        logger.exception("Pipeline failed, rolled back this batch.")
        raise
    finally:
        session.close()


if __name__ == "__main__":
    run_pipeline()