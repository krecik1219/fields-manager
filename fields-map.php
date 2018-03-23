<?php
    session_start();
    if(!isset($_SESSION['logged']))
    {
        header('Location: index.php');
        exit();
    }
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
    <title>Mapa działek</title>
    <link rel="stylesheet" type="text/css" href="css/fields-map-styles.css"/>
</head>
<body>
    <div id = "container">
        <div id = "map">
        </div>
        <div id = "menu">
            <div id = "userMenu">
                Testowy tekst
                <br/>
                <br/>
                <input id = "createPolygon" type = "button" value = "create polygon" onclick="createPolygonFromMarkers();" />
                <input id = "removePolygon" type = "button" value = "remove polygon" onclick="removePolygon();"/>
                <form id = "mode_selector">
                    Swobodne przegladanie <input type="radio" name="mode" value="explore" checked /> <br/>
                    Utwórz nowy obszar <input type="radio" name="mode" value="create" /> <br/>
                    Edycja <input type="radio" name="mode" value="edit" /> <br/>
                </form>
                <div id="editor" style="margin-top: 40px;">
                    <form id="editingForm" method="post">
                        Najbliższa miejscowość <br/>
                        <select id = "places" name = "places">
                        </select> <br/>
                        <br/>Pole powierzchni [ha]<br/>
                        <input id = "area_field" type="text" name="area" /> <br/>
                        <br/>Posadzone rośliny <br/>
                        <select id = "plants" name = "plants" multiple style="width: 200px">
                        </select> <br/>
                        <br/>Opis <br/>
                        <textarea id="descr" name="descr" rows="8" cols = "60"></textarea> <br/>
                        <br/>Kolor <br/>
                        <select id = "colors" name = "color" style="width:100px;">
                        </select> <br/>
                        <br/>
                        <input type="button" value = "Zapisz zmiany" onclick="confirmChanges();"/>

                    </form>
                </div>
            </div>
            <div id = "bottomMenu">
                <form action="logout.php">
                    <input type = "submit" style="float: right; margin-right: 30px" id="logout" type = "button" value = "Wyloguj"/>
                </form>
            </div>
        </div>
    </div>
    <div style = "clear:both" ></div>

<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBeheJaSAo9RkDQFtCJLKfbJgRCW1NvvEs"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type = "text/javascript" src = "js/map-data-script.js"></script>
<script src="js/styling-functions.js"></script>

</body>
</html>