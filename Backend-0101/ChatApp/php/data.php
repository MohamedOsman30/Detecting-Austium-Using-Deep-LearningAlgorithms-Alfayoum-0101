<?php
    while($row = mysqli_fetch_assoc($query)){
        // Check if the current row belongs to a user or a doctor
        $role = $row['role'];  // Assuming 'role' is a column in your database that indicates 'user' or 'doctor'

        $sql2 = "SELECT * FROM messages WHERE (incoming_msg_id = {$row['session_id']}
                OR outgoing_msg_id = {$row['session_id']}) AND (outgoing_msg_id = {$outgoing_id} 
                OR incoming_msg_id = {$outgoing_id}) ORDER BY msg_id DESC LIMIT 1";
        $query2 = mysqli_query($conn, $sql2);
        $row2 = mysqli_fetch_assoc($query2);
        (mysqli_num_rows($query2) > 0) ? $result = $row2['msg'] : $result ="No message available";
        (strlen($result) > 28) ? $msg =  substr($result, 0, 28) . '...' : $msg = $result;
        if(isset($row2['outgoing_msg_id'])){
            ($outgoing_id == $row2['outgoing_msg_id']) ? $you = "You: " : $you = "";
        }else{
            $you = "";
        }
        ($row['status'] == "Offline now") ? $offline = "offline" : $offline = "";
        ($outgoing_id == $row['session_id']) ? $hid_me = "hide" : $hid_me = "";

        // Modify the href to include the role
        $output .= '<a href="chat.php?id='. $row['session_id'] .'&role='. $role .'">
                    <div class="content">
                    <img src="http://project-api.com/'. $row['photo'] .'" alt="">
                    <div class="details">
                        <span>'. $row['first_name']. " " . $row['last_name'] .'</span>
                        <p>'. $you . $msg .'</p>
                    </div>
                    </div>
                    <div class="status-dot '. $offline .'"><i class="fas fa-circle"></i></div>
                </a>';
    }
?>
