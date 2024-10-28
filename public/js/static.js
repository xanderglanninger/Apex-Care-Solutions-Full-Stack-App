let clients = [];
const contracts = [];
let OldClients = [];
let technicians = [];
let authenticatedUsername = "";
let contractsCom = [];

// Wait for the DOM to load before running the script
document.addEventListener("DOMContentLoaded", async () => {
  const clientForm = document.getElementById("clientForm");
  const contractForm = document.getElementById("contractForm");
  const contractClientNameInput = document.getElementById("Contract-Client-Name");

  // Load old clients from client.json
  await loadOldClients(); // Ensures OldClients is available before proceeding

  // Handle client form submission
  try {
    clientForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const newClient = {
        name: document.getElementById("Client-Name").value,
        surname: document.getElementById("Client-Surname").value,
        email: document.getElementById("Client-Email").value,
        phone: document.getElementById("Client-Phone").value,
        location: document.getElementById("Client-Location").value,
      };

      writeToClient(newClient, "client", false);
      OldClients.push(newClient); // Save the new client

      console.log("Client added:", newClient);
      clientForm.reset();
    });
  } catch (error) {}

  try {
    // Handle contract form submission
    contractForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const newContract = {
        contract_id: 0,
        clientName: contractClientNameInput.value,
        clientSurname: document.getElementById("Contract-Client-Surname").value,
        clientEmail: document.getElementById("Contract-Client-Email").value,
        clientPhone: document.getElementById("Contract-Client-Phone").value,
        typeofjob: document.getElementById("Contract-Category").value,
        contracttype: document.getElementById("Contract-Maintenance").value,
        timePeriod: document.getElementById("Contract-Time-Period").value,
        startDate: document.getElementById("Contract-Start-Date").value,
        contractname: document.getElementById("Contract-Description").value,
        location: document.getElementById("Contract-Location").value,
        assigned: "none",
        finished: false,
        accepted: false,
        reviewed: false,
      };

      writeToContract(newContract, "contracts", true);
      console.log("Contract added:", newContract);
      contractForm.reset();
    });
  } catch (error) {}

  try {
    // Auto-fill client details based on selected name
    contractClientNameInput.addEventListener("input", function () {
      const input = this.value.toLowerCase().trim();
      const inputParts = input.split(" ");

      let matchedClient;

      if (inputParts.length > 1) {
        const [inputName, inputSurname] = inputParts;

        matchedClient = OldClients.find(
          (client) => client.name.toLowerCase() === inputName && client.surname.toLowerCase() === inputSurname
        );
      } else {
        matchedClient = OldClients.find((client) => client.name.toLowerCase() === input);
      }

      if (matchedClient) {
        document.getElementById("Contract-Client-Surname").value = matchedClient.surname;
        document.getElementById("Contract-Client-Email").value = matchedClient.email;
        document.getElementById("Contract-Client-Phone").value = matchedClient.phone;
      } else {
        document.getElementById("Contract-Client-Surname").value = "";
        document.getElementById("Contract-Client-Email").value = "";
        document.getElementById("Contract-Client-Phone").value = "";
      }
    });
  } catch (error) {}

  //==================================================================================================================================================================================================================================================================================================================================
  //Contracts Completion
  try {
    const email = new URLSearchParams(window.location.search).get("email");

    if (!email) {
      //console.error("No email provided in the URL.");
      //return;
    } else {
      try {
        const response = await fetch("/getContracts");
        const data = await response.json();

        if (data.success) {
          // Filter contracts by client email and reviewed === false
          contractsCom = data.contractsCom.filter(
            (contract) => contract.clientEmail === email && contract.reviewed === false
          );

          console.log("Filtered contracts:", contractsCom);
          populateContractDropdown(contractsCom);
        } else {
          console.error("Failed to load contracts.");
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }

      const reviewForm = document.getElementById("reviewForm");

      reviewForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const selectedContractName = document.getElementById("contractId").value;
        const selectedContract = contractsCom.find((contract) => contract.contractname === selectedContractName);

        if (!selectedContract) {
          console.error("Selected contract not found.");
          return; // Ensure a contract is selected
        }

        const newReview = {
          contractName: selectedContractName,
          clientName: selectedContract.clientName,
          clientSurname: selectedContract.clientSurname,
          rating: document.getElementById("rating").value,
          description: document.getElementById("description").value,
          fileComplaint: document.getElementById("fileComplaint").checked,
        };

        // Submit the review and mark the contract as reviewed
        await writeToReview(newReview, selectedContract.contract_id, "reviews", false);
        reviewForm.reset();
      });

      const contractDropdown = document.getElementById("contractId");
      contractDropdown.addEventListener("change", (event) => {
        const selectedContractName = event.target.value;
        const selectedContract = contractsCom.find((contract) => contract.contractname === selectedContractName);

        if (selectedContract) {
          document.getElementById("clientName").value = selectedContract.clientName || "";
          document.getElementById("clientSurname").value = selectedContract.clientSurname || "";
        }
      });
    }
  } catch (error) {}

  //==================================================================================================================================================================================================================================================================================================================================
  //Login Form
  try {
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
  } catch (error) {}

  //==================================================================================================================================================================================================================================================================================================================================
  //Technicians Form
  try {
    const techForm = document.getElementById("techForm");
    techForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const newTech = {
        name: document.getElementById("Technician-Name").value,
        surname: document.getElementById("Technician-Surname").value,
        email: document.getElementById("Technician-email").value,
        phone: document.getElementById("Technician-Phone").value,
        speciality: document.getElementById("Technician-Speciality").value,
        workhours: document.getElementById("Technician-workHours").value,
        location: document.getElementById("Technician-Location").value,
        password: document.getElementById("Technician-password").value,
      };

      writeToTechnician(newTech, "technicianinfo", false);
      technicians.push(newTech);
      console.log("Client added:", newTech);
      techForm.reset();
    });
  } catch (error) {}

  //==================================================================================================================================================================================================================================================================================================================================
  //Technicians Mobile
  try {
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
  } catch (error) {}

  // Contract action handlers
  try {
    document.querySelectorAll(".accept-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const contractId = button.getAttribute("data-contract-id");
        updateContract(contractId, "accept");
      });
    });
  } catch (error) {}

  try {
    document.querySelectorAll(".cancel-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const contractId = button.getAttribute("data-contract-id");
        updateContract(contractId, "decline");
      });
    });
  } catch (error) {}

  try {
    document.querySelectorAll(".done-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const contractId = button.getAttribute("data-contract-id");
        updateContract(contractId, "done");
      });
    });
  } catch (error) {}

  //==================================================================================================================================================================================================================================================================================================================================
  //redirect and buttons
  try {
    document.getElementById("dashboard").addEventListener("click", function () {
      window.location.href = "/dashboard"; // Redirect to dashboard page
    });
  } catch (error) {}

  try {
    document.getElementById("contracts").addEventListener("click", function () {
      window.location.href = "/contract"; // Redirect to contract page
    });
  } catch (error) {}

  try {
    document.getElementById("technician").addEventListener("click", function () {
      window.location.href = "/technician"; // Redirect to technician page
    });
  } catch (error) {}

  try {
    document.getElementById("assignjob").addEventListener("click", function () {
      window.location.href = "/assign"; // Redirect to assign job page
    });
  } catch (error) {}

  try {
    document.getElementById("reporting").addEventListener("click", function () {
      window.location.href = "/reporting"; // Redirect to reporting page
    });
  } catch (error) {}

  try {
    document.getElementById("add-contract-button").addEventListener("click", function () {
      window.location.href = "/contract"; // Redirect to dashboard page
    });
  } catch (error) {}

  try {
    document.getElementById("login-button").addEventListener("click", function () {
      window.location.href = "/login"; // Redirect to dashboard page
    });
  } catch (error) {}

  //==============================================================================================================================================================================================================================================================================================================================
});

