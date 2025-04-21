// Global Variables
let apiBaseUrl = 'https://your-api-url.com'; // Update with actual base URL
let loggedInUserId = null;
let loggedInUsername = null;

// Utility Function: Display a specific section
function displaySection(sectionId) {
    document.querySelectorAll('.auth-section').forEach(section => {
        section.classList.add('hidden');
    });
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.classList.remove('hidden');
    } else {
        console.error(`Section "${sectionId}" does not exist.`);
    }
}

// Utility Function: Display response messages
function displayResponse(responseText, isSuccess = false) {
    const responseOutput = document.getElementById('responseOutput');
    if (responseOutput) {
        responseOutput.innerText = responseText;
        responseOutput.classList.remove('hidden', 'success', 'error');
        responseOutput.classList.add(isSuccess ? 'success' : 'error');
        setTimeout(() => {
            responseOutput.classList.add('hidden');
        }, 3000);
    } else {
        console.error('Response output element not found.');
    }
}

// Function: Handle Registration
function register(event) {
    event.preventDefault();

    const userName = document.getElementById('registerName')?.value.trim();
    const email = document.getElementById('registerEmail')?.value.trim();
    const password = document.getElementById('registerPassword')?.value.trim();

    if (!userName || !email || !password) {
        displayResponse('All fields are required.');
        return;
    }

    const payload = { userName, email, password };

    fetch(`${apiBaseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.text())
    .then(data => {
        const responseMessage = document.getElementById('responseMessage');
        if (responseMessage) {
            responseMessage.innerText = data;
            responseMessage.classList.add('highlight');

            if (data.toLowerCase().includes('success')) {
                const loginLink = document.createElement('a');
                loginLink.href = '/login.html';
                loginLink.innerText = "Click here to login";

                responseMessage.appendChild(document.createElement('br'));
                responseMessage.appendChild(loginLink);

                const registrationForm = document.getElementById('registrationForm');
                registrationForm?.reset();
            }
        }
    })
    .catch(error => {
        const responseMessage = document.getElementById('responseMessage');
        if (responseMessage) {
            responseMessage.innerText = "Error: " + error.message;
            responseMessage.classList.add('error');
        }
        console.error('Registration Error:', error);
    });
}

// Function: Handle Login
function login(event) {
    event.preventDefault();

    const userName = document.getElementById('loginUsername')?.value.trim();
    const password = document.getElementById('loginPassword')?.value.trim();

    if (!userName || !password) {
        displayResponse('Username and password are required.');
        return;
    }

    const payload = { userName, password };

    fetch(`${apiBaseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data?.success) {
            loggedInUsername = userName;
            loggedInUserId = data?.userId;

            if (loggedInUserId) {
                localStorage.setItem('healthUserId', loggedInUserId);
                displayResponse('Login successful!', true);

                setTimeout(() => {
                    displaySection('dashboardSection');
                    addSummaryLink();
                }, 1000);
            } else {
                console.error('Missing userId in login response.');
            }
        } else {
            displayResponse(data?.message || 'Login failed.');
        }
    })
    .catch(error => {
        console.error('Login Error:', error);
        displayResponse('An error occurred during login.');
    });
}

// Function: Add Summary Link
function addSummaryLink() {
    const dashboardCard = document.querySelector('.dashboard-card');
    if (!document.querySelector('.summary-link') && dashboardCard && loggedInUserId) {
        const summaryLink = document.createElement('a');
        summaryLink.href = `summary.html?userId=${loggedInUserId}`;
        summaryLink.className = 'btn btn-primary summary-link';
        summaryLink.textContent = 'View Health Summary';
        summaryLink.style.marginTop = '1.5rem';
        dashboardCard.appendChild(summaryLink);
    }
}

// DOMContentLoaded Init
document.addEventListener('DOMContentLoaded', () => {
    const storedUserId = localStorage.getItem('healthUserId');
    if (storedUserId) {
        loggedInUserId = storedUserId;
        displaySection('dashboardSection');
        addSummaryLink();
    } else {
        displaySection('loginSection'); // Ensure the ID matches HTML
    }

    // Attach form listeners (assuming these forms exist)
    document.getElementById('registrationForm')?.addEventListener('submit', register);
    document.getElementById('loginForm')?.addEventListener('submit', login);
});
