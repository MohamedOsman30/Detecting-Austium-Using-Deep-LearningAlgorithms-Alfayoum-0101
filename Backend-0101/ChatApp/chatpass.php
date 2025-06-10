<?php
session_start();
include_once "php/config.php";
$outgoing_id = $_SESSION['session_id'];

// Fetch the role of the logged-in user
$sql_role = "SELECT role FROM users WHERE session_id = {$outgoing_id}";
$query_role = mysqli_query($conn, $sql_role);

if (mysqli_num_rows($query_role) > 0) {
    $row_role = mysqli_fetch_assoc($query_role);
    $logged_in_role = $row_role['role'];

    if ($logged_in_role == 'user') {
        header("Location: chat.php");
        exit();
    } else {
        header("Location: password_modal.php");
        exit();
    }
} else {
    header("Location: password_modal.php");
    exit();
}
?>