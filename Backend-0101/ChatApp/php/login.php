<?php 
session_start();
include_once "config.php";

$email = mysqli_real_escape_string($conn, $_POST['email']);
$password = mysqli_real_escape_string($conn, $_POST['password']);
$role = mysqli_real_escape_string($conn, $_POST['role']); // Get the selected role (users or doctors)

if (!empty($email) && !empty($password)) {
    // Choose the table based on the selected role
    $table = ($role === 'doctors') ? 'doctors' : 'users';
    
    $sql = mysqli_query($conn, "SELECT * FROM {$table} WHERE email = '{$email}'");
    
    if (mysqli_num_rows($sql) > 0) {
        $row = mysqli_fetch_assoc($sql);
        
        // Use password_verify() instead of md5
        if (password_verify($password, $row['password'])) {
            $status = "Active now";
            $sql2 = mysqli_query($conn, "UPDATE {$table} SET status = '{$status}' WHERE session_id = '{$row['session_id']}'");

            
            if ($sql2) {
                $_SESSION['session_id'] = $row['session_id'];
                $_SESSION['role'] = $role; // Store the role in the session
                echo "success";
            } else {
                echo "Something went wrong. Please try again!";
            }
        } else {
            echo "Email or Password is Incorrect!";
        }
    } else {
        echo "$email - This email does not exist!";
    }
} else {
    echo "All input fields are required!";
}
?>