from pathlib import Path
import json
import duckdb
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = PROJECT_ROOT / "data" / "raw" / "city_signals"
DB_PATH = PROJECT_ROOT / "warehouse" / "duckdb" / "data" / "ai_kl.duckdb"

def main():
    records = []

    for file_path in RAW_DIR.glob("*.json"):
        with open(file_path, "r", encoding="utf-8") as f:
            records.append(json.load(f))

    if not records:
        print("No raw JSON files found.")
        return

    df = pd.DataFrame(records)

    con = duckdb.connect(str(DB_PATH))
    con.execute("""
        create table if not exists raw_city_signals (
            timestamp varchar,
            district varchar,
            traffic_index integer,
            congestion_level varchar,
            aqi integer,
            air_quality_status varchar,
            temperature_c double,
            humidity_pct integer,
            transit_delay_min integer,
            source varchar
        )
    """)

    con.execute("delete from raw_city_signals")
    con.register("df_view", df)
    con.execute("insert into raw_city_signals select * from df_view")

    count = con.execute("select count(*) from raw_city_signals").fetchone()[0]
    print(f"Loaded {count} records into raw_city_signals")

    con.close()

if __name__ == "__main__":
    main()