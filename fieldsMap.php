<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
    <title>Mapa działek</title>
    <link rel="stylesheet" type="text/css" href="css/fieldsMap_styles.css"/>
</head>
<body>
    <div id = "container">
        <div id = "map">
            <script type = "text/javascript" src = "js/mapScript.js"></script>
        </div>
        <div id = "userMenu">
            Testowy tekst
            <br/>
            <br/>
            <input id = "createPolygon" type = "button" value = "create polygon" onclick="createPolygonFromMarkers();" />
            <input id = "removePolygon" type = "button" value = "remove polygon" onclick="removePolygon();"/>
        </div>
    </div>
    <div style = "clear:both" ></div>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBeheJaSAo9RkDQFtCJLKfbJgRCW1NvvEs&callback=initMap" async defer></script>
</body>
</html>