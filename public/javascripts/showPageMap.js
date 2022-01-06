//  const parsedSpot = JSON.parse(skatespot);
 
 mapboxgl.accessToken = mapToken;
 const map = new mapboxgl.Map({
                container: 'map', // container ID
                style: 'mapbox://styles/mapbox/streets-v11', // style URL
                center: skatespot.geometry.coordinates, // starting position [lng, lat]
                zoom: 15 // starting zoom
              });

map.addControl(new mapboxgl.NavigationControl());


const marker = new mapboxgl.Marker()
              .setLngLat(skatespot.geometry.coordinates)
              .setPopup(
                      new mapboxgl.Popup({ offset: 25 })
                      .setHTML(
                        `<p><strong>${skatespot.name}<strong><br><span class="text-muted">${skatespot.location}</span></p>`
                      )
              )
              .addTo(map);