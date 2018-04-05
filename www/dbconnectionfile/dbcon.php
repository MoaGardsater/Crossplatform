<?php
// Lägg till följande rader högst upp i skriptet vid problem med Access-Control-Allow-Origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
exit(0);
}
 $response = file_get_contents("php://input");
 
    echo $response;
    
    // Omvandla JSON till ett PHP-Objekt
    $request = json_decode($response);
    
    // Lagra data från objektet i olika variabler
    $firstname  = $request -> firstname;
    $lastname = $request -> lastname;
    $email = $request -> email;
    $tel = $request -> tel;
    $adult = $request -> adult;
    $kid = $request -> kid;
    $checkin = $request -> checkin;
    $checkout = $request -> checkout;
    $totPrice = $request -> totalPrice;
    
    // Skapa ett meddelande, ämnesrubrik och headers
    $message = "Tack $firstname $lastname. Din epost $email finns nu i vår lista. Dina valda datum är $checkin till $checkout";
    $subject = "Moes Hoes - Anmälan till nyhetsbrevet";
    $headers = "From: moehoesnyheter@gmail.com";
    // Kontrollera att e-post finns och skicka mejlet
    if ($email != "") {
       mail($email , $subject, $message, $headers);
    }
    
    // Logga in i databasen!
$dbHost = "localhost";
$dbUser = "tqmczbby_wp645";
$dbPass = "(7S9pCQZ8@";
$dbName = "tqmczbby_wp645";
$connection = mysqli_connect($dbHost , $dbUser , $dbPass , $dbName);
if(!$connection){
     echo "<h1>" . mysqli_connect_error() . "</h1>"; exit;
}
mysqli_set_charset($connection, "utf8"); // löser problem med svenska tecken

// Förbered en SQL-sats
$sql = "INSERT INTO bookings VALUES ('$firstname', '$lastname', '$email', '$tel' ,'$adult', '$kid', '$checkin', '$checkout', '$totPrice')";
// Exekvera (kör) SQL-satsen
mysqli_query($connection , $sql) or die(mysqli_error($connection));



?>