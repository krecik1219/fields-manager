<?php
    session_start();
    if(!isset($_POST['login']) || !isset($_POST['pass']))
    {
        header('Location: index.php');
        exit();
    }
    require_once "connect.php";

    $connection = @new mysqli($host, $db_user, $db_password, $db_name);
    if($connection->connect_errno!=0)  // check if any error occured when connecting
    {
        echo "Error: ".$connection->connect_errno;
    }
    else
    {
        $login = htmlentities($_POST['login'], ENT_QUOTES, "UTF-8");
        $pass = htmlentities($_POST['pass'], ENT_QUOTES, "UTF-8");

        $sql_query = "SELECT * FROM users WHERE login=? AND password = ?";

        if($stmt = $connection->prepare($sql_query))
        {
            if($stmt->bind_param("ss", $login, $pass))
            {
                if($stmt->execute())
                {
                    $query_result = $stmt->get_result();
                    $stmt->close();
                    $users_number = $query_result->num_rows;
                    if($users_number>0)  // logged successfully
                    {
                        unset($_SESSION['error']);  // unset session error variable when user finally logs in
                        $_SESSION['logged'] = true;
                        $row = $query_result->fetch_assoc();
                        $result_login = $row['login'];
                        $query_result->free_result();
                        $_SESSION['user'] = $result_login;
                        header('Location: fieldsMap.php');
                    }
                    else
                    {
                        $_SESSION['error'] = '<span style = "color:red">Nieprawidłowy login lub hasło!</span>';
                        header('Location: index.php');
                    }
                }
            }
        }
        $connection->close();  // remember to close connection!
    }

?>