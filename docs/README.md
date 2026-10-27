# 🛰️ ISS Live Tracker

A real-time web app that tracks the International Space Station as it orbits the Earth. The station moves at roughly 28,000 km/h, and this dashboard shows its live position, altitude, and speed on an interactive map, along with the country or ocean it is flying over right now.

![ISS Live Tracker screenshot](screenshot.png)

**Live demo:** _add your GitHub Pages link here_

## Features

- Live position, altitude, and speed readouts that refresh every few seconds
- Interactive map that follows the ISS and zooms in on the tracker
- A growing orange trail showing the path the station has travelled
- "Currently over" label that turns coordinates into a place name (or "Open ocean" over water)
- Live / offline status indicator that recovers on its own if the connection drops
- Responsive dark UI built with Tailwind CSS

## APIs and services used

| Service | What it is used for | Key needed? |
|---|---|---|
| [Where the ISS at? API](https://wheretheiss.at/w/developer) | Live latitude, longitude, altitude, and velocity of the ISS | No |
| [BigDataCloud Reverse Geocoding API](https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api) | Converts the ISS coordinates into a city or country name | No |
| [Leaflet](https://leafletjs.com/) | Interactive map library (markers, polylines, panning, zooming) | No |
| [Esri World Imagery](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9) | Satellite map tiles drawn under the markers | No |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling, loaded from a CDN | No |

## JavaScript concepts used

**Asynchronous JavaScript**
- `fetch()` to request data from REST APIs
- Promises and `async/await` to write asynchronous code that reads top to bottom
- A `setTimeout` that updates the app continuously without overlapping requests

**Error handling**
- Checking `response.ok` and `throw`ing errors when a request fails
- `try/catch` placed inside the polling loop, so one failed request does not stop the tracker
- Fatal errors (no position data) versus nice-to-have errors (place name lookup fails quietly)

**DOM manipulation**
- `document.querySelector` to select elements
- Updating text with `textContent` and updating classes for the live/offline status pill

**Language features**
- Separating code into small functions: fetching data, rendering data, and controlling the loop

**Leaflet map API**
- Creating a map once, then updating it: `L.map`, `L.tileLayer`, `L.circleMarker`, `L.polyline`
- Moving objects with `setLatLng`, growing the trail with `addLatLng`, and following the ISS with `panTo`

## How it works

1. On page load, the map, marker, and trail are created **once**.
2. A loop calls the ISS API, then updates the readouts, moves the marker, extends the trail, and re-centers the map.
3. Every few seconds, the coordinates are sent to the reverse geocoding API to get a place name.
4. If a request fails, the status pill turns red and the loop keeps trying until the connection returns.


## Known limitations

- When the ISS crosses the ±180° longitude line, the trail can draw a straight line across the map. Splitting the trail into separate segments at that point would fix it.
- Public APIs are rate limited, so the app polls gently instead of requesting data as fast as possible.

## Ideas for the future

- A chart of altitude and speed over time
- Show when the ISS will next pass over the user's location
- Show the day/night boundary on the map

## What I learned

This project was built as a hands-on way to learn DOM manipulation, `async/await`, `fetch`, and working with real-world APIs, including handling empty results, failed requests, and rate limits.

## Credits

Data from Where the ISS at? and BigDataCloud. Map tiles from Esri. Map library by Leaflet. Built by Agam Tiwari.
