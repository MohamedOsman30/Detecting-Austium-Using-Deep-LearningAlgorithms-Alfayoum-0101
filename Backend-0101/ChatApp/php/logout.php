<?php
session_start();

if (!isset($_SESSION['session_id'])) {
    http_response_code(400);
    echo "No user is logged in.";
    exit;
}

include_once "config.php";
$logout_id = $_SESSION['session_id'];
$role = isset($_SESSION['role']) ? $_SESSION['role'] : 'users';
$table = ($role === 'doctors') ? 'doctors' : 'users';

$stmt = $conn->prepare("UPDATE `$table` SET status = ? WHERE session_id = ?");
if ($stmt === false) {
    http_response_code(500);
    echo "Error preparing statement: " . $conn->error;
    exit;
}

$status = "Offline now";
$stmt->bind_param("ss", $status, $logout_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        session_unset();
        session_destroy();
        echo "success";
    } else {
        http_response_code(400);
        echo "No matching user found.";
    }
} else {
    http_response_code(500);
    echo "Error updating status: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>