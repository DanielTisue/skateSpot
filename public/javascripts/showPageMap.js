 const parsedSpot = JSON.parse(skatespot);
 
 mapboxgl.accessToken = mapToken;
 const map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: parsedSpot.geometry.coordinates, // starting position [lng, lat]
                zoom: 15 // starting zoom
              });

const marker = new mapboxgl.Marker()
              .setLngLat(parsedSpot.geometry.coordinates)
              .setPopup(
                      new mapboxgl.Popup({ offset: 25 })
                      .setHTML(
                        `<p><strong>${parsedSpot.name}<strong><br><span class="text-muted">${parsedSpot.location}</span></p>`
                      )
              )
              .addTo(map);