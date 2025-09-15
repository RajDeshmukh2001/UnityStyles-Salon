(function isLoggedIn() {
    const admin = JSON.parse(localStorage.getItem("admin")) || [];
    const isAdminAuthenticated = admin.find(admin => admin.isAuthenticated);

    if (!isAdminAuthenticated) {
        location.href = "/pages/admin/adminLogin.html";
    } else {
        document.querySelector(".admin").innerHTML = `<i class="ri-user-fill"></i>${isAdminAuthenticated?.username}`;
    }
})();

function logout() {
    const admin = JSON.parse(localStorage.getItem("admin")) || [];
    const isAdminAuthenticated = admin.find(admin => admin.isAuthenticated);

    if (isAdminAuthenticated) {
        isAdminAuthenticated.isAuthenticated = false;
        localStorage.setItem("admin", JSON.stringify(admin));

        alert("Logout Successfull!");
        location.href = "/pages/admin/adminLogin.html";
    }
}