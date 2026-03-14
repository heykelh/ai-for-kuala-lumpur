select
    cast(timestamp as timestamp) as timestamp,
    district,
    traffic_index,
    congestion_level,
    aqi,
    air_quality_status,
    temperature_c,
    humidity_pct,
    transit_delay_min,
    source
from raw_city_signals