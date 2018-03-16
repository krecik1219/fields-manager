var map = null;
var currentlySelectedMarkers = [];
var polygons = [];
var borderLine = null;
var selectedPolygon = null;
var infoWindows = [];

var mode_selector = $('#mode_selector').find('input[type=radio]');
mode_selector.change(function() {
    mode = $('#mode_selector').find('input[type=radio]:checked').val();
    setUpModeFeatures();
});
var mode = mode_selector.filter(':checked').val();

function setUpModeFeatures()
{
    switch(mode)
    {
        case 'explore':
            setUpExploreModeFeatures();
            break;
        case 'create':
            setUpCreateModeFeatures();
            break;
        case 'edit':
            setUpEditModeFeatures();
            break;
    }
}

function setUpExploreModeFeatures()
{
    $('#places').prop('disabled', true);
    $('#area_field').prop('disabled', true);
    $('#plants').prop('disabled', true);
    $('#descr').prop('disabled', true);
    $('#colors').prop('disabled', true);
}

function setUpCreateModeFeatures()
{
    $('#places').prop('disabled', false);
    $('#area_field').prop('disabled', false);
    $('#plants').prop('disabled', false);
    $('#descr').prop('disabled', false);
    $('#colors').prop('disabled', false);
}

function setUpEditModeFeatures()
{
    $('#places').prop('disabled', false);
    $('#area_field').prop('disabled', false);
    $('#plants').prop('disabled', false);
    $('#descr').prop('disabled', false);
    $('#colors').prop('disabled', false);
}

setUpModeFeatures();
//function initMap()
//{
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {lat: 50.216680, lng: 17.857814},
        mapTypeId: 'hybrid',
        disableDefaultUI: true,
        zoomControl: true
    });

    google.maps.event.addListener(map, 'click', function(event){
        console.log(typeof event.latLng);
        mapOnClick(event.latLng);
    });

//}

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
        coordinates.push(currentlySelectedMarkers[0].getPosition());  // to close the shape
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
    displayCurrentSelectedAreaVal();
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

function mapOnClick(location)
{
    switch(mode)
    {
        case 'create':
        {
            setMarker(location);
        }
        break;
        default:
        {
            resetCurrentlySelectedPolygon();
        }
        break;
    }
}

function resetCurrentlySelectedPolygon()
{
    if(selectedPolygon!==null)
        selectedPolygon.setOptions({fillColor: selectedPolygon.color['colorHexCode']});
    selectedPolygon = null;
    for(var i =0; i<infoWindows.length; i++)
    {
        infoWindows[i].close();
    }
    infoWindows = [];
}

function setMarker(location)
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
    resetCurrentlySelectedPolygon();
    polygon.setOptions({fillColor:'#00ffff'});
    selectedPolygon = polygon;
    displayPolygonInfoInEditorsPanel(polygon);
    var infoWindow = new google.maps.InfoWindow({
        content: getContentForPolygon(polygon),
        position: event.latLng
    });
    infoWindows.push(infoWindow);
    google.maps.event.addListener(infoWindow, 'closeclick', function(event)
    {
        onInfoWindowCloseClick(event, polygon, infoWindow);
    });
    infoWindow.open(map);
}

function displayPolygonInfoInEditorsPanel(polygon)
{
    var idCity = polygon.city['idCity'];
    var idColor = polygon.color['idColor'];
    var plantsIds = [];
    for(var i=0; i<polygon.plants.length; i++)
    {
        plantsIds.push(polygon.plants[i]['idPlant']);
    }
    //todo display those info in editors panel
}

function onInfoWindowCloseClick(event, polygon, infoWindow)
{
    if(polygon!==null)
    {
        polygon.setOptions({fillColor:polygon.color['colorHexCode']});
        selectedPolygon = null;
    }
    removeFromArray(infoWindows, infoWindow);
}

