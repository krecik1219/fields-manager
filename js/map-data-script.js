let map = null;
let currentlySelectedMarkers = [];
let polygons = [];
let borderLine = null;
let selectedPolygon = null;
let infoWindows = [];

let mode_selector = $('#mode_selector').find('input[type=radio]');
mode_selector.change(function() {
    mode = $('#mode_selector').find('input[type=radio]:checked').val();
    setUpModeFeatures();
});
let mode = mode_selector.filter(':checked').val();
//todo change create polygon behaviour to upload object to database
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
    let indexOf = -1;
    for(let i = 0; i<array.length && indexOf === -1; i++)
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
        let coordinates = [];
        for(let i = 0; i<currentlySelectedMarkers.length; i++)
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
    for(let i =0; i<infoWindows.length; i++)
    {
        infoWindows[i].close();
    }
    infoWindows = [];
}

function resetEditorsPanel()
{
    $('#places').val(null);
    $('#plants').val(null);
    $('#colors').val(null);
    $('#descr').val(null);
    $('#area_field').val(null);
}

function setMarker(location)
{
    let marker = new google.maps.Marker(
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
    if(selectedPolygon !== null && confirm("Jesteś pewny/a? Tej operacji nie można cofnąć!"))
    {
        let idField = selectedPolygon.idField;
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
        let polygon = selectedPolygon;
        let selectedCity = getCityFromEditorsPanel();
        console.log("json City: "+JSON.stringify(selectedCity));
        let area = getAreaFromEditorsPanel();
        console.log("area: "+area);
        let providedDescr = getDescriptionFromEditorsPanel();
        console.log("descr: "+providedDescr);
        let selectedColor = getColorFromEditorsPanel();
        console.log("json color: "+JSON.stringify(selectedColor));
        let selectedPlants = getPlantsFromEditorsPanel();
        console.log("json plants: "+JSON.stringify(selectedPlants));
        let plants = [];
        for(let i=0; i<selectedPlants.length; i++)
        {
            plants.push(selectedPlants[i]['idPlant']);
        }
        if(plants.length === 0)
            plants = [''];
        let path = polygon.getPath();
        let coordinates = [];
        for (let j = 0 ; j < path.length ; j++) {
            coordinates.push({
                lat: path.getAt(j).lat(),
                lng: path.getAt(j).lng()
            });
        }
        let plantsToAdd = polygon.plants.filter(x => !plants.includes(x));
        if(plantsToAdd.length === 0)
            plantsToAdd = [''];
        let plantsToDelete = plants.filter(x => !polygon.plants.includes(x));
        if(plantsToDelete.length === 0)
            plantsToDelete = [''];
        let dataToInsert={idPlace: selectedCity['idCity'], area: area, description: providedDescr, idColor: selectedColor['idColor'], plantsToAdd: plantsToAdd, plantsToDelete: plantsToDelete, coordinates:coordinates};
        $.ajax({
            url: 'update-in-db.php',  // todo implement updating in db
            type: 'post',
            dataType: 'json',
            data: {myData: dataToInsert},
            success: function(response){
                if(response['error'] === 0)
                {
                    polygon.city = selectedCity;
                    polygon.fieldArea = area;
                    polygon.description = providedDescr;
                    polygon.color = selectedColor;
                    polygon.setOptions({fillColor: selectedColor['colorHexCode']});
                    polygon.setOptions({strokeColor: selectedColor['colorHexCode']});
                    polygon.plants = selectedPlants;
                }
                alert(response['result']);
            },
            complete: function(){
                borderLine.setMap(null);
                borderLine = null;
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
    let infoWindow = new google.maps.InfoWindow({
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
    let idCity = polygon.city['idCity'];
    let idColor = polygon.color['idColor'];
    let area = polygon.fieldArea;
    let descr = polygon.description;
    let plantsIds = [];
    for(let i=0; i<polygon.plants.length; i++)
    {
        plantsIds.push(polygon.plants[i]['idPlant']);
    }
    $('#places').val(idCity);
    let colorSelector = $('#colors');
    colorSelector.val(idColor);
    colorSelector.trigger('change');
    $('#area_field').val(area);
    $('#descr').val(descr);
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
    let polygonContentString = "Miasto: "+polygon.city['cityName']+"<br/>Pole powierzchni: "+polygon.fieldArea+"<br/>Posadzone rośliny: ";
    let plants = "";
    for(let i=0; i<polygon.plants.length; i++)
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
            let coordinates = [];
            for(let i = 0; i<currentlySelectedMarkers.length; i++)
            {
                console.log("single coor: "+currentlySelectedMarkers[i].getPosition());
                console.log("x: "+currentlySelectedMarkers[i].getPosition().lat() + "; y: "+currentlySelectedMarkers[i].getPosition().lng());
                coordinates.push(currentlySelectedMarkers[i].getPosition());
            }
            console.log("coordinates: "+ coordinates.toString());

            let polygon = new google.maps.Polygon({
                paths: coordinates,
                strokeColor: '#ffffff',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#ffffff',
                fillOpacity: 0.35,
                editable: false,
                map: null,
                idField: null,
                color: {idColor:null, colorHexCode: '#ffffff'},
                city: {idCity:null, cityName: ''},
                plants: [],
                fieldArea: 0,
                description: ''
            });

            google.maps.event.addListener(polygon, 'click', function(event){
                onPolygonClick(event, polygon);
            });

            //borderLine.setMap(null);
            //borderLine = null;

            for(let j = 0; j<currentlySelectedMarkers.length; j++)
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
    let selectedCity = getCityFromEditorsPanel();
    polygon.city = selectedCity;
    console.log("json City: "+JSON.stringify(selectedCity));
    let area = getAreaFromEditorsPanel();
    polygon.fieldArea = area;
    console.log("area: "+area);
    let providedDescr = getDescriptionFromEditorsPanel();
    polygon.description = providedDescr;
    console.log("descr: "+providedDescr);
    let selectedColor = getColorFromEditorsPanel();
    polygon.color = selectedColor;
    polygon.setOptions({fillColor: selectedColor['colorHexCode']});
    polygon.setOptions({strokeColor: selectedColor['colorHexCode']});
    console.log("json color: "+JSON.stringify(selectedColor));
    let selectedPlants = getPlantsFromEditorsPanel();
    polygon.plants = selectedPlants;
    console.log("json plants: "+JSON.stringify(selectedPlants));
    let plants = [];
    for(let i=0; i<selectedPlants.length; i++)
    {
        plants.push(selectedPlants[i]['idPlant']);
    }
    if(plants.length === 0)
        plants = [''];
    let path = polygon.getPath();
    let coordinates = [];
    for (let j = 0 ; j < path.length ; j++) {
        coordinates.push({
            lat: path.getAt(j).lat(),
            lng: path.getAt(j).lng()
        });
    }
    console.log("coordinates: "+JSON.stringify(coordinates));
    let dataToInsert={idPlace: selectedCity['idCity'], area: area, description: providedDescr, idColor: selectedColor['idColor'], plants: plants, coordinates:coordinates};
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
    let placesSelector = $("#places");
    let selectedCityId = placesSelector.val();
    if(selectedCityId === null)
        selectedCityId = 1;
    let selectedCityName = placesSelector.find('option:selected').text();
    return {idCity: parseInt(selectedCityId), cityName: selectedCityName};
}

function getAreaFromEditorsPanel()
{
    let area = $("#area_field").val();
    if(area === null)
        area = 0;
    return area;
}

function getPlantsFromEditorsPanel()
{
    let plantsSelector = $('#plants');
    let selectedPlantsIds = plantsSelector.val();
    let selectedPlants = plantsSelector.find('option:selected');
    let plants = [];
    if(selectedPlantsIds.length>0)
    {
        let plantsNames = [];
        selectedPlants.each(function(index, value) {
            plantsNames.push($(value).text());
        });
        for(let i=0; i<selectedPlantsIds.length; i++)
        {
            plants.push({idPlant: selectedPlantsIds[i], plantName: plantsNames[i]});
        }
    }
    return plants;
}

function getDescriptionFromEditorsPanel()
{
    return $('#descr').val();
}

function getColorFromEditorsPanel()
{
    let colorSelector = $("#colors");
    let selectedColorId = colorSelector.val();
    if(selectedColorId === null)
        selectedColorId = 1;
    let selectedColor = colorSelector.find('option:selected');
    let selectedColorHexCode = selectedColor.css('background-color');
    if(selectedColor.length === 0)
        selectedColorHexCode = '#ffffff';
    console.log("Selected color: "+JSON.stringify(selectedColor));
    console.log("selected colorHexCode: "+selectedColorHexCode);
    return {idColor: parseInt(selectedColorId), colorHexCode: rgb2hex(selectedColorHexCode)};
}

function currentAreaFromMarkers()
{
    if(currentlySelectedMarkers.length>2)
    {
        let coordinates = [];
        for(let i = 0; i<currentlySelectedMarkers.length; i++)
        {
            coordinates.push(currentlySelectedMarkers[i].getPosition());
        }
        coordinates.push(currentlySelectedMarkers[0].getPosition());  // to close the shape
        let squaredMeters =  google.maps.geometry.spherical.computeArea(coordinates);
        return squaredMeters / 10000.0;
    }
    else
        return 0;
}

function displayCurrentSelectedAreaVal()
{
    let area = currentAreaFromMarkers();
    console.log("area: "+area);
    let formatted_area = area.toFixed(4);
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
            resetEditorsPanel();
        }
    });
});

function loadPlaces(jsonResponse)
{
    let places = jsonResponse['places_array'];
    let places_html = "";
    let place=null;
    for(let key in places)
    {
        place = places[key];
        places_html+="<option class = 'placesOption' value='"+key+"'>"+place['place_name']+"</option>";
    }
    $('#places').html(places_html);
}

function loadPlants(jsonResponse)
{
    let plants = jsonResponse['plants_array'];
    let plants_html = "";
    let plant=null;
    for(let key in plants)
    {
        plant = plants[key];
        plants_html+="<option class = 'plantOption' value='"+key+"'>"+plant['plant_name']+"</option>";
    }
    $('#plants').html(plants_html);
}

function loadColors(jsonResponse)
{
    let colors = jsonResponse['colors_array'];
    let colors_html = "";
    let color = null;
    for(let key in colors)
    {
        color = colors[key];
        colors_html+="<option value='"+key+"' style='background-color: "+color['color_hex_code']+";'></option>";
    }
    $('#colors').html(colors_html);
}

function loadPolygons(jsonResponse)
{
    let fieldsArray = jsonResponse['fields_array'];
    let coordinatesArray = jsonResponse['coor_array'];
    let colorsArray = jsonResponse['colors_array'];
    let placesArray = jsonResponse['places_array'];
    let plantsArray = jsonResponse['plants_array'];
    let plantedArray = jsonResponse['planted_array']

    for(let i =0; i<fieldsArray.length; i++)
    {
        let coordinates = [];
        for(let j=0; j<coordinatesArray[fieldsArray[i]['id_field']].length; j++)
        {
            let singleCoord = coordinatesArray[fieldsArray[i]['id_field']][j];
            coordinates.push({lat: parseFloat(singleCoord['lat']), lng: parseFloat(singleCoord['lng'])});
        }
        let planted = [];
        for(let j =0; j<plantedArray[fieldsArray[i]['id_field']].length; j++)
        {
            planted.push({idPlant: plantedArray[fieldsArray[i]['id_field']][j], plantName: plantsArray[plantedArray[fieldsArray[i]['id_field']][j]]['plant_name']});
        }

        let polygon = new google.maps.Polygon({
            paths: coordinates,
            strokeColor: colorsArray[fieldsArray[i]['id_color']]['color_hex_code'],
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: colorsArray[fieldsArray[i]['id_color']]['color_hex_code'],
            fillOpacity: 0.35,
            editable: false,
            map: map,
            idField: fieldsArray[i]['id_field'],
            color: {idColor: fieldsArray[i]['id_color'], colorHexCode: colorsArray[fieldsArray[i]['id_color']]['color_hex_code']},
            city: {idCity: fieldsArray[i]['id_place'], cityName: placesArray[fieldsArray[i]['id_place']]['place_name']},
            plants: planted,
            fieldArea: fieldsArray[i]['area'],
            description: fieldsArray[i]['description']
        });

        console.log("fields ids: "+polygon.idField);

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