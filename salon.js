document.addEventListener('DOMContentLoaded', function () {
    const genders = document.querySelectorAll(".gender");
    const menServices = document.getElementById("men-services");
    const womenServices = document.getElementById("women-services");

    // Select Gender
    genders.forEach(gender => {
        gender.addEventListener("click", function () {
            genders.forEach(g => {
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

    // Set minimum date
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    if (now.getHours() >= 20) {
        now.setDate(now.getDate() + 1);
    }
    const minDate = now.toISOString().split("T")[0];
    document.getElementById("date").setAttribute("min", minDate);

    // Service Selection
    const serviceButtons = document.querySelectorAll(".select-service");
    const serviceInput = document.getElementById("service");
    const servicePriceInput = document.getElementById("service-price");
    let finalPrice;

    serviceButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const selectedService = this.getAttribute("data-service");
            const selectedServicePrice = this.getAttribute("data-price");
            const genderInput = this.getAttribute("data-gender");
            finalPrice = Number(selectedServicePrice) + (Number(selectedServicePrice) * 0.05);

            serviceInput.value = selectedService;
            servicePriceInput.value = `₹${Math.trunc(finalPrice)}`;

            const menStaff = document.getElementById("men-staff");
            const womenStaff = document.getElementById("women-staff");

            if (genderInput === "men") {
                menStaff.classList.add("staff-selected");
                menStaff.classList.remove("disabled");
                womenStaff.classList.add("disabled");
                womenStaff.classList.remove("staff-selected");
                document.getElementById("staff-selection-men").style.display = "grid";
                document.getElementById("staff-selection-women").style.display = "none";
            } else {
                womenStaff.classList.add("staff-selected");
                womenStaff.classList.remove("disabled");
                menStaff.classList.remove("staff-selected");
                menStaff.classList.add("disabled");
                document.getElementById("staff-selection-men").style.display = "none";
                document.getElementById("staff-selection-women").style.display = "grid";
            }

            document.getElementById("booking").scrollIntoView({
                behavior: "smooth"
            });
        })
    })

    // Date Selection
    const dateInput = document.getElementById("date");
    dateInput.addEventListener("change", function () {
        generateTimeSlots();
    })

    // Add Time Slots
    const timeSlotsContainer = document.getElementById("time-slots");
    timeSlotsContainer.innerHTML = `<p class="select-date">Select date to see available slots.</p>`;
    function generateTimeSlots() {
        timeSlotsContainer.innerHTML = "";
        timeSlotsContainer.style.marginTop = "1rem";
        const selectedDate = dateInput.value;
        const currentDate = new Date().toISOString().split("T")[0];
        const currentTime = new Date().getHours();

        for (let hour = 10; hour <= 20; hour++) {
            if (hour === 14 || hour === 15) continue;

            const time = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;

            const timeSlot = document.createElement("div");
            timeSlot.classList.add("time-slot");
            timeSlot.textContent = time;
            timeSlot.setAttribute("data-time", time);

            if (hour <= currentTime && selectedDate === currentDate) {
                timeSlot.classList.add("unavailable");
            }

            timeSlot.addEventListener("click", function () {
                document.querySelectorAll(".time-slot").forEach((slot) => {
                    if (!slot.classList.contains("unavailable")) {
                        slot.classList.remove("selected");
                    }
                });

                this.classList.add("selected");
            })

            timeSlotsContainer.appendChild(timeSlot);
        }
    }

    // Staff Selection
    const staffGenderSelection = document.querySelectorAll(".staff-gender");
    staffGenderSelection.forEach((gender) => {
        gender.addEventListener("click", function () {
            staffGenderSelection.forEach((g) => g.classList.remove("staff-selected"));
            this.classList.add("staff-selected");

            if (this.getAttribute("data-gender") === "men") {
                document.getElementById("staff-selection-men").style.display = "grid";
                document.getElementById("staff-selection-women").style.display = "none";
            } else {
                document.getElementById("staff-selection-men").style.display = "none";
                document.getElementById("staff-selection-women").style.display = "grid";
            }
        })
    })
    const staffMembers = document.querySelectorAll(".staff-member");
    let selectedStaff;
    staffMembers.forEach((member) => {
        member.addEventListener("click", function () {
            staffMembers.forEach((m) => m.classList.remove("selected"));

            this.classList.add("selected");
            selectedStaff = this.getAttribute("data-staff")
        })
    })

    // Set Name and Email if User is Authenticated
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((user) => user.isAuthenticated);
    const nameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");

    if (user) {
        nameInput.value = user.fullname;
        emailInput.value = user.email;
    }

    // Form submission
    const bookingForm = document.getElementById("booking-form");
    const confirmation = document.getElementById("confirmation");
    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const selectedService = serviceInput.value;
        const selectedDate = dateInput.value;
        const selectedTime = document.querySelector(".time-slot.selected");
        // const selectedStaff = document.querySelector(".staff-member.selected");
        const fullname = document.getElementById("fullname").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const speacialRequest = document.getElementById("notes").value;

        if (!user) {
            alert("Please login to book an appointment");
            return;
        }

        if (!selectedService) {
            alert("Please select a service first");
            return;
        }

        if (!selectedDate) {
            alert("Please select a date");
            return;
        }

        if (!selectedTime) {
            alert("Please select a time slot");
            return;
        }

        if (!selectedStaff) {
            alert("Please select a stylist");
            return;
        }

        if (!fullname || !email || !phone) {
            alert("Please fill in all required fields");
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            alert("Invalid Phone Number");
            return;
        }

        const appointment = {
            date: selectedDate,
            service: selectedService,
            totalAmount: finalPrice,
            slot: selectedTime.textContent,
            staff: selectedStaff,
            fullname,
            email,
            phone,
            speacialRequest
        }

        const userIndex = users.findIndex((user) => user.isAuthenticated);
        if (userIndex !== -1) {
            if (!users[userIndex].appointments) {
                users[userIndex].appointments = [];
            }

            users[userIndex].appointments.push(appointment);
            localStorage.setItem("users", JSON.stringify(users));

            alert("Appointment booked successfully!");
            location.href = "/pages/userProfile/userProfile.html";
        }

        bookingForm.reset();
        document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
        timeSlotsContainer.innerHTML = "";
    });

    // Stylists Swiper slider

    const swiper = new Swiper('.slider-wrapper', {
        loop: true,
        autoHeight: true,
        crossFade: true,

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        breakpoints: {
            0: {
                slidesPerView: 1
            },
            620: {
                slidesPerView: 3
            },
            1024: {
                slidesPerView: 4
            }
        }
    });
});