function getContentForPolygon(polygon)
{
    var polygonContentString = "Miasto: "+polygon.city['cityName']+"<br/>Pole powierzchni: "+polygon.fieldArea+"<br/>Posadzone rośliny: ";
    var plants = "";
    for(var i=0; i<polygon.plants.length; i++)
        plants+=(polygon.plants[i]['plantName']+", ");
    polygonContentString+=plants.substr(0, plants.length-2);
    polygonContentString+=("<br/>Opis: "+polygon.description);
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
            strokeColor: '#ffffff',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#ffffff',
            fillOpacity: 0.35,
            editable: false,
            map: map,
            color: {idColor:0, colorHexCode: '#ffffff'},
            city: {idCity:0, cityName: ''},
            plants: [],
            fieldArea: 0,
            description: ''
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

function currentAreaFromMarkers()
{
    if(currentlySelectedMarkers.length>2)
    {
        var coordinates = [];
        for(var i = 0; i<currentlySelectedMarkers.length; i++)
        {
            coordinates.push(currentlySelectedMarkers[i].getPosition());
        }
        coordinates.push(currentlySelectedMarkers[0].getPosition());  // to close the shape
        var squaredMeters =  google.maps.geometry.spherical.computeArea(coordinates);
        return squaredMeters / 10000.0;
    }
    else
        return 0;
}

function displayCurrentSelectedAreaVal()
{
    var area = currentAreaFromMarkers();
    console.log("area: "+area);
    var formatted_area = area.toFixed(4);
    $('#area_field').val(formatted_area);
}


$(document).ready(function(){
    $.ajax({
        url: 'fetch-data.php',
        type: 'post',
        dataType: 'json',
        success: function(response){
            loadPlaces(response);
            loadPlants(response);
            loadColors(response);
            loadPolygons(response);
        }
    });
});

function loadPlaces(jsonResponse)
{
    var places = jsonResponse['places_array'];
    var places_html = "";
    var place=null;
    for(var key in places)
    {
        place = places[key];
        places_html+="<option class = 'placesOption' value='"+key+"'>"+place['place_name']+"</option>";
    }
    $('#places').html(places_html);
}

function loadPlants(jsonResponse)
{
    var plants = jsonResponse['plants_array'];
    var plants_html = "";
    var plant=null;
    for(var key in plants)
    {
        plant = plants[key];
        plants_html+="<option class = 'plantOption' value='"+key+"'>"+plant['plant_name']+"</option>";
    }
    $('#plants').html(plants_html);
}

function loadColors(jsonResponse)
{
    var colors = jsonResponse['colors_array'];
    var colors_html = "";
    var color = null;
    for(var key in colors)
    {
        color = colors[key];
        colors_html+="<option value='"+key+"' style='background-color: "+color['color_hex_code']+";'></option>";
    }
    $('#colors').html(colors_html);
}

function loadPolygons(jsonResponse)
{
    //todo a bit tricky with dictionary json, problem with coordinates array (dictionary in fact)
    var fieldsArray = jsonResponse['fields_array'];
    var coordinatesArray = jsonResponse['coor_array'];
    var colorsArray = jsonResponse['colors_array'];
    var placesArray = jsonResponse['places_array'];
    var plantsArray = jsonResponse['plants_array'];
    var plantedArray = jsonResponse['planted_array']

    for(var i =0; i<fieldsArray.length; i++)
    {
        var coordinates = [];
        for(var j=0; j<coordinatesArray[fieldsArray[i]['id_field']].length; j++)
        {
            var singleCoord = coordinatesArray[fieldsArray[i]['id_field']][j];
            coordinates.push({lat: parseFloat(singleCoord['lat']), lng: parseFloat(singleCoord['lng'])});
        }
        var planted = [];
        for(var j =0; j<plantedArray[fieldsArray[i]['id_field']].length; j++)
        {
            planted.push({idPlant: plantedArray[fieldsArray[i]['id_field']][j], plantName: plantsArray[plantedArray[fieldsArray[i]['id_field']][j]]['plant_name']});
        }

        var polygon = new google.maps.Polygon({
            paths: coordinates,
            strokeColor: colorsArray[fieldsArray[i]['id_color']]['color_hex_code'],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: colorsArray[fieldsArray[i]['id_color']]['color_hex_code'],
            fillOpacity: 0.35,
            editable: false,
            map: map,
            color: {idColor: fieldsArray[i]['id_color'], colorHexCode: colorsArray[fieldsArray[i]['id_color']]['color_hex_code']},
            city: {idCity: fieldsArray[i]['id_place'], cityName: placesArray[fieldsArray[i]['id_place']]['place_name']},
            plants: planted,
            fieldArea: fieldsArray[i]['area'],
            description: fieldsArray[i]['description']
        });

        (function(polygonWrap)
        {
            google.maps.event.addListener(polygonWrap, 'click', function(event){
                onPolygonClick(event, polygonWrap);
            });
        })(polygon);

        polygons.push(polygon);
    }
}

var polygonContentString = '<div id = "content">Donec bibendum ex eu hendrerit mattis. Ut faucibus, metus ut elementum gravida, mauris quam tristique leo, ac tincidunt dolor mi sit amet nunc. Donec at augue nulla. In quis magna nec tellus tristique ultricies vel non tellus. Curabitur euismod quis orci dictum congue. Fusce eget egestas massa. Etiam laoreet vehicula turpis, quis scelerisque tortor iaculis sit amet. Donec malesuada elementum libero, ut rutrum purus cursus eu. Praesent sodales sem a varius aliquam. Mauris sit amet enim in augue commodo tristique. Quisque leo tellus, porttitor eu mi non, tincidunt volutpat massa. Sed ut ante quis leo feugiat accumsan et a nibh. Vivamus id nisl non risus ultrices posuere. Vivamus facilisis metus eu pellentesque faucibus. Nam imperdiet consequat eros, vitae volutpat nunc. Mauris faucibus lacus eros, quis malesuada mauris iaculis non.</div>';