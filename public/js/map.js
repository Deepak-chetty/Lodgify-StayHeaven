mapboxgl.accessToken = map_token;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({color: "red"})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h6>${listing.location}</h6><p>You will be here</p>`))
        .addTo(map);


        // map.on('load', () => {
        //     // Load an image from an external URL.
        //     map.loadImage(
        //         'https://docs.mapbox.com/mapbox-gl-js/assets/cat.png',
        //         (error, image) => {
        //             if (error) throw error;
    
        //             // Add the image to the map style.
        //             map.addImage('cat', image);
    
        //             // Add a data source containing one point feature.
        //             map.addSource('point', {
        //                 'type': 'geojson',
        //                 'data': {
        //                     'type': 'FeatureCollection',
        //                     'features': [
        //                         {
        //                             'type': 'Feature',
        //                             'geometry': {
        //                                 'type': 'Point',
        //                                 'coordinates': listing.geometry.coordinates
        //                             }
        //                         }
        //                     ]
        //                 }
        //             });
    
        //             // Add a layer to use the image to represent the data.
        //             map.addLayer({
        //                 'id': 'points',
        //                 'type': 'symbol',
        //                 'source': 'point', // reference the data source
        //                 'layout': {
        //                     'icon-image': 'cat', // reference the image
        //                     'icon-size': 0.25
        //                 }
        //             });
        //         }
        //     );
        // });