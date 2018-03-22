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

    $id_user = $_SESSION['id_user'];
    $sql_query = "SELECT id_place, place_name FROM places ORDER BY place_name ASC";
    // fetch data about all available places
    $places_array = array();
    if($result = $connection->query($sql_query))
    {
        while($row = $result->fetch_assoc())
        {
            $id_place = $row['id_place'];
            $place_name = $row['place_name'];
            $places_array[$id_place] = array("place_name"=>$place_name);
        }
        $result->free_result();
    }
    else
    {
        $connection->close();
        echo '<span style = "color:red">Błąd serwera!</span>';
        exit();
    }
    $sql_query = "SELECT id_plant, plant_name FROM plants ORDER BY plant_name ASC";
    // fetch data about all available plants
    $plants_array = array();
    if($result = $connection->query($sql_query))
    {
        while($row = $result->fetch_assoc())
        {
            $id_plant = $row['id_plant'];
            $plant_name = $row['plant_name'];
            $plants_array[$id_plant] = array("plant_name"=>$plant_name);
        }
        $result->free_result();
    }
    else
    {
        $connection->close();
        echo '<span style = "color:red">Błąd serwera!</span>';
        exit();
    }
    $sql_query = "SELECT id_color, color_hex_code FROM colors";
    // fetch data about all available colors
    $colors_array = array();
    if($result = $connection->query($sql_query))
    {
        while($row = $result->fetch_assoc())
        {
            $id_color = $row['id_color'];
            $color_hex_code = $row['color_hex_code'];
            $colors_array[$id_color] = array("color_hex_code"=>$color_hex_code);
        }
        $result->free_result();
    }
    else
    {
        $connection->close();
        echo '<span style = "color:red">Błąd serwera!</span>';
        exit();
    }
    $sql_query = "SELECT id_field, id_place, area, id_color, description FROM fields WHERE id_user = '$id_user'";
    // fetch data about all available
    $fields_array = array();
    if($result = $connection->query($sql_query))
    {
        while($row = $result->fetch_assoc())
        {
            $id_field = $row['id_field'];
            $id_place = $row['id_place'];
            $area = $row['area'];
            $id_color = $row['id_color'];
            $description = $row['description'];
            $fields_array[] = array("id_field"=>$id_field, "id_place"=>$id_place, "area"=>$area, "id_color"=>$id_color, "description"=>$description);
        }
        $result->free_result();
    }
    else
    {
        $connection->close();
        echo '<span style = "color:red">Błąd serwera!</span>';
        exit();
    }
    // fetch data about fields' coordinates
    $coor_array = array();
    foreach($fields_array as $field)
    {
        $id_field = $field['id_field'];
        $sql_query = "SELECT coordinates.lat, coordinates.lng FROM coordinates INNER JOIN located on coordinates.id_coor = located.id_coor WHERE located.id_field ='$id_field' ORDER BY located.number ASC";
        $coor_array[$id_field] = array();
        if($result = $connection->query($sql_query))
        {
            while($row = $result->fetch_assoc())
            {
                $coor_array[$id_field][] = $row;
            }
            $result->free_result();
        }
        else
        {
            $connection->close();
            echo '<span style = "color:red">Błąd serwera!</span>';
            exit();
        }
    }
    $planted_array = array();
    foreach($fields_array as $field)
    {
        $id_field = $field['id_field'];
        $sql_query = "SELECT id_plant FROM planted WHERE id_field ='$id_field'";
        $planted_array[$id_field] = array();
        if($result = $connection->query($sql_query))
        {
            while($row = $result->fetch_assoc())
            {
                $id_plant=$row['id_plant'];
                $planted_array[$id_field][] = $id_plant;
            }
            $result->free_result();
        }
        else
        {
            $connection->close();
            echo '<span style = "color:red">Błąd serwera!</span>';
            exit();
        }
    }
    $connection->close();

    $result_data = array();
    $result_data['places_array']=$places_array;
    $result_data['plants_array']=$plants_array;
    $result_data['colors_array']=$colors_array;
    $result_data['fields_array']=$fields_array;
    $result_data['coor_array']=$coor_array;
    $result_data['planted_array']=$planted_array;

    // return json data
    echo json_encode($result_data);
?>