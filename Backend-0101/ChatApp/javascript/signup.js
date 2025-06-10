document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('successPopup');
    const popupBtn = document.getElementById('popupBtn');
  
    // Function to show the pop-up
    function showPopup() {
        console.log("Showing Popup"); // For debugging
        popup.style.display = 'flex';
    }
  
    // Function to hide the pop-up and redirect to the login page
    function hidePopup() {
        console.log("Redirecting to login.php"); // Debugging
        popup.style.display = 'none';
        window.location.href = "login.php"; // Ensure this is correct
    }
    
  
    // Event listener to close the pop-up when "OK" is clicked
    popupBtn.addEventListener('click', hidePopup);
  
    // Modify the AJAX response handling in signup.js
    const form = document.querySelector(".signup form"),
        continueBtn = form.querySelector(".button input"),
        errorText = form.querySelector(".error-text");
  
    form.onsubmit = (e) => {
        e.preventDefault();
    }
  
    continueBtn.onclick = () => {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "php/signup.php", true);
        xhr.onload = () => {
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status === 200){
                    let data = xhr.response;
                    console.log(data); // Debugging to check the response
                    if(data === "success"){
                        showPopup(); // Show the pop-up instead of redirecting
                    }else{
                        errorText.style.display = "block";
                        errorText.textContent = data;
                    }
                }
            }
        }
        let formData = new FormData(form);
        xhr.send(formData);
    }
  });
  