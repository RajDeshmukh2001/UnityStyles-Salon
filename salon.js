const gender = document.querySelectorAll(".gender");
const menServices = document.getElementById("men-services");
const womenServices = document.getElementById("women-services");

gender.forEach(gen => {
    gen.addEventListener("click", function () {
        gender.forEach(g => {
            g.classList.remove("selected");
            g.classList.add("inactive");
        });

        this.classList.add("selected");
        this.classList.remove("inactive");

        const getGender = this.getAttribute("data-gender");
        if (getGender === "men") {
            menServices.style.display = "grid";
            womenServices.style.display = "none";

            document.getElementById("services").scrollIntoView({ behavior: "smooth" });
        } else {
            womenServices.style.display = "grid";
            menServices.style.display = "none";

            document.getElementById("services").scrollIntoView({ behavior: "smooth" });
        }
    })
});

function isUserAuthenticated() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users?.find((user) => user.isAuthenticated);

    const auth = document.getElementById("auth");
    if (user?.isAuthenticated) {
        auth.innerHTML = `<span onclick="logout('${user.email}')">Logout</span>`;
    } else {
        auth.innerHTML = `<a href="/pages/login/login.html" class="active">Login</a>`;
    }
}
isUserAuthenticated();

function logout(email) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users = users.map(user => {
        if (user.email === email) {
            return { ...user, isAuthenticated: false };
        }
        return user;
    });

    localStorage.setItem("users", JSON.stringify(users));
    isUserAuthenticated();
}