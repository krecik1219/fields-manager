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
            header('Location: registration.php');
        }
        if(!ctype_alnum($login))
        {
            $validation_flag = false;
            $_SESSION['e_login'] = "Login może składać się tylko z liter i cyfr (bez polskich znaków)";
            header('Location: registration.php');
        }
        $email = $_POST['email'];
        $email_sanitized = filter_var($email, FILTER_SANITIZE_EMAIL);
        if(!filter_var($email_sanitized, FILTER_VALIDATE_EMAIL) || $email_sanitized != $email)
        {
            $validation_flag = false;
            $_SESSION['e_email'] = "Niepoprawny email";
            header('Location: registration.php');
        }
        $pass1 = $_POST['pass1'];
        $pass2 = $_POST['pass2'];
        if(strlen($pass1)<PASS_MIN_LEN || strlen($pass1)>PASS_MAX_LEN)
        {
            $validation_flag = false;
            $_SESSION['e_pass'] = "Hasło musi składać od 8 do 20 znaków";
            header('Location: registration.php');
        }
        if($pass1 != $pass2)
        {
            $validation_flag = false;
            $_SESSION['e_pass'] = "Podane hasła nie są identyczne";
            header('Location: registration.php');
        }
        $hashed_pass = password_hash($pass1, PASSWORD_DEFAULT);
        if(!isset($_POST['regulations']))
        {
            $validation_flag = false;
            $_SESSION['e_regulations'] = "Należy zaakceptować regulamin";
            header('Location: registration.php');
        }

        $captcha_secret = "6LcQM0oUAAAAAGeBUNzxFGnzUGUjRhi633lTzjUm";
        $check_captcha = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$captcha_secret.'&response='.$_POST['g-recaptcha-response']);
        $recaptcha_response = json_decode($check_captcha);
        if(!$recaptcha_response->success)
        {
            $validation_flag = false;
            $_SESSION['e_captcha'] = "Potwierdź, że nie jesteś botem";
            header('Location: registration.php');
        }

        require_once "connect.php";

        $connection = @new mysqli($host, $db_user, $db_password, $db_name);
        if($connection->connect_errno!=0)  // check if any error occured when connecting
        {
            echo "Error: ".$connection->connect_errno;
        }
        else
        {
           // check if email already in database
            $result = $connection->query("SELECT id_u FROM users WHERE email='$email'");
            if($result)
            {
                if($result->num_rows > 0)
                {
                    $validation_flag = false;
                    $_SESSION['e_email'] = "Email już w użyciu";
                    header('Location: registration.php');
                }
                //todo implement rest tests, and finally registration
            }
            else
            {
                $validation_flag = false;
                echo '<span style = "color: red;">Błąd serwera!</span>';
                exit();
            }


            $connection->close();  // remember to close connection!
        }


        if($validation_flag)  // all tests passed - register him
        {
            echo "validation passed";
            exit();
        }
    }
?>