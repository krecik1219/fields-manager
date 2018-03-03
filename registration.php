<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
    <title>Zarejestruj się</title>
    <link rel="stylesheet" type="text/css" href="css/index_styles.css"/>
    <script src='https://www.google.com/recaptcha/api.js'></script>
    <style>
        .error
        {
            color:red;
            margin-top:10px;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
<div id="container" >
    <form action="register.php" method="post">
        Login: <br/> <input type="text" name="login" /><br/>
        <?php
            if(isset($_SESSION['e_login']))
            {
                echo '<div class ="error">'.$_SESSION['e_login'].'</div>';
                unset($_SESSION['e_login']);
            }
        ?>
        E-mail <br/> <input type="text" name="email" /> <br/>
        <?php
        if(isset($_SESSION['e_email']))
        {
            echo '<div class ="error">'.$_SESSION['e_email'].'</div>';
            unset($_SESSION['e_email']);
        }
        ?>
        Hasło  <br/> <input type="password" name="pass1" /> <br/>
        <?php
        if(isset($_SESSION['e_pass']))
        {
            echo '<div class ="error">'.$_SESSION['e_pass'].'</div>';
            unset($_SESSION['e_pass']);
        }
        ?>
        Powtórz hasło  <br/> <input type="password" name="pass2" /> <br/>

        <label>
            <input type="checkbox" name = "regulations">Akceptuję regulamin
        </label>
        <?php
        if(isset($_SESSION['e_regulations']))
        {
            echo '<div class ="error">'.$_SESSION['e_regulations'].'</div>';
            unset($_SESSION['e_regulations']);
        }
        ?>
        <div class="g-recaptcha" data-sitekey="6LcQM0oUAAAAAKpnmGiq93pbxKC1PqjB_Sgw4Pxx"></div>
        <?php
        if(isset($_SESSION['e_captcha']))
        {
            echo '<div class ="error">'.$_SESSION['e_captcha'].'</div>';
            unset($_SESSION['e_captcha']);
        }
        ?>
        <br/>
        <input type="submit" value="Zarejestruj się"/>
    </form>
</div>
<div style = "clear:both" ></div>
</body>
</html>