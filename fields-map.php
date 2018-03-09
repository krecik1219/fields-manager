<?php
    session_start();
    if(!isset($_SESSION['logged']))
    {
        header('Location: index.php');
        exit();
    }
    require_once "connect.php";
    $connection = @new mysqli($host, $db_user, $db_password, $db_name);
    if($connection->errno!=0)
    {
        echo '<span style = "color:red">Błąd serwera!</span>';
        exit();
    }
    $connection->set_charset("utf8");
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
                        <select name = "places">
                            <?php
                            $sql_query = "SELECT id_place, place_name FROM places";
                            $result = $connection->query($sql_query);
                            if($result)
                            {
                                while($row = $result->fetch_assoc())
                                {
                                    $place_id = $row['id_place'];
                                    $place_name = $row['place_name'];
                                    echo '<option class = "placesOption" value="'.$place_id.'">'.$place_name.'</option>';
                                }
                            }
                            ?>
                        </select> <br/>
                        <br/>Pole powierzchni [ha]<br/>
                        <input id = "area_field" type="text" name="area" /> <br/>
                        <br/>Posadzone rośliny <br/>
                        <select name = "plants[]" multiple style="width: 200px">
                            <?php
                            $sql_query = "SELECT id_plant, plant_name FROM plants";
                            $result = $connection->query($sql_query);
                            if($result)
                            {
                                while($row = $result->fetch_assoc())
                                {
                                    $plant_id = $row['id_plant'];
                                    $plant_name = $row['plant_name'];
                                    echo '<option class = "plantOption" value="'.$plant_id.'">'.$plant_name.'</option>';
                                }
                            }
                            ?>
                        </select> <br/>
                        <br/>Opis <br/>
                        <textarea name="descr" rows="8" cols = "60"></textarea> <br/>
                        <br/>Kolor <br/>
                        <select id = "color_list" name = "color" style="width:100px;">
                            <?php
                                $sql_query = "SELECT id_color, color_hex_code FROM colors";
                                $result = $connection->query($sql_query);
                                if($result)
                                {
                                   while($row = $result->fetch_assoc())
                                   {
                                       $color_id = $row['id_color'];
                                       $color_code = $row['color_hex_code'];
                                       echo '<option value="'.$color_id.'" style="background-color: '.$color_code.';"></option>';
                                   }
                                }
                            ?>
                        </select> <br/>
                        <br/>
                        <input type="submit" value = "Zapisz zmiany" />

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
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBeheJaSAo9RkDQFtCJLKfbJgRCW1NvvEs&callback=initMap" async defer></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type = "text/javascript" src = "js/map-script.js"></script>
<script src="js/styling-functions.js"></script>
</body>
</html>
<?php
    $connection->close();
?>