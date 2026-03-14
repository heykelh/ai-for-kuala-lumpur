select
    district,
    max(timestamp) as latest_timestamp,
    avg(traffic_index) as avg_traffic_index,
    avg(aqi) as avg_aqi,
    avg(temperature_c) as avg_temperature_c,
    avg(humidity_pct) as avg_humidity_pct,
    avg(transit_delay_min) as avg_transit_delay_min
from {{ ref('stg_city_signals') }}
group by district