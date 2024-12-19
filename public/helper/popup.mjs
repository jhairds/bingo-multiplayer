// Alert function for custom alerts
const alertCloseBtn = document.querySelector("[name='close-outline']"); // Close button for the alert popup
const alertElem = document.querySelector(".alert"); // Alert popup element
const alertElemBody = document.querySelector(".alert-body"); // Body of the alert popup to display messages
const alertWrapper = document.querySelector(".alert-wrapper");

// Function to display a custom popup message
export const popup = (name, msg) => {
    alertElem.style.display = "block"; // Show the alert popup
    alertWrapper.style.display = "block";
    alertElemBody.textContent = name ? `${name} ${msg}` : `${msg}`; // Set the custom message
    alertCloseBtn.addEventListener("click", () => {
        alertElem.style.display = "none"; // Hide the alert when the close button is clicked
        alertWrapper.style.display = "none";
    });
};
