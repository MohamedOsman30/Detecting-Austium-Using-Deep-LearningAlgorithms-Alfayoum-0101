<?php 
  session_start();
  include_once "php/config.php";
  if(!isset($_SESSION['session_id'])){
    header("location: login.php");
  }
?>

<?php include_once "header.php"; ?>
<body>
  <div class="wrapper">
    <section class="chat-area">
      <header>
        <?php 
          $user_id = mysqli_real_escape_string($conn, $_GET['id']);
          $role = mysqli_real_escape_string($conn, $_GET['role']); // Get the role from the URL

          // Adjust the query to fetch either users or doctors
          $table = ($role === 'doctor') ? 'doctors' : 'users';  // Adjust the table based on role
          $sql = mysqli_query($conn, "SELECT * FROM {$table} WHERE session_id = {$user_id}");
          
          if(mysqli_num_rows($sql) > 0){
            $row = mysqli_fetch_assoc($sql);
          } else {
            header("location: users.php");
          }
        ?>
        <a href="users.php" class="back-icon"><i class="fas fa-arrow-left"></i></a>
        <img src="http://project-api.com/<?php echo !empty($row['photo']) ? $row['photo'] : 'default.png'; ?>" alt="">
        <div class="details">
          <span><?php echo $row['first_name']. " " . $row['last_name'] ?></span>
          <p><?php echo $row['status']; ?></p>
        </div>
      </header>
      <div class="chat-box">

      </div>
      <form action="#" class="typing-area">
        <input type="text" class="incoming_id" name="incoming_id" value="<?php echo $user_id; ?>" hidden>
        <input type="text" name="role" value="<?php echo $role; ?>" hidden> <!-- Pass the role -->
        <input type="text" name="message" class="input-field" placeholder="Type a message here..." autocomplete="off">
        <button><i class="fab fa-telegram-plane"></i></button>
      </form>
    </section>
  </div>


  
  <!-- Popup Window -->
  <div id="popup" class="popup">
  <div class="popup-content">
    <span class="close-btn">&times;</span>
    <h2>Doctor's Password Required</h2>
    <p>Please enter your chat password:</p>
    <input type="password" id="doctor-input" placeholder="Enter password">
    <p id="error-message" style="color: red; display: none;"></p> <!-- Error message area -->
    <button id="submit-btn">Submit</button>
  </div>
</div>


  <script src="javascript/chat.js"></script>
  <script>
  document.addEventListener('DOMContentLoaded', function() {
    // Get role and user_id from PHP
    const role = '<?php echo $role; ?>';
    const userId = '<?php echo $user_id; ?>';
    
    const errorMessage = document.getElementById('error-message'); // Error message element

    // Log the role to check if it's correct
    console.log('Role:', role);

    // If role is doctor, show popup
    if (role === 'doctor') {
      console.log('Displaying popup for doctor');
      document.getElementById('popup').style.display = 'block';
    }

    // Close button functionality
    document.querySelector('.close-btn').onclick = function() {
      window.location.href = 'users.php';
    }

    // Submit button functionality
    document.getElementById('submit-btn').onclick = function() {
      const input = document.getElementById('doctor-input').value;
      if(input) {
        // Send AJAX request to verify password
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "php/verify_password.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function() {
          if(this.responseText === "success"){
            errorMessage.style.display = 'none'; // Hide error message if successful
            document.getElementById('popup').style.display = 'none';
          } else {
            errorMessage.innerText = "Incorrect password. Please try again.";
            errorMessage.style.display = 'block'; // Show error message
          }
        }
        xhr.send("id=" + userId + "&chat_pass=" + input);
      } else {
        errorMessage.innerText = "Please enter the password.";
        errorMessage.style.display = 'block'; // Show error message
      }
    }
  });
</script>




  <style>
    /* Popup window styles */
    .popup {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
    }
    .popup-content {
      position: absolute;
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 300px;
      box-shadow: 0px 0px 10px #000;
    }
    .close-btn {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    .close-btn:hover,
    .close-btn:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
    #doctor-input {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
    }
    #submit-btn {
      margin-top: 10px;
      padding: 10px;
      width: 100%;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    #submit-btn:hover {
      background-color: #0056b3;
    }
  </style>

</body>
</html>
