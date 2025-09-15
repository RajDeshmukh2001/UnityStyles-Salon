document.querySelector("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    document.getElementById("login-error").innerHTML = "";
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const admin = JSON.parse(localStorage.getItem("admin")) || [];
    const adminExists = admin.findIndex(admin => admin.username === username && admin.password === password);

    if (adminExists === -1) {
        document.getElementById("login-error").innerHTML = "Invalid Credentials";
    } else {
        admin[adminExists].isAuthenticated = true;
        localStorage.setItem("admin", JSON.stringify(admin));

        alert("Login Successfull!");
        location.href = "/pages/admin/adminPanel.html";
    }
});