// Check user authentication
(function isUserLoggedIn() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const isUserAuthenticated = users.find(user => user.isAuthenticated);

    if (!isUserAuthenticated) {
        location.href = "/salon.html";
    } else {
        document.querySelector(".user-profile").innerHTML = `<i class="ri-user-fill"></i>${isUserAuthenticated?.fullname}`;
    }
})();

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
    location.href = "/salon.html";
}

document.addEventListener("DOMContentLoaded", function () {
    let selectedStatus = "Upcoming";

    const statuses = document.querySelectorAll(".status");
    statuses.forEach((status) => {
        status.addEventListener("click", function () {
            statuses.forEach((status) => status.classList.remove("selected"));

            this.classList.add("selected");
            selectedStatus = this.textContent;
            renderAppointments();
        })
    });

    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
    };
    function formattedDate(date) {
        return new Date(date).toLocaleString("en-GB", options);
    }

    // Can Cancel Appointment before 3 hours
    const canCancelAppointment = (date, slot) => {
        const dateAndSlot = new Date(`${date} ${slot}`);
        const currentDate = new Date();

        const milliSecRemaining = dateAndSlot - currentDate;
        const hoursRemaining = Math.floor(milliSecRemaining / (1000 * 60 * 60));
        return hoursRemaining;
    }

    // Cancel Appointment
    window.cancelAppointment = function(userEmail, appointmentId) {
        if (!confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        users = users?.map((user) => {
            if (user.email === userEmail && user.appointments.length > 0) {
                user.appointments = user.appointments.map((appointment) => {
                    if (appointment.id === appointmentId) {
                        return {
                            ...appointment,
                            status: "cancelled",
                            updatedAt: new Date().toISOString(),
                        }
                    }
                    return appointment;
                })
            }
            return user;
        })
        localStorage.setItem("users", JSON.stringify(users));
        renderAppointments();
    }

    function renderAppointments() {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const authenticatedUser = users.find(user => user.isAuthenticated);
        const appointmentsContainer = document.getElementById("appointments");
        appointmentsContainer.innerHTML = "";

        const appointments = authenticatedUser?.appointments.sort((a, b) =>
            new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        if (appointments?.length > 0) {
            appointments?.forEach((appoint) => {
                const bookedOn = formattedDate(appoint.createdAt);
                const updatedOn = formattedDate(appoint.updatedAt);
                const appointmentDate = formattedDate(appoint.appointmentDate);

                if (appoint.status === "booked" && selectedStatus === "Upcoming") {
                    const appointment = document.createElement("div");
                    appointment.classList.add("appointment");
                    const remainingTimeToCancel = canCancelAppointment(appoint.appointmentDate, appoint.slot);

                    appointment.innerHTML = `
                        <div class="id-date">
                            <h5><span>ID:</span> ${appoint.id}</h5>
                            <div class="booking-date">
                                <h5>Booked On:<span> ${bookedOn}</span></h5>
                                ${remainingTimeToCancel !== null && remainingTimeToCancel > 2 
                                    ? `<button class="cancel-btn" onclick="cancelAppointment('${authenticatedUser?.email}', '${appoint.id}')">Cancel</button>` 
                                    : ""}
                            </div>
                        </div>
    
                        <div class="appointment-details">
                            <h3>${appoint.service} - ₹${appoint.totalAmount}</h3>
                            <h5>Appointment Date & Time:<span> ${appointmentDate.split(",")[0]} ${appoint.slot}</span></h5>
                            <h5>Staff:<span> ${appoint.staff}</span></h5>
                            <h5>Contact:<span> ${appoint.fullname} | ${appoint.phone} | ${appoint.email}</span></h5>
                        </div>
                    `;

                    appointmentsContainer.append(appointment);
                } else if (appoint.status === "completed" && selectedStatus === "Completed") {
                    const appointment = document.createElement("div");
                    appointment.classList.add("appointment");

                    appointment.innerHTML = `
                        <div class="id-date">
                            <h5><span>ID:</span> ${appoint.id}</h5>
                            <div class="booking-date">
                                <h5>Booked On:<span> ${bookedOn}</span></h5>
                                <h5>Updated On:<span> ${updatedOn}</span></h5>
                            </div>
                        </div>
    
                        <div class="appointment-details">
                            <h3>${appoint.service} - ₹${appoint.totalAmount}</h3>
                            <h5>Appointment Date & Time:<span> ${appointmentDate.split(",")[0]} ${appoint.slot}</span></h5>
                            <h5>Staff:<span> ${appoint.staff}</span></h5>
                            <h5>Contact:<span> ${appoint.fullname} | ${appoint.phone} | ${appoint.email}</span></h5>
                        </div>
                    `;

                    appointmentsContainer.append(appointment);
                } else if (appoint.status === "cancelled" && selectedStatus === "Cancelled") {
                    const appointment = document.createElement("div");
                    appointment.classList.add("appointment");

                    appointment.innerHTML = `
                        <div class="id-date">
                            <h5><span>ID:</span> ${appoint.id}</h5>
                            <div class="booking-date">
                                <h5>Booked On:<span> ${bookedOn}</span></h5>
                                <h5 class="cancelled-on">Cancelled On:<span> ${updatedOn}</span></h5>
                            </div>
                        </div>
    
                        <div class="appointment-details">
                            <h3>${appoint.service} - ₹${appoint.totalAmount}</h3>
                            <h5>Appointment Date & Time:<span> ${appointmentDate.split(",")[0]} ${appoint.slot}</span></h5>
                            <h5>Staff:<span> ${appoint.staff}</span></h5>
                            <h5>Contact:<span> ${appoint.fullname} | ${appoint.phone} | ${appoint.email}</span></h5>
                        </div>
                    `;

                    appointmentsContainer.append(appointment);
                }
            })
        } else {
            appointmentsContainer.innerHTML = `<p>No appointments found</p>`;
        }
    }
    renderAppointments();
});
