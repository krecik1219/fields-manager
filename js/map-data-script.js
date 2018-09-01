var map = null;
var currentlySelectedMarkers = [];
var polygons = [];
var plantsDataDict = {};
var ownersDataDict = {};
var borderLine = null;
var selectedPolygon = null;
var infoWindows = [];

var mode_selector = $('#mode_selector').find('input[type=radio]');
var mode = mode_selector.filter(':checked').val();
mode_selector.change(function() {
    mode = $('#mode_selector').find('input[type=radio]:checked').val();
    setUpModeFeatures();
});

var fields_coloring_selector = $('#fields_coloring_selector').find('input[type=radio]');
var displayColoring = fields_coloring_selector.filter(':checked').val();
fields_coloring_selector.change(function() {
    displayColoring = $('#fields_coloring_selector').find('input[type=radio]:checked').val();
    changePolygonsColors();
});

function changePolygonsColors()
{
    for(var i = 0; i < polygons.length; i++)
    {
        var polygon = polygons[i];
        if(displayColoring === 'owner_coloring')
            polygon.color = {idColor: polygon.ownerColor['idColor'], colorHexCode: polygon.ownerColor['colorHexCode']};
        else  // plant_coloring
            polygon.color = {idColor: polygon.plantColor['idColor'], colorHexCode: polygon.plantColor['colorHexCode']};
        polygon.setOptions({fillColor: polygon.color['colorHexCode']});
        polygon.setOptions({strokeColor: polygon.color['colorHexCode']});
    }
}

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
    $('#owners').prop('disabled', true);
    $('#places').prop('disabled', true);
    $('#area_field').prop('disabled', true);
    $('#plants').prop('disabled', true);
    $('#descr').prop('disabled', true);
    //$('#colors').prop('disabled', true);
}

function setUpCreateModeFeatures()
{
    $('#owners').prop('disabled', false);
    $('#places').prop('disabled', false);
    $('#area_field').prop('disabled', false);
    $('#plants').prop('disabled', false);
    $('#descr').prop('disabled', false);
    //$('#colors').prop('disabled', false);
}

