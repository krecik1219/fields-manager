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
    if(isset($_POST['mode']))
    {
        $mode = $_POST['mode'];
        switch($mode)
        {
            case "explore":
            {

            }
            break;
            case "create":
            {

            }
            break;
            case "edit":
            {

            }
            break;
        }

    }
    $connection->close();

    function prepareExplorerView($connection)
    {

    }
    function prepareEditorView($connection)
    {
        //todo use ajax to fetch data
    }

    function prepareCreatorView($connection)
    {
        $sql_query = "SELECT id_place, place_name FROM places";
        $result = $connection->query($sql_query);
        if($result)
        {
            $return ='';
            while($row = $result->fetch_assoc())
            {
                $place_id = $row['id_place'];
                $place_name = $row['place_name'];
                $return.='<option class = "placesOption" value="'.$place_id.'">'.$place_name.'</option>';
            }
            echo $return;
        }
    }
?>