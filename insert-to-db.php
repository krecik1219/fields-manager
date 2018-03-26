<?php
    session_start();
    if(!isset($_SESSION['logged']))
    {
        header('Location: index.php');
        exit();
    }
    if(!isset($_POST['myData']))
    {
        header('Location: fields-map.php');
        exit();
    }

    $id_user = $_SESSION['id_user'];

    $my_data = $_POST['myData'];
    $id_place = htmlentities($my_data['idPlace'], ENT_QUOTES, "UTF-8");
    $area = htmlentities($my_data['area'], ENT_QUOTES, "UTF-8");
    $description = htmlentities($my_data['description'], ENT_QUOTES, "UTF-8");
    $id_color = htmlentities($my_data['idColor'], ENT_QUOTES, "UTF-8");
    $owner = htmlentities($my_data['owner'], ENT_QUOTES, "UTF-8");
    $plants = $my_data['plants'];
    if($plants[0]=="")
        $plants=array();
    $coordinates = $my_data['coordinates'];

    require_once "connect.php";
    $connection = @new mysqli($host, $db_user, $db_password, $db_name);
    if($connection->errno!=0)
    {
        echo json_encode(array('result'=>$connection->errno));
        exit();
    }
    $connection->set_charset("utf8");

    try
    {
        // begin transaction
        $connection->autocommit(false);

        $sql_query = "INSERT INTO fields VALUES(NULL, ?, ?, ?, ?, ?, ?)";
        $stmt = $connection->prepare($sql_query);
        if(!$stmt)
            throw new Exception("insert field error");
        $stmt->bind_param("iidiss", $id_user, $id_place, $area, $id_color, $owner, $description);
        if(!$stmt->execute())
            throw new Exception("insert field query execute error: ".$stmt->errno);
        $id_field = $connection->insert_id;

        foreach($plants as $id_plant)
        {
            $id_plant = htmlentities($id_plant, ENT_QUOTES, "UTF-8");
            $sql_query = "INSERT INTO planted VALUES ('$id_field', ?)";
            $stmt = $connection->prepare($sql_query);
            if(!$stmt)
                throw new Exception("insert planted error");
            $stmt->bind_param('i',$id_plant);
            if(!$stmt->execute())
                throw new Exception("insert planted query execute error: ".$stmt->errno);
        }

        $coords_ids = array();
        foreach($coordinates as $coordinate)
        {
            $lat = htmlentities($coordinate['lat'], ENT_QUOTES, "UTF-8");
            $lng = htmlentities($coordinate['lng'], ENT_QUOTES, "UTF-8");
            $sql_query = "INSERT INTO coordinates VALUES(NULL, ?, ?)";
            $stmt = $connection->prepare($sql_query);
            if(!$stmt)
                throw new Exception("insert coords error");
            $stmt->bind_param('dd', $lat, $lng);
            if(!$stmt->execute())
                throw new Exception("insert coords query execute error: ".$stmt->errno);
            $coords_ids[] = $connection->insert_id;
        }

        $counter = 1;
        foreach($coords_ids as $id_coord)
        {
            $sql_query = "INSERT INTO located VALUES('$id_field', '$id_coord', '$counter')";
            if(!$connection->query($sql_query))
                throw new Exception("insert located query execute error: ".$connection->errno);
            $counter++;
        }

       $connection->autocommit(true);  // end transaction
    }
    catch(Exception $e)
    {
        $connection->rollback();  // transaction failed? rollback
        $connection->autocommit(true);
        $connection->close();
        $result = array("result"=>"ERROR: ".$e->getCode());
        echo json_encode($result);
        exit();
    }
    $connection->close();

    $result = array("result"=>"Pole dodano do bazy", "id_field"=>$id_field);
    echo json_encode($result);
?>