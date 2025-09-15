// Logout 
function logout() {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map(user => {
        if (user.isAuthenticated) {
            return { ...user, isAuthenticated: false };
        }
        return user;
    });

    localStorage.setItem("users", JSON.stringify(users));
    isUserAuthenticated();
    location.href = "/salon.html";
}