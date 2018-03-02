<?php
    session_start();
    require_once "connect.php";

    $connection = @new mysqli($host, $db_user, $db_password, $db_name);
    if($connection->connect_errno!=0)  // check if any error occured when connecting
    {
        echo "Error: ".$connection->connect_errno;
    }
    else
    {
        $login = $_POST['login'];
        $pass = $_POST['pass'];

        $sql_query = "SELECT * FROM users WHERE login='$login' AND password = '$pass'";

        if($query_result = @$connection->query($sql_query))  // check if query was processed
        {
            // check how many users match given login, if 0, user does not exist
            $users_number = $query_result->num_rows;
            if($users_number>0)  // logged successfully
            {
                $row = $query_result->fetch_assoc();
                $result_login = $row['login'];
                $query_result->free_result();
                $_SESSION['user'] = $result_login;
                header('Location: fieldsMap.php');
            }
        }
        $connection->close();  // remember to close connection!
    }

?>