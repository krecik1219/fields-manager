var map = null;
var currentlySelectedMarkers = [];
var polygons = [];
var borderLine = null;
var selectedPolygon = null;

function initMap()
{
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 50.216680, lng: 17.857814},
        mapTypeId: 'hybrid',
        disableDefaultUI: true,
        zoomControl: true
    });

    google.maps.event.addListener(map, 'click', function(event){
        console.log(typeof event.latLng);
        setMarker(event.latLng, map);
    });
}

function removeFromArray(array, element)
{
    var indexOf = -1;
    for(var i = 0; i<array.length && indexOf === -1; i++)
    {
        if(element === array[i])
            indexOf = i;
    }
    if(indexOf!==-1)
        array.splice(indexOf, 1);
}

function drawBorderLine()
{
    if(currentlySelectedMarkers.length > 1)
    {
        if(borderLine !== null)
            borderLine.setMap(null);
        var coordinates = [];
        for(var i = 0; i<currentlySelectedMarkers.length; i++)
        {
            coordinates.push(currentlySelectedMarkers[i].getPosition());
        }
        coordinates.push(currentlySelectedMarkers[0].getPosition());
        borderLine = new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: map
        });
    }
    else if(borderLine !== null)
    {
        borderLine.setMap(null);
        borderLine = null;
    }
}

function addMarker(marker)
{
    currentlySelectedMarkers.push(marker);
    drawBorderLine();
}

function removeMarker(marker)
{
    marker.setMap(null);
    removeFromArray(currentlySelectedMarkers, marker);
    drawBorderLine();
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

function removePolygon()
{
    //todo database removal
    console.log("polygons num before remove: "+polygons.length );
    if(selectedPolygon !== null && confirm("Are you sure? This operation cannot be undone!"))
    {
        removeFromArray(polygons, selectedPolygon);
        selectedPolygon.setMap(null);
        selectedPolygon = null;
    }
    console.log("polygons num after remove: "+polygons.length );
}

function onPolygonClick(event, polygon)
{
    console.log("polygon clicked");
    selectedPolygon = polygon;
    var infoWindow = new google.maps.InfoWindow({
        content: getContentForPolygon(polygon),
        position: event.latLng
    });
    infoWindow.open(map);
}

function getContentForPolygon(polygon)
{
    // todo: currently dummy implementation
    return polygonContentString;
}

function createPolygonFromMarkers()
{
    if(currentlySelectedMarkers.length > 2)
    {
        console.log('create polygon');
        var coordinates = [];
        for(var i = 0; i<currentlySelectedMarkers.length; i++)
        {
            console.log("single coor: "+currentlySelectedMarkers[i].getPosition());
            console.log("x: "+currentlySelectedMarkers[i].getPosition().lat() + "; y: "+currentlySelectedMarkers[i].getPosition().lng());
            coordinates.push(currentlySelectedMarkers[i].getPosition());
        }
        console.log("coordinates: "+ coordinates.toString());

        var polygon = new google.maps.Polygon({
            paths: coordinates,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            editable: false,
            map: map
        });

        google.maps.event.addListener(polygon, 'click', function(event){
           onPolygonClick(event, polygon);
        });

        borderLine.setMap(null);
        borderLine = null;

        for(var i = 0; i<currentlySelectedMarkers.length; i++)
            currentlySelectedMarkers[i].setMap(null);
        currentlySelectedMarkers = [];

        console.log("created ...");
        polygons.push(polygon);
        return polygon;
    }
    else
        return null;
}

var polygonContentString = '<div id = "content">Donec bibendum ex eu hendrerit mattis. Ut faucibus, metus ut elementum gravida, mauris quam tristique leo, ac tincidunt dolor mi sit amet nunc. Donec at augue nulla. In quis magna nec tellus tristique ultricies vel non tellus. Curabitur euismod quis orci dictum congue. Fusce eget egestas massa. Etiam laoreet vehicula turpis, quis scelerisque tortor iaculis sit amet. Donec malesuada elementum libero, ut rutrum purus cursus eu. Praesent sodales sem a varius aliquam. Mauris sit amet enim in augue commodo tristique. Quisque leo tellus, porttitor eu mi non, tincidunt volutpat massa. Sed ut ante quis leo feugiat accumsan et a nibh. Vivamus id nisl non risus ultrices posuere. Vivamus facilisis metus eu pellentesque faucibus. Nam imperdiet consequat eros, vitae volutpat nunc. Mauris faucibus lacus eros, quis malesuada mauris iaculis non.</div>'