const loadOldClients = async () => {
  try {
    const response = await fetch("/getClients");
    const data = await response.json();

    if (data.success) {
      OldClients = data.clients;
      console.log("Old clients loaded:", OldClients);
    } else {
      console.error("Failed to load old clients.");
    }
  } catch (error) {
    console.error("Error fetching old clients:", error);
  }
};

//TODO
const writeToClient = (newdata, filename, contract) => {
  fetch("/writeToJSON", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newdata, filename, contract }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showToast('<i class="fa-regular fa-circle-check"></i>Successfully Added client');
      } else {
        showToast('<i class="fa-solid fa-circle-xmark"></i>Error adding client!!!');
      }
    })
    .catch((error) => console.error("Error:", error));
};

const writeToContract = (newdata, filename, contract) => {
  fetch("/writeToJSON", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newdata, filename, contract }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showToast('<i class="fa-regular fa-circle-check"></i>Successfully added contract');
      } else {
        showToast('<i class="fa-solid fa-circle-xmark"></i>Error adding contract!!!');
      }
    })
    .catch((error) => console.error("Error:", error));
};

const writeToTechnician = (newdata, filename, contract) => {
  fetch("/writeToJSON", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newdata, filename, contract }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        showToast('<i class="fa-regular fa-circle-check"></i>Successfully added technician');
      } else {
        showToast('<i class="fa-solid fa-circle-xmark"></i>Error adding technician!!!');
      }
    })
    .catch((error) => console.error("Error:", error));
};

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
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        authenticatedUsername = username; // Save the username globally

        // Redirect to the technician page with username in the query string
        const baseUrl = `${window.location.origin}/technicianmobile?username=${encodeURIComponent(
          authenticatedUsername
        )}`;
        console.log("Redirecting to:", baseUrl);
        window.location.href = baseUrl;
      } else {
        console.error("Login failed:", data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
}

const populateContractDropdown = (filteredContracts) => {
  const contractDropdown = document.getElementById("contractId");
  contractDropdown.innerHTML = ""; // Clear previous options

  // Add the placeholder option
  const placeholderOption = document.createElement("option");
  placeholderOption.value = "";
  placeholderOption.disabled = true;
  placeholderOption.selected = true;
  placeholderOption.textContent = "Select Contract";
  contractDropdown.appendChild(placeholderOption);

  if (filteredContracts.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No contracts found for this email";
    option.disabled = true;
    contractDropdown.appendChild(option);
    return;
  }

  filteredContracts.forEach((contract) => {
    const option = document.createElement("option");
    option.value = contract.contractname;
    option.textContent = contract.contractname;
    contractDropdown.appendChild(option);
  });
};

const writeToReview = async (newdata, contractId, filename, contract) => {
  try {
    const response = await fetch("/writeToJSON", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newdata, contractId, filename, contract }),
    });

    const data = await response.json();

    if (data.success) {
      await markContractReviewed(contractId);
      location.reload();
    } else {
      console.error("Error updating the review:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const markContractReviewed = async (contractId) => {
  try {
    const response = await fetch("/update-contract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractId, action: "markReviewed" }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Failed to mark contract as reviewed:", data.message);
    }
  } catch (error) {
    console.error("Error updating contract:", error);
  }
};

const GoogleAI = () => {
  fetch("/GoogleAI", {
    method: "POST",
  })
    .then((response) => response.text())
    .then((html) => {
      document.open();
      document.write(html);
      document.close();
    })
    .catch((error) => console.error("Error:", error));
};

function redirectToPage() {
  window.location.href = `${window.location.origin}/loadingscreen`;
}

function showToast(msg) {
  let toastBox = document.getElementById("toastbox");
  let toast = document.createElement("div");
  toast.classList.add("toast");
  toast.innerHTML = msg;
  toastBox.appendChild(toast);

  if (msg.includes("error")) {
    toast.classList.add("error");
  }

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Assuming this is part of your fetch call
const reloadPage = () => {
  fetch("/reloadPage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data written successfully:", data);
      // Refresh the page after successful data writing
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
