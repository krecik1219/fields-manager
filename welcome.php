<?php
session_start();
if(!isset($_SESSION['registration_success']) || !$_SESSION['registration_success'])
{
    header('Location: index.php');
    exit();
}
else
{
    unset($_SESSION['registration_success']);
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
    <title>Witamy</title>
    <link rel="stylesheet" type="text/css" href="css/index_styles.css"/>
</head>
<body>
<div id="container" >
    Dziękujemy za rejestrację!
    <a href = "index.php">Przejdź do pierwszego logowania</a>
</div>
<div style = "clear:both" ></div>
</body>
</html>