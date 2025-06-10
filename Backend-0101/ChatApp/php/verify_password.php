<?php
session_start();
include_once "config.php";

if(isset($_POST['id']) && isset($_POST['chat_pass'])){
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    $chat_pass = mysqli_real_escape_string($conn, $_POST['chat_pass']);

    // Fetch the stored password for the doctor
    $sql = mysqli_query($conn, "SELECT chat_pass FROM doctors WHERE session_id = '{$id}'");
    if(mysqli_num_rows($sql) > 0){
        $row = mysqli_fetch_assoc($sql);
        if($row['chat_pass'] === $chat_pass){
            echo "success"; // Password is correct
        } else {
            echo "fail"; // Password is incorrect
        }
    } else {
        echo "fail"; // No such doctor found
    }
} else {
    echo "fail"; // Invalid request
}
?>
