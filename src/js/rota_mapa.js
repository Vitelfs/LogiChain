import { } from 'https://unpkg.com/leaflet/dist/leaflet.js';
import { } from 'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import  { } from 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js';

function initializeMap(latitude, longitude) {
    const map = L.map('mapa').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const routingControl = L.Routing.control({
        waypoints: [],
        routeWhileDragging: false, // Não exibir detalhes da rota
        geocoder: L.Control.Geocoder.nominatim()
    }).addTo(map);

    map.on('click', function (e) {
        const waypointCount = routingControl.getWaypoints().length;

        if (waypointCount === 0) {
            routingControl.spliceWaypoints(0, 1, e.latlng); // Definir ponto inicial
        } else if (waypointCount === 1) {
            routingControl.spliceWaypoints(1, 1, e.latlng); // Definir ponto final
            updateRouteLink(routingControl.getWaypoints()[0].latLng, routingControl.getWaypoints()[1].latLng);
        }
    });

    // Forçar o Leaflet a redimensionar o mapa corretamente após a inicialização
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            initializeMap(latitude, longitude);
        }, () => {
            alert('Não foi possível obter a sua localização.');
            initializeMap(51.505, -0.09); // Localização padrão se falhar
        });
    } else {
        alert('Geolocalização não é suportada pelo seu navegador.');
        initializeMap(51.505, -0.09); // Localização padrão
    }
}

function updateRouteLink(start, end) {
    const startLat = start.lat;
    const startLng = start.lng;
    const endLat = end.lat;
    const endLng = end.lng;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${endLat},${endLng}&travelmode=driving`;

    console.log("X:" + googleMapsUrl);
}

window.onload = getLocation;