function setUpEditModeFeatures()
{
    $('#owners').prop('disabled', false);
    $('#places').prop('disabled', false);
    $('#area_field').prop('disabled', false);
    $('#plants').prop('disabled', false);
    $('#descr').prop('disabled', false);
    //$('#colors').prop('disabled', false);
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
            resetEditorsPanel();
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

function resetEditorsPanel()
{
    $('#owners').val(null);
    $('#places').val(null);
    $('#plants').val(null);
    //$('#colors').val(null);
    $('#descr').val(null);
    $('#area_field').val(null);
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
    console.log("polygons num before remove: "+polygons.length );
    if(selectedPolygon !== null && confirm("Jesteś pewny/a? Tej operacji nie można cofnąć!"))
    {
        var idField = selectedPolygon.idField;
        $.ajax({
            url: 'remove-from-db.php',
            type: 'post',
            dataType: 'json',
            data: {idField: idField},
            success: function(response){
                if(response['error'] === 0)
                {
                    removeFromArray(polygons, selectedPolygon);
                    selectedPolygon.setMap(null);
                    selectedPolygon = null;
                    console.log("polygons num after remove: "+polygons.length );
                }
                alert(response['result']);
            }
        });
    }
}

function confirmChanges()
{
    if(selectedPolygon!=null)
    {
        var polygon = selectedPolygon;
        var providedOwner = getOwnerFromEditorsPanel();
        console.log("owner: "+providedOwner);
        if(providedOwner != null)
        {
            if(displayColoring === 'owner_coloring')
                polygon.color = {idColor: ownersDataDict[providedOwner]['idColor'], colorHexCode: ownersDataDict[providedOwner]['colorHexCode']};
            polygon.ownerColor = {idColor: ownersDataDict[providedOwner]['idColor'], colorHexCode: ownersDataDict[providedOwner]['colorHexCode']};
        }
        var selectedCity = getCityFromEditorsPanel();
        console.log("json City: "+JSON.stringify(selectedCity));
        var area = getAreaFromEditorsPanel();
        console.log("area: "+area);
        var providedDescr = getDescriptionFromEditorsPanel();
        console.log("descr: "+providedDescr);
        var selectedPlants = getPlantsFromEditorsPanel();
        console.log("json plants: "+JSON.stringify(selectedPlants));
        if(selectedPlants.length > 0)
        {
            var plantId = selectedPlants[0]['idPlant'];
            if(displayColoring === 'plant_coloring')
                polygon.color = {idColor: plantsDataDict[plantId]['idColor'], colorHexCode: plantsDataDict[plantId]['colorHexCode']};
            polygon.plantColor = {idColor: plantsDataDict[plantId]['idColor'], colorHexCode: plantsDataDict[plantId]['colorHexCode']};
        }
        var plants = [];
        for(var i=0; i<selectedPlants.length; i++)
        {
            plants.push(selectedPlants[i]['idPlant']);
        }
        if(plants.length === 0)
            plants = [''];
        var polygonPlants = [];
        for(var j=0; j<polygon.plants.length; j++)
        {
            console.log('polygon plant: '+j+" ; "+polygon.plants[j]['idPlant']);
            polygonPlants.push(polygon.plants[j]['idPlant']);
        }
        var plantsToAdd = arraySubtraction(plants, polygonPlants);
        if(plantsToAdd.length === 0)
            plantsToAdd = [''];
        var plantsToDelete = arraySubtraction(polygonPlants, plants);
        if(plantsToDelete.length === 0)
            plantsToDelete = [''];
        console.log("plants before: "+JSON.stringify(polygonPlants));
        console.log("plants selected now: "+JSON.stringify(plants));
        console.log("plants to add: "+JSON.stringify(plantsToAdd));
        console.log("plants to delete: "+JSON.stringify(plantsToDelete));
        var ownerIdToSend = providedOwner;
        if(ownerIdToSend == null)
            ownerIdToSend = '';
        var dataToUpdate={idField: polygon.idField, idPlace: selectedCity['idCity'], area: area, description: providedDescr, plantsToAdd: plantsToAdd, plantsToDelete: plantsToDelete, idOwner: ownerIdToSend};
        console.log("data to udpate: "+JSON.stringify(dataToUpdate));
        $.ajax({
            url: 'update-in-db.php',
            type: 'post',
            dataType: 'json',
            data: {myData: dataToUpdate},
            success: function(response){
                if(response['error'] === 0)
                {
                    polygon.owner = providedOwner;
                    polygon.city = selectedCity;
                    polygon.fieldArea = area;
                    polygon.description = providedDescr;
                    polygon.setOptions({fillColor: polygon.color['colorHexCode']});
                    polygon.setOptions({strokeColor: polygon.color['colorHexCode']});
                    polygon.plants = selectedPlants;
                }
                alert(response['result']);
            }
        });

        resetEditorsPanel();
    }
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
    var area = polygon.fieldArea;
    var descr = polygon.description;
    var owner = polygon.owner;
    var plantsIds = [];
    for(var i=0; i<polygon.plants.length; i++)
    {
        plantsIds.push(polygon.plants[i]['idPlant']);
    }
    $('#places').val(idCity);
    $('#area_field').val(area);
    $('#descr').val(descr);
    $('#owners').val(owner);
    $('#plants').val(plantsIds);
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
    var ownerName = '';
    var ownerSurname = '';
    if(polygon.owner != null)
    {
        ownerName = ownersDataDict[polygon.owner]['name'];
        ownerSurname = ownersDataDict[polygon.owner]['surname'];
    }
    var polygonContentString = "Właściciel: "+ownerName+" "+ownerSurname+"<br/>Miasto: "+polygon.city['cityName']+"<br/>Pole powierzchni: "+polygon.fieldArea+"<br/>Posadzone rośliny: ";
    var plants = "";
    for(var i=0; i<polygon.plants.length; i++)
        plants+=(polygon.plants[i]['plantName']+", ");
    polygonContentString+=plants.substr(0, plants.length-2);
    polygonContentString+=("<br/>Opis: "+polygon.description);
    return polygonContentString;
}

function createPolygonFromMarkers()
{
    if(mode === 'create')
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
                map: null,
                idField: null,
                ownerColor: {idColor:null, colorHexCode: '#ffffff'},
                plantColor: {idColor:null, colorHexCode: '#ffffff'},
                color: {idColor:null, colorHexCode: '#ffffff'},
                city: {idCity:null, cityName: ''},
                plants: [],
                fieldArea: 0,
                description: '',
                owner: null
            });

            google.maps.event.addListener(polygon, 'click', function(event){
                onPolygonClick(event, polygon);
            });

            //borderLine.setMap(null);
            //borderLine = null;

            for(var j = 0; j<currentlySelectedMarkers.length; j++)
                currentlySelectedMarkers[j].setMap(null);
            currentlySelectedMarkers = [];

            console.log("created ...");
            //polygons.push(polygon);

            storeFieldData(polygon);

        }
    }
}

