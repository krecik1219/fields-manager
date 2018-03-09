<?php
    session_start();
    if(!isset($_POST['login']))
    {
        header('Location: registration.php');
        exit();
    }
    else
    {
        define("LOGIN_MIN_LEN", 3);
        define("LOGIN_MAX_LEN", 30);
        define("PASS_MIN_LEN", 8);
        define("PASS_MAX_LEN", 20);
        $validation_flag = true;
        $login = $_POST['login'];
        if(strlen($login)<LOGIN_MIN_LEN || strlen($login)>LOGIN_MAX_LEN)
        {
            $validation_flag=false;
            $_SESSION['e_login'] = "Nick musi posiadać od 3 do 30 znaków";
        }
        if(!ctype_alnum($login))
        {
            $validation_flag = false;
            $_SESSION['e_login'] = "Login może składać się tylko z liter i cyfr (bez polskich znaków)";
        }
        $email = $_POST['email'];
        $email_sanitized = filter_var($email, FILTER_SANITIZE_EMAIL);
        if(!filter_var($email_sanitized, FILTER_VALIDATE_EMAIL) || $email_sanitized != $email)
        {
            $validation_flag = false;
            $_SESSION['e_email'] = "Niepoprawny email";
        }
        $pass1 = $_POST['pass1'];
        $pass2 = $_POST['pass2'];
        if(strlen($pass1)<PASS_MIN_LEN || strlen($pass1)>PASS_MAX_LEN)
        {
            $validation_flag = false;
            $_SESSION['e_pass'] = "Hasło musi składać od 8 do 20 znaków";
        }
        if($pass1 != $pass2)
        {
            $validation_flag = false;
            $_SESSION['e_pass'] = "Podane hasła nie są identyczne";
        }
        $hashed_pass = password_hash($pass1, PASSWORD_DEFAULT);
        if(!isset($_POST['regulations']))
        {
            $validation_flag = false;
            $_SESSION['e_regulations'] = "Należy zaakceptować regulamin";
        }

        $captcha_secret = "6LcQM0oUAAAAAGeBUNzxFGnzUGUjRhi633lTzjUm";
        $check_captcha = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$captcha_secret.'&response='.$_POST['g-recaptcha-response']);
        $recaptcha_response = json_decode($check_captcha);
        if(!$recaptcha_response->success)
        {
            $validation_flag = false;
            $_SESSION['e_captcha'] = "Potwierdź, że nie jesteś botem";
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
            // check if email already in database
            $result = $connection->query("SELECT id_u FROM users WHERE email='$email'");
            if($result)
            {
                if($result->num_rows > 0)
                {
                    $validation_flag = false;
                    $_SESSION['e_email'] = "Email już w użyciu";
                }
            }
            else
            {
                $validation_flag = false;
                $connection->close();
                echo '<span style = "color: red;">Błąd serwera!</span>';
                exit();
            }

            // check login exists
            $result = $connection->query("SELECT id_u FROM users WHERE login='$login'");
            if($result)
            {
                if($result->num_rows > 0)
                {
                    $validation_flag = false;
                    $_SESSION['e_login'] = "Login już w użyciu";
                }
            }
            else
            {
                $validation_flag = false;
                $connection->close();
                echo '<span style = "color: red;">Błąd serwera!</span>';
                exit();
            }
            if($validation_flag)  // all tests passed - register him
            {
                $sql_query = "INSERT INTO users VALUES(NULL, ?, ?, ?)";
                $stmt = $connection->prepare($sql_query);
                $login = htmlentities($login, ENT_QUOTES, "UTF-8");
                $stmt->bind_param("sss", $login, $email, $hashed_pass);
                if($stmt->execute())
                {
                    $_SESSION['registration_success'] = true;
                    header('Location: welcome.php');
                }
                else
                {
                    $connection->close();
                    echo '<span style = "color: red;">Błąd serwera!</span>';
                    exit();
                }
            }
            else
            {
                header('Location: registration.php');
            }
            $connection->close();  // remember to close connection!
        }
    }
?>