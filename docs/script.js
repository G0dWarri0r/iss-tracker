const latitude = document.querySelector('#lat');
const longitude = document.querySelector('#lon');
const altitude = document.querySelector('#alt');
const speed = document.querySelector('#speed');
const track = document.querySelector('#track');
const place = document.querySelector('#place');


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
        throw new Error("Could not reach the ISS tracking service");
    }
    return await request.json();
}

async function getPlace(lat, lon) {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    const data = await response.json();
    updatePlace(data.continent, data.countryName, data.locality);
}

async function init() {
    setInterval(async () => {
        {
            try {
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
    latitude.textContent = iss.latitude;
    longitude.textContent = iss.longitude;
    altitude.textContent = iss.altitude;
    speed.textContent = iss.velocity;
}

function updatePlace(continent, country, locality) {
    if (!country && !continent) {
        place.textContent = locality;
    }
    else {
        place.textContent = `Continent: ${continent}, Country: ${country}`;
    }
}

init();