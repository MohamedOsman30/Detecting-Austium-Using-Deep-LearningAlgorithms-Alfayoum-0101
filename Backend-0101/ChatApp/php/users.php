<?php
session_start();
include_once "config.php";
$outgoing_id = $_SESSION['session_id'];

// Fetch the role of the logged-in user
$sql_role = "SELECT role FROM users WHERE session_id = {$_SESSION['session_id']}";
$query_role = mysqli_query($conn, $sql_role);

if(mysqli_num_rows($query_role) > 0) {
$row_role = mysqli_fetch_assoc($query_role);
$logged_in_role = $row_role['role'];
if($logged_in_role == 'user')  {
        // If the logged-in user is not a doctor, show all doctors
        $sql = "SELECT session_id, first_name, last_name, photo, status, role
                FROM doctors
                WHERE role = 'doctor'
                AND session_id != {$outgoing_id}
                ORDER BY id DESC";
    }

    $query = mysqli_query($conn, $sql);
    $output = "";
    if(mysqli_num_rows($query) == 0){
        $output .= "No users are available to chat";
    } elseif(mysqli_num_rows($query) > 0) {
        include_once "data.php";
    }
} else {
    $sql = "SELECT DISTINCT u.session_id, u.first_name, u.last_name, u.photo, u.status, u.role
    FROM users AS u
    JOIN messages AS m ON (u.session_id = m.incoming_msg_id OR u.session_id = m.outgoing_msg_id)
    WHERE (m.outgoing_msg_id = {$outgoing_id} OR m.incoming_msg_id = {$outgoing_id})
    AND u.session_id != {$outgoing_id}";




    

    $query = mysqli_query($conn, $sql);
    $output = "";
    if(mysqli_num_rows($query) == 0){
        $output .= "No users are available to chat";
    } elseif(mysqli_num_rows($query) > 0) {
        include_once "data.php";
    }
}

echo $output;
?>
