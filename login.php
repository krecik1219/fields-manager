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
        exit();
    }
    else
    {
        $connection->set_charset("utf8");
        $login = htmlentities($_POST['login'], ENT_QUOTES, "UTF-8");
        $pass = $_POST['pass'];

        $sql_query = "SELECT * FROM users WHERE login=?";

        if($stmt = $connection->prepare($sql_query))
        {
            if($stmt->bind_param("s", $login))
            {
                if($stmt->execute())
                {
                    $query_result = $stmt->get_result();
                    $stmt->close();
                    $users_number = $query_result->num_rows;
                    if($users_number>0)  // logged successfully
                    {
                        $row = $query_result->fetch_assoc();
                        if(password_verify($pass, $row['password']))
                        {
                            unset($_SESSION['error']);  // unset session error variable when user finally logs in
                            $_SESSION['logged'] = true;
                            $result_id = $row['id_u'];
                            $query_result->free_result();
                            $_SESSION['id_user'] = $result_id;
                            header('Location: fields-map.php');
                        }
                        else
                        {
                            $_SESSION['error'] = '<span style = "color:red">Nieprawidłowy login lub hasło!</span>';
                            header('Location: index.php');
                        }
                        $query_result->free_result();
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