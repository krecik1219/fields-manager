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

    $my_data = $_POST['myData'];
    $id_field = htmlentities($my_data['idField'], ENT_QUOTES, "UTF-8");
    $id_place =  htmlentities($my_data['idPlace'], ENT_QUOTES, "UTF-8");
    $area =  htmlentities($my_data['area'], ENT_QUOTES, "UTF-8");
    $description = htmlentities($my_data['description'], ENT_QUOTES, "UTF-8");
    $id_color = htmlentities($my_data['idColor'], ENT_QUOTES, "UTF-8");
    $owner = htmlentities($my_data['owner'], ENT_QUOTES, "UTF-8");
    $plants_to_add = $my_data['plantsToAdd'];
    $plants_to_delete = $my_data['plantsToDelete'];

    if($plants_to_add[0]=="")
        $plants_to_add=array();
    if($plants_to_delete[0]=="")
        $plants_to_delete=array();

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
        $connection->autocommit(false);  // begin transaction

        $sql_query = "UPDATE fields SET id_place = ?, area = ?, id_color = ?, owner = ?, description = ? WHERE id_field = ?";
        $stmt = $connection->prepare($sql_query);
        if(!$stmt)
            throw new Exception("error prepare stmt update fields ".$stmt->errno);
        $stmt->bind_param("idissi", $id_place, $area, $id_color, $owner, $description, $id_field);

        if(!$stmt->execute())
            throw new Exception("error stmt execute update fields ".$stmt->errno);

        foreach($plants_to_delete as $plant_to_delete)
        {
            $sql_query = "DELETE FROM planted WHERE id_field = ? AND id_plant = ?";
            $stmt = $connection->prepare($sql_query);
            if(!$stmt)
                throw new Exception("error prepare stmt delete planted ".$stmt->errno);
            $stmt->bind_param("ii", $id_field, $plant_to_delete);
            if(!$stmt->execute())
                throw new Exception("error stmt execute delete planted ".$stmt->errno);
        }

        foreach($plants_to_add as $plant_to_add)
        {
            $sql_query = "INSERT INTO planted VALUES(?, ?)";
            $stmt = $connection->prepare($sql_query);
            if(!$stmt)
                throw new Exception("error prepare stmt insert planted ".$stmt->errno);
            $stmt->bind_param("ii", $id_field, $plant_to_add);
            if(!$stmt->execute())
                throw new Exception("error stmt execute insert planted ".$stmt->errno);
        }

        $connection->autocommit(true);  // end transaction
    }
    catch(Exception $e)
    {
        $connection->rollback();  // transaction failed? rollback
        $connection->autocommit(true);
        $connection->close();
        $result = array("result"=>"ERROR: ".$e->getCode(), "error"=>$e->getCode());
        echo json_encode($result);
        exit();
    }

    $connection->close();

    $result = array("result"=>"Pole zaktualizowane", "error"=>0);
    echo json_encode($result);

?>