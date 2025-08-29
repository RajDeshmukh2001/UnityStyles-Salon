function openRegister() {
    document.querySelector(".register-container").style.display = "flex";
    document.querySelector(".login-container").style.display = "none";
}

function openLogin() {
    document.querySelector(".login-container").style.display = "flex";
    document.querySelector(".register-container").style.display = "none";
}

// User Login
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    document.getElementById("login-error").innerHTML = "";
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.findIndex(user => user.email === email && user.password === password);

    if (user === -1) {
        document.getElementById("login-error").innerHTML = "Invalid Credentials";
    } else {
        users[user].isAuthenticated = true;
        localStorage.setItem("users", JSON.stringify(users));

        alert("Login Successfull!");
        location.href = "/salon.html";
    }
})

// User Registration
document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();

    document.getElementById("fullname-error").innerHTML = "";
    document.getElementById("register-email-error").innerHTML = "";
    document.getElementById("register-password-error").innerHTML = "";

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some(user => user.email === email);

    if (fullname.length <= 2) {
        document.getElementById("fullname-error").innerHTML = "Invalid Name. Enter your fullname";
    } else if (userExists) {
        document.getElementById("register-email-error").innerHTML = "User already exists with this email.";
    } else if (!emailRegex.test(email)) {
        document.getElementById("register-email-error").innerHTML = "Invalid Email";
    } else if (password.length < 6) {
        document.getElementById("register-password-error").innerHTML = "Password must be at least 6 characters long.";
    } else if (!/[a-z]/.test(password) || !/[0-9]/.test(password)) {
        document.getElementById("register-password-error").innerHTML = "Password must include at least one letter and one number.";
    } else {
        users.push({ fullname, email, password, isAuthenticated: true });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration Successful!");
        location.href = "/salon.html";
    }
});

document.getElementById("register-password").addEventListener("input", (e) => {
    const value = e.target.value;
    if (value.length >= 6 && /[a-z]/.test(value) && /[0-9]/.test(value)) {
        document.getElementById("register-password-error").innerHTML = "";
    }
});

document.getElementById("fullname").addEventListener("input", (e) => {
    if (e.target.value.length > 2) {
        document.getElementById("fullname-error").innerHTML = "";
    }
});