// Toggle Login and Profile
function isUserAuthenticated() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users?.find((user) => user.isAuthenticated);

    if (user?.isAuthenticated) {
        const userDropdown = document.createElement("li");
        userDropdown.classList.add("user-container");

        userDropdown.innerHTML = `
        <i class="ri-user-fill user" onclick="openUserDropdown()"></i>
        <ul class="user-dropdown">
            <li><a href="/pages/userProfile/userProfile.html">Profile</a></li>
            <li><span onclick="logout('${user.email}')">Logout</span></li>
        </ul>
    `;

        document.querySelector(".nav-links").appendChild(userDropdown);
    } else {
        const login = document.createElement("li");
        login.innerHTML = `<a href="/pages/login/login.html" class="active">Login</a>`;
        document.querySelector(".nav-links").appendChild(login);

        if (document.querySelector(".user-container")) {
            document.querySelector(".nav-links").removeChild(document.querySelector(".user-container"));
        }
    }
}
isUserAuthenticated();

// Logout 
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
    openUserDropdown();
    location.href = "/salon.html";
}

// Open Profile dropdown
function openUserDropdown() {
    const userDropdown = document.querySelector(".user-dropdown");
    if (userDropdown.classList.contains("active")) {
        userDropdown.classList.remove("active");
    } else {
        userDropdown.classList.add("active");
    }
}