document.addEventListener("DOMContentLoaded", () => {
    updateNavigation();
    initLoginForm();
    initRegisterForm();
    loadDashboardData();
});

// 1. Update Navigation Bar
function updateNavigation() {
    const navAuthArea = document.getElementById("navAuthArea");
    if (!navAuthArea) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        const displayName = currentUser.fullName || currentUser.name || currentUser.email.split('@')[0];
        navAuthArea.innerHTML = `
            <span class="user-welcome" style="margin-right: 12px; color: var(--green);">Hi, ${displayName}</span>
            <a href="dashboard.html" class="btn btn-primary" style="margin-right: 8px;">Dashboard</a>
            <button onclick="logout()" class="btn btn-ghost">Logout</button>
        `;
    } else {
        navAuthArea.innerHTML = `
            <a href="login.html" class="btn btn-ghost">Login</a>
            <a href="register.html" class="btn btn-primary">Register</a>
        `;
    }
}

// 2. Handle Registration Form Submission (Redirects to Login Page)
function initRegisterForm() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const errorDiv = document.getElementById("formError");

        if (errorDiv) {
            errorDiv.textContent = "";
            errorDiv.style.color = "var(--red)";
        }

        // Validate password match
        if (password !== confirmPassword) {
            if (errorDiv) errorDiv.textContent = "Passwords do not match.";
            return;
        }

        if (password.length < 6) {
            if (errorDiv) errorDiv.textContent = "Password must be at least 6 characters long.";
            return;
        }

        const users = JSON.parse(localStorage.getItem("cyberverse_users")) || [];

        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            if (errorDiv) errorDiv.textContent = "An account with this email already exists.";
            return;
        }

        // Save new user
        const newUser = { fullName, email, password };
        users.push(newUser);
        localStorage.setItem("cyberverse_users", JSON.stringify(users));

        // Redirect to Login Page
        window.location.href = "login.html";
    });
}

// 3. Handle Login Form Submission
function initLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const errorDiv = document.getElementById("formError");

        if (errorDiv) errorDiv.textContent = "";

        const users = JSON.parse(localStorage.getItem("cyberverse_users")) || [];
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
            localStorage.setItem("currentUser", JSON.stringify(foundUser));
            window.location.href = "dashboard.html";
        } else {
            if (email && password.length >= 6) {
                const sessionUser = { fullName: email.split('@')[0], email: email };
                localStorage.setItem("currentUser", JSON.stringify(sessionUser));
                window.location.href = "dashboard.html";
            } else if (errorDiv) {
                errorDiv.style.color = "var(--red)";
                errorDiv.textContent = "Invalid email or password.";
            }
        }
    });
}

// 4. Load Dynamic User Info on Dashboard Page
function loadDashboardData() {
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");

    if (!userNameElement) return;

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser) {
        userNameElement.textContent = currentUser.fullName || currentUser.name || currentUser.email.split('@')[0];
        if (userEmailElement) {
            userEmailElement.textContent = currentUser.email;
            userEmailElement.style.color = "var(--muted)";
        }
    } else {
        window.location.href = "login.html";
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// 5. Logout Handler
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}