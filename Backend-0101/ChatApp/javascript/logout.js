document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (!logoutBtn) {
        console.error("Error: No element with ID 'logout-btn' found.");
        return;
    }

    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        console.log("Logout button clicked");

        fetch('php/logout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("Server Response:", data);
            if (data.trim() === "success") {
                window.location.href = "login.php";
            } else {
                console.error("Logout failed:", data);
                alert("Logout failed: " + data);
            }
        })
        .catch(error => {
            console.error("Request failed:", error);
            alert("Logout request failed. Please check your connection.");
        });
    });
});