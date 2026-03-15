from pathlib import Path
import duckdb

PROJECT_ROOT = Path(__file__).resolve().parents[3]
DB_PATH = PROJECT_ROOT / "warehouse" / "duckdb" / "data" / "ai_kl.duckdb"


def get_connection():
    return duckdb.connect(str(DB_PATH), read_only=True)


def get_latest_city_metrics():
    con = get_connection()
    try:
        rows = con.execute(
            """
            select
                district,
                latest_timestamp,
                avg_traffic_index,
                avg_aqi,
                avg_temperature_c,
                avg_humidity_pct,
                avg_transit_delay_min,
                signal_count
            from mart_city_latest
            order by district
            """
        ).fetchall()
        columns = [c[0] for c in con.description]
        return [dict(zip(columns, row)) for row in rows]
    finally:
        con.close()


def get_city_risk():
    con = get_connection()
    try:
        rows = con.execute(
            """
            select
                district,
                latest_timestamp,
                avg_traffic_index,
                avg_aqi,
                avg_temperature_c,
                avg_humidity_pct,
                avg_transit_delay_min,
                signal_count,
                city_risk_level
            from mart_city_risk
            order by
                case city_risk_level
                    when 'high' then 1
                    when 'medium' then 2
                    else 3
                end,
                district
            """
        ).fetchall()
        columns = [c[0] for c in con.description]
        return [dict(zip(columns, row)) for row in rows]
    finally:
        con.close()