const latitude = document.querySelector('#lat');
const longitude = document.querySelector('#lon');
const altitude = document.querySelector('#alt');
const speed = document.querySelector('#speed');
const track = document.querySelector('#track');
const place = document.querySelector('#place');
const statusEl = document.querySelector('#status');



// MAP, POINT AND TRAIL
const map = L.map("map").setView([0, 0], 2);
L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles &copy; Esri",
        maxZoom: 18,
    }
).addTo(map);

const issMarker = L.circleMarker([0, 0], {
    radius: 8,
    color: "#f97316",
    fillColor: "#f97316",
    fillOpacity: 1,
}).addTo(map);

const trail = L.polyline([], { color: "#f97316", weight: 2 }).addTo(map);

// EVENT LISTNER FOR TRACK
let tracking = false;
track.addEventListener('change', (e) => {
    if (e.target.checked) {
        tracking = true
    }
    else tracking = false
});


// FUNCTIONS
async function getPosition() {
    const request = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    if (!request.ok) {
        updateStatus(true);
        throw new Error("Could not reach the ISS tracking service");
    }
    return await request.json();
}

async function getPlace(lat, lon) {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    const response = await fetch(`https://api.wheretheiss.at/v1/coordinates/${lat},${lon}`);
    if (!response.ok) {
        updateStatus(true);
        throw new Error("Place lookup failed");
    }
    const data = await response.json();
    if (!data.country_code || data.country_code === "??"){
        place.textContent = "Open Ocean 🌊"
    }
    place.textContent = `${regionNames.of(data.country_code)}`;
}

async function init() {
    updateStatus(true);
    setInterval(async () => {
        {
            try {
                updateStatus(false);
                const iss = await getPosition();
                updateIss(iss);
                getPlace(iss.latitude, iss.longitude);
                issMarker.setLatLng([iss.latitude, iss.longitude]);
                trail.addLatLng([iss.latitude, iss.longitude]);
                if (tracking) {
                    map.panTo([iss.latitude, iss.longitude]);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, 3000);
}

function updateIss(iss) {
    latitude.textContent = `${iss.latitude.toFixed(3)}°`;
    longitude.textContent = `${iss.longitude.toFixed(3)}°`;
    altitude.textContent = `${iss.altitude.toFixed(3)} km`;
    speed.textContent = `${iss.velocity.toFixed(3)} km/h`;
}

function updateStatus(x) {
    if (x === true) {
        statusEl.textContent = "connecting..."
        statusEl.classList.remove('text-slate-300');
        statusEl.classList.add('text-red-300');
    }
    if (x === false) {
        statusEl.textContent = "connected!"
        statusEl.classList.add('text-slate-300');
        statusEl.classList.remove('text-red-300');
    }
}

init();