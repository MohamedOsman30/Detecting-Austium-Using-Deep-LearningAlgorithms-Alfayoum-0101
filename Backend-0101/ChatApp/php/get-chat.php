<?php 
session_start();
if (isset($_SESSION['session_id'])) {
    include_once "config.php";
    $outgoing_id = $_SESSION['session_id'];
    $incoming_id = mysqli_real_escape_string($conn, $_POST['incoming_id']);
    $output = "";

    // Adjusting the SQL query to also join with the appropriate table based on user role
    $sql = "SELECT messages.*, users.photo AS user_img, doctors.photo AS doctor_img 
            FROM messages 
            LEFT JOIN users ON users.session_id = messages.outgoing_msg_id
            LEFT JOIN doctors ON doctors.session_id = messages.outgoing_msg_id
            WHERE (outgoing_msg_id = {$outgoing_id} AND incoming_msg_id = {$incoming_id})
            OR (outgoing_msg_id = {$incoming_id} AND incoming_msg_id = {$outgoing_id}) 
            ORDER BY msg_id";

    $query = mysqli_query($conn, $sql);

    if (mysqli_num_rows($query) > 0) {
        while ($row = mysqli_fetch_assoc($query)) {
            $sender_img = $row['doctor_img'] ?? $row['user_img'];

            if ($row['outgoing_msg_id'] === $outgoing_id) {
                $output .= '<div class="chat outgoing">
                            <div class="details">
                                <p>'. $row['msg'] .'</p>
                            </div>
                            </div>';
            } else {
                $output .= '<div class="chat incoming">
                            <img src="http://project-api.com/'.$sender_img.'" alt="">
                            <div class="details">
                                <p>'. $row['msg'] .'</p>
                            </div>
                            </div>';
            }
        }
    } else {
        $output .= '<div class="text">No messages are available. Once you send a message, they will appear here.</div>';
    }
    echo $output;
} else {
    header("location: ../login.php");
}
?>
