var currentlySelectedMarkers = [];

function removeFromArray(array, element)
{
    var indexOf = -1;
    for(var i = 0; i<array.length && indexOf === -1; i++)
    {
        if(element === array[i])
            indexOf = i;
    }
    if(indexOf!==-1)
        currentlySelectedMarkers.splice(indexOf, 1);
}

function addMarker(marker)
{
    currentlySelectedMarkers.push(marker);
}

function removeMarker(marker)
{
    marker.setMap(null);
    removeFromArray(currentlySelectedMarkers, marker);
}

function setListenerForMarker(marker)
{
    google.maps.event.addListener(marker, 'click', function(){
        removeMarker(marker);
    });
}

function setMarker(location, map)
{
    var marker = new google.maps.Marker(
        {
            position: location,
            map: map
        });
    setListenerForMarker(marker);
    addMarker(marker);
}

function initMap()
{
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 50.216680, lng: 17.857814},
        mapTypeId: 'terrain'
    });

    google.maps.event.addListener(map, 'click', function(event){
       setMarker(event.latLng, map);
    });

    // Define the LatLng coordinates for the polygon's path.
    var triangleCoords = [
        {lat: 25.774, lng: -80.190},
        {lat: 18.466, lng: -66.118},
        {lat: 32.321, lng: -64.757},
        {lat: 25.774, lng: -80.190}
    ];
    // Construct the polygon.
    var bermudaTriangle = new google.maps.Polygon({
        paths: triangleCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        editable: true,
    });

    bermudaTriangle.setMap(map);
}

function createPolygonFromMarkers()
{
    var coordinates = [];
    for(var i = 0; i<currentlySelectedMarkers; i++)
    {
        coordinates.push(currentlySelectedMarkers[i].position);
    }
    // todo
}