function storeFieldData(polygon)
{
    var fieldOwner = getOwnerFromEditorsPanel();
    polygon.owner = fieldOwner;
    console.log("owner: "+fieldOwner);
    var selectedCity = getCityFromEditorsPanel();
    polygon.city = selectedCity;
    console.log("json City: "+JSON.stringify(selectedCity));
    var area = getAreaFromEditorsPanel();
    polygon.fieldArea = area;
    console.log("area: "+area);
    var providedDescr = getDescriptionFromEditorsPanel();
    polygon.description = providedDescr;
    console.log("descr: "+providedDescr);
    if(fieldOwner != null)
    {
        if(displayColoring === 'owner_coloring')
            polygon.color = {idColor: ownersDataDict[fieldOwner]['idColor'], colorHexCode: ownersDataDict[fieldOwner]['colorHexCode']};
        polygon.ownerColor = {idColor: ownersDataDict[fieldOwner]['idColor'], colorHexCode: ownersDataDict[fieldOwner]['colorHexCode']};
    }
    var selectedPlants = getPlantsFromEditorsPanel();
    polygon.plants = selectedPlants;
    console.log("json plants: "+JSON.stringify(selectedPlants));
    if(polygon.plants.length > 0)
    {
        var plantId = polygon.plants[0]['idPlant'];
        if(displayColoring === 'plant_coloring')
            polygon.color = {idColor: plantsDataDict[plantId]['idColor'], colorHexCode: plantsDataDict[plantId]['colorHexCode']};
        polygon.plantColor = {idColor: plantsDataDict[plantId]['idColor'], colorHexCode: plantsDataDict[plantId]['colorHexCode']};
    }
    polygon.setOptions({fillColor: polygon.color['colorHexCode']});
    polygon.setOptions({strokeColor: polygon.color['colorHexCode']});
    var plants = [];
    for(var i=0; i<selectedPlants.length; i++)
    {
        plants.push(selectedPlants[i]['idPlant']);
    }
    if(plants.length === 0)
        plants = [''];
    var path = polygon.getPath();
    var coordinates = [];
    for (var j = 0 ; j < path.length ; j++) {
        coordinates.push({
            lat: path.getAt(j).lat(),
            lng: path.getAt(j).lng()
        });
    }
    console.log("coordinates: "+JSON.stringify(coordinates));
    console.log('fieldowner: '+fieldOwner);
    if(fieldOwner == null)
        fieldOwner = '';
    var dataToInsert={idPlace: selectedCity['idCity'], area: area, description: providedDescr, plants: plants, coordinates:coordinates, idOwner: fieldOwner};
    console.log("data to insert: "+JSON.stringify(dataToInsert));
    // database insertion
    $.ajax({
        url: 'insert-to-db.php',
        type: 'post',
        dataType: 'json',
        data: {myData: dataToInsert},
        success: function(response){
            console.log("response: "+JSON.stringify(response));
            polygon.idField = response['id_field'];
            polygon.setOptions({map: map});
            polygons.push(polygon);
            alert(response['result']);
        },
        complete: function(){
            borderLine.setMap(null);
            borderLine = null;
        }
    });

    resetEditorsPanel();
}

