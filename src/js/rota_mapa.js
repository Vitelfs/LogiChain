import { } from 'https://unpkg.com/leaflet/dist/leaflet.js';
import { } from 'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import { } from 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js';

function initializeMap(latitude, longitude) {
    const map = L.map('mapa').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const routingControl = L.Routing.control({
        waypoints: [],
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map);

    routingControl.on('waypointschanged', function (e) {
        if (e.waypoints.length === 2) {
            const startLatLng = e.waypoints[0].latLng;
            const endLatLng = e.waypoints[1].latLng;

            if (startLatLng && endLatLng) {
                updateRouteLink(startLatLng, endLatLng);
                saveAddressInSpan(startLatLng, endLatLng, map);
            }
        }
    });

    return map;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            initializeMap(latitude, longitude);
        }, () => {
            alert('Não foi possível obter a sua localização.');
            initializeMap(51.505, -0.09);
        });
    } else {
        alert('Geolocalização não é suportada pelo seu navegador.');
        initializeMap(51.505, -0.09);
    }
}

function updateRouteLink(startLatLng, endLatLng) {
    const startLat = startLatLng.lat;
    const startLng = startLatLng.lng;
    const endLat = endLatLng.lat;
    const endLng = endLatLng.lng;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}&travelmode=driving`;

    document.getElementById('link-rota').setAttribute('href', googleMapsUrl);
    document.getElementById('link-rota').innerHTML = `Rota do motorista! <i class="fa-solid fa-link"></i>`;
    document.getElementById('link-rota').addEventListener('click', () => {
        window.open(googleMapsUrl, '_blank'); 
    });
    console.log("Google Maps Link: " + googleMapsUrl);""
}

function saveAddressInSpan(startLatLng, endLatLng, map) {
    const geocoder = L.Control.Geocoder.nominatim();

    geocoder.reverse(startLatLng, map.options.crs.scale(map.getZoom()), results => {
        const startAddress = formatAddress(results[0]);
        document.getElementById('origem').innerText = startAddress;
    });

    geocoder.reverse(endLatLng, map.options.crs.scale(map.getZoom()), results => {
        const endAddress = formatAddress(results[0]);
        document.getElementById('destino').innerText = endAddress;
    });
}

function formatAddress(result) {
    if (!result || !result.properties) return 'Endereço não encontrado';

    const address = result.properties.address;
    const parts = [];
    
    if (address.road) parts.push(address.road);
    if (address.suburb) parts.push(address.suburb);
    if (address.city) parts.push(address.city);
    if (address.town && !address.city) parts.push(address.town);
    if (address.state) parts.push(address.state);

    return parts.slice(0, 3).join(', ');
}

window.onload = getLocation;
