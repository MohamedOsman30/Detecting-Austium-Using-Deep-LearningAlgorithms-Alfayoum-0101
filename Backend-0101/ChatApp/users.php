<?php
session_start();
include_once "php/config.php";

// Ensure the user is logged in
if (!isset($_SESSION['session_id'])) {
    header("Location: login.php");
    exit();
}

// Check role, default to 'users'
$role = isset($_SESSION['role']) ? $_SESSION['role'] : 'users';
$table = ($role === 'doctors') ? 'doctors' : 'users';

// Fetch user/doctor info with prepared statement
$stmt = $conn->prepare("SELECT * FROM `$table` WHERE session_id = ?");
$stmt->bind_param("s", $_SESSION['session_id']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
} else {
    echo "User not found.";
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();
$conn->close();

// Handle user profile image
$photo_url = !empty($row['photo']) ? "http://project-api.com/{$row['photo']}" : "images/default-avatar.png";
?>
<?php include_once "header.php"; ?>
<body>
  <div class="wrapper">
    <section class="users">
      <header>
        <div class="content">
          <img src="<?php echo htmlspecialchars($photo_url); ?>" alt="User Image">
          <div class="details">
            <span><?php echo htmlspecialchars($row['first_name'] . " " . $row['last_name']); ?></span>
            <p><?php echo htmlspecialchars($row['status']); ?></p>
          </div>
        </div>
        <a href="#" id="logout-btn" class="logout">Logout</a>
      </header>
      <div class="search">
        <span class="text">Select a user to start chat</span>
        <input type="text" placeholder="Enter name to search...">
        <button><i class="fas fa-search"></i></button>
      </div>
      <div class="users-list"></div>
    </section>
  </div>

  <script src="javascript/users.js"></script>
  <script src="javascript/logout.js"></script>
</body>
</html>