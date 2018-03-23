<?php
    session_start();
    if(!isset($_SESSION['logged']))
    {
    header('Location: index.php');
    exit();
    }
    if(!isset($_POST['idField']))
    {
    header('Location: fields-map.php');
    exit();
    }
    require_once "connect.php";
    $connection = @new mysqli($host, $db_user, $db_password, $db_name);
    if($connection->errno!=0)
    {
    echo json_encode(array('result'=>$connection->error));
    exit();
    }
    $connection->set_charset("utf8");

    $id_field = $_POST['idField'];

    try
    {
        $connection->autocommit(false);  // begin transaction

        $sql_query = "DELETE FROM fields WHERE id_field=?";
        $stmt = $connection->prepare($sql_query);
        if(!$stmt)
            throw new Exception("delete stmt error: ".$stmt->errno);
        $stmt->bind_param("i", $id_field);
        if(!$stmt->execute())
            throw new Exception("delete query error: ".$stmt->errno);

        $connection->autocommit(true);  // end transaction
    }
    catch(Exception $e)
    {
        $connection->rollback();  // any error? rollback
        $connection->autocommit(true);
        $connection->close();
        echo json_encode(array('result'=>"Error: ".$e->getCode(), 'error'=>$e->getCode()));
        exit();
    }
    $connection->close();

    echo json_encode(array('result'=>'Pole zostało usuniete z bazy', 'error'=>0));
?>