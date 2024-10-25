function updateContract(contractId, action) {
  fetch("/update-contract", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ contractId, action }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update contract.");
      }
      return response.text();
    })
    .then((data) => {
      console.log(data);
      location.reload();
    })
    .catch((error) => console.error("Error:", error));
}

function validateLogin(username, password) {
  fetch("/login-technician", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        alert("Incorrect username or password.");
        throw new Error("Login failed.");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        const baseUrl = `${window.location.origin}/technicianmobile?username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`;
        console.log(baseUrl);
        window.location.href = baseUrl;
      }
    })
    .catch((error) => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".accept-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const contractId = button.getAttribute("data-contract-id");
      updateContract(contractId, "accept");
    });
  });

  document.querySelectorAll(".cancel-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const contractId = button.getAttribute("data-contract-id");
      updateContract(contractId, "decline");
    });
  });

  document.querySelectorAll(".done-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const contractId = button.getAttribute("data-contract-id");
      updateContract(contractId, "done");
    });
  });

  // Handle Login Form
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const usernameEl = document.getElementById("input-name");
      const passwordEl = document.getElementById("input-password");

      const username = usernameEl.value.trim();
      const password = passwordEl.value.trim();

      validateLogin(username, password);
    });
  }
});
