document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }), // No userType
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            if (data.success) {
                console.log(`Redirecting to: ${data.redirectUrl}`); // Debugging log
                window.location.href = data.redirectUrl; // Redirect to dashboard
            } else {
                console.error(data.message); // Log error message
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            // Log error for debugging
        });
    });
});
