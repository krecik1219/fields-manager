<?php
    session_start();
    if(isset($_SESSION['logged']) && $_SESSION['logged'])
    {
        header('Location: fields-map.php');
        exit();
    }
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
    <title>Logowanie</title>
    <link rel="stylesheet" type="text/css" href="css/index_styles.css"/>
</head>
<body>
    <div id="container" >
        <a href="registration.php">Zarajestruj się</a>
        <br/><br/>
        <form id = "loginForm" action="login.php" method="post">
            Login: <br/> <input type="text" name="login"/> <br/>
            Hasło: <br/> <input type="password" name="pass" /> <br/>
            <input type="submit" value="Zaloguj się" />
        </form>
        <?php
            if(isset($_SESSION['error']))
            {
                echo $_SESSION['error'];
            }
        ?>
    </div>
    <div style = "clear:both" ></div>
</body>
</html>