function getCityFromEditorsPanel()
{
    var placesSelector = $("#places");
    var selectedCityId = placesSelector.val();
    if(selectedCityId === null)
        selectedCityId = 1;
    var selectedCityName = placesSelector.find('option:selected').text();
    return {idCity: parseInt(selectedCityId), cityName: selectedCityName};
}

function getAreaFromEditorsPanel()
{
    var area = $("#area_field").val();
    if(area === null)
        area = 0;
    return area;
}
// old vesrion for multi selector
// function getPlantsFromEditorsPanel()
// {
//     var plantsSelector = $('#plants');
//     var selectedPlantsIds = plantsSelector.val();
//     var selectedPlants = plantsSelector.find('option:selected');
//     var plants = [];
//     if(selectedPlantsIds != null && selectedPlantsIds.length>0)
//     {
//         var plantsNames = [];
//         selectedPlants.each(function(index, value) {
//             plantsNames.push($(value).text());
//         });
//         for(var i=0; i<selectedPlantsIds.length; i++)
//         {
//             plants.push({idPlant: selectedPlantsIds[i], plantName: plantsNames[i]});
//         }
//     }
//     return plants;
// }

function getPlantsFromEditorsPanel()
{
    var plantsSelector = $('#plants');
    var selectedPlantId = plantsSelector.val();
    var plants = [];
    if(selectedPlantId != null)
    {
        var plantName = plantsDataDict[selectedPlantId]['plantName'];
        plants.push({idPlant: selectedPlantId, plantName: plantName});
    }
    return plants;
}

function getDescriptionFromEditorsPanel()
{
    return $('#descr').val();
}

function getOwnerFromEditorsPanel()
{
    return $('#owners').val();
}

// function getColorFromEditorsPanel()
// {
//     var colorSelector = $("#colors");
//     var selectedColorId = colorSelector.val();
//     if(selectedColorId === null)
//         selectedColorId = 1;
//     var selectedColor = colorSelector.find('option:selected');
//     var selectedColorHexCode = selectedColor.css('background-color');
//     if(selectedColor.length === 0)
//         selectedColorHexCode = '#ffffff';
//     console.log("Selected color: "+JSON.stringify(selectedColor));
//     console.log("selected colorHexCode: "+selectedColorHexCode);
//     return {idColor: parseInt(selectedColorId), colorHexCode: rgb2hex(selectedColorHexCode)};
// }

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
            //loadColors(response);
            loadOwners(response);
            loadPolygons(response);
            resetEditorsPanel();
        }
    });
});

function loadPlaces(jsonResponse)
{
    var places = jsonResponse['places_array'];
    var places_html = "";
    var place = null;
    for(var key in places)
    {
        place = places[key];
        places_html+="<option class = 'placesOption' value='"+key+"'>"+place['place_name']+"</option>";
    }
    $('#places').html(places_html);
}

function loadOwners(jsonResponse)
{
    var owners = jsonResponse['owners_array'];
    var colors = jsonResponse['colors_array'];
    var owners_html = "";
    var owner = null;
    var colorHexCode = null;
    for(var key in owners)
    {
        owner = owners[key];
        var idColor = owner['id_color'];
        colorHexCode = colors[idColor]['color_hex_code'];
        ownersDataDict[key] = {idOwner: key, name: owner['name'], surname: owner['surname'], idColor: idColor, colorHexCode: colorHexCode};
        owners_html += "<option class = 'ownersOption' value='"+key+"' style='background-color: "+colorHexCode+"; color: "+invertColor(colorHexCode)+"; padding: 8px; font-size: 18px;'>"+owner['name']+" "+owner['surname']+"</option>";
    }
    $('#owners').html(owners_html);
}

function loadPlants(jsonResponse)
{
    var plants = jsonResponse['plants_array'];
    var colors = jsonResponse['colors_array'];
    var plants_html = "";
    var plant = null;
    var colorHexCode = null;
    for(var key in plants)
    {
        plant = plants[key];
        var idColor = plant['id_color'];
        colorHexCode = colors[idColor]['color_hex_code'];
        plantsDataDict[key] = {idPlant: key, plantName: plant['plant_name'], idColor: idColor, colorHexCode: colorHexCode};
        plants_html+="<option class = 'plantOption' value='"+key+"' style='background-color: "+colorHexCode+"; color: "+invertColor(colorHexCode)+"; padding: 8px; font-size: 18px;'>"+plant['plant_name']+"</option>";
    }
    $('#plants').html(plants_html);
}

// function loadColors(jsonResponse)
// {
//     var colors = jsonResponse['colors_array'];
//     var colors_html = "";
//     var color = null;
//     for(var key in colors)
//     {
//         color = colors[key];
//         colors_html+="<option value='"+key+"' style='background-color: "+color['color_hex_code']+";'></option>";
//     }
//     $('#colors').html(colors_html);
// }

function loadPolygons(jsonResponse)
{
    var fieldsArray = jsonResponse['fields_array'];
    var coordinatesArray = jsonResponse['coor_array'];
    var colorsArray = jsonResponse['colors_array'];
    var placesArray = jsonResponse['places_array'];
    var plantsArray = jsonResponse['plants_array'];
    var plantedArray = jsonResponse['planted_array'];
    var ownersArray = jsonResponse['owners_array'];

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
            planted.push({idPlant: plantedArray[fieldsArray[i]['id_field']][j], plantName: plantsArray[plantedArray[fieldsArray[i]['id_field']][j]]['plant_name'], idColor: plantsArray[plantedArray[fieldsArray[i]['id_field']][j]]['id_color']});
        }
        var idOwner = fieldsArray[i]['id_owner'];
        var ownerColorId = null;
        var ownerColorHexCode = '#ffffff';
        if(idOwner != null)
        {
            var owner = ownersArray[idOwner];
            ownerColorId = owner['id_color'];
            ownerColorHexCode = colorsArray[ownerColorId]['color_hex_code'];
        }

        var polygon = new google.maps.Polygon({
            paths: coordinates,
            strokeColor: ownerColorHexCode,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: ownerColorHexCode,
            fillOpacity: 0.35,
            editable: false,
            map: map,
            idField: fieldsArray[i]['id_field'],
            ownerColor: {idColor: ownerColorId, colorHexCode: ownerColorHexCode},
            plantColor:{idColor: null, colorHexCode: '#ffffff'},
            color: {idColor: ownerColorId, colorHexCode: ownerColorHexCode},
            city: {idCity: fieldsArray[i]['id_place'], cityName: placesArray[fieldsArray[i]['id_place']]['place_name']},
            plants: planted,
            fieldArea: fieldsArray[i]['area'],
            description: fieldsArray[i]['description'],
            owner: idOwner
        });

        if(planted.length > 0)
        {
            var plant = planted[0];
            var plantColorId = plant['idColor'];
            var plantColorHexCode = colorsArray[plantColorId]['color_hex_code'];
            polygon.plantColor = {idColor: plantColorId, colorHexCode: plantColorHexCode};
        }

        (function(polygonWrap)
        {
            google.maps.event.addListener(polygonWrap, 'click', function(event){
                onPolygonClick(event, polygonWrap);
            });
        })(polygon);

        polygons.push(polygon);
    }
}

function rgb2hex(rgb) {
    if (  rgb.search("rgb") == -1 ) {
        return rgb;
    } else {
        rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
}

function arraySubtraction(a1, a2)
{
    return $(a1).not(a2).get();
}

function invertColor(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}