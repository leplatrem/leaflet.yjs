(function () {
    var SIGNALING_SERVER = 'https://signaling.simplewebrtc.com:443/';
    var DATA_NAME = 'geojson_str';
    var ROOM_NAME = 'leaflet+yjs';
    var INITIAL_VALUE = '{"features": []}';

    window.onload = function onload() {
        // Setup Y.
        var connector = new Y.WebRTC(ROOM_NAME, {url: SIGNALING_SERVER});
        var y = new Y(connector);
        y.val(DATA_NAME, INITIAL_VALUE, "mutable");

        var textarea = document.querySelector("#geojson");
        var mutable_string = y.val(DATA_NAME);
        mutable_string.bind(textarea);

        // Setup Leaflet.
        var map = L.map('map')
                   .fitWorld();
        L.tileLayer('http://tile.osm.org/{z}/{x}/{y}.png').addTo(map);

        var layer = null;

        // Refresh layer on change.
        y.observe(function(events) {
            events.forEach(function (event) {
                if (event.type == 'update'&& event.name == DATA_NAME) {
                    if (layer)
                        map.removeLayer(layer);

                    // Render GeoJSON from text area
                    var geojson = JSON.parse(textarea.innerHTML);
                    layer = L.geoJson(geojson).addTo(map);
                }
                console.debug(event);
            });
        });
    };
})();