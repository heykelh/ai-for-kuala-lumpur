select
    timestamp,
    district,
    traffic_index,
    aqi,
    temperature_c,
    humidity_pct,
    transit_delay_min,
    source
from {{ source('raw', 'city_signals_raw') }}