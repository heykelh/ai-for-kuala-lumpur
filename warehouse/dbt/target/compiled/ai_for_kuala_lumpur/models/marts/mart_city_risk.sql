select
    district,
    latest_timestamp,
    avg_traffic_index,
    avg_aqi,
    avg_temperature_c,
    avg_humidity_pct,
    avg_transit_delay_min,
    signal_count,
    case
        when avg_traffic_index >= 80 or avg_aqi >= 100 or avg_transit_delay_min >= 10 then 'high'
        when avg_traffic_index >= 60 or avg_aqi >= 50 or avg_transit_delay_min >= 5 then 'medium'
        else 'low'
    end as city_risk_level
from "ai_kl"."main"."mart_city_latest"