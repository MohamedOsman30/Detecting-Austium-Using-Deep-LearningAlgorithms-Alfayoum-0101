<?php
    session_start();
    include_once "config.php";

    $outgoing_id = $_SESSION['session_id'];
    $searchTerm = mysqli_real_escape_string($conn, $_POST['searchTerm']);

    $sql = "SELECT * FROM doctors WHERE NOT session_id = {$outgoing_id} AND (first_name LIKE '%{$searchTerm}%' OR last_name LIKE '%{$searchTerm}%') ";
    $output = "";
    $query = mysqli_query($conn, $sql);
    if(mysqli_num_rows($query) > 0){
        include_once "data.php";
    }else{
        $output .= 'No user found related to your search term';
    }
    echo $output;
?>