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

document.addEventListener("DOMContentLoaded", function () {
    // Toggle Nav Links
    document.querySelectorAll(".links").forEach((link) => {
        link.addEventListener("click", function() {
            if (this.dataset.link === "appointments") {
                document.getElementById("all-appointments").style.display = "block";
                document.getElementById("all-users").style.display = "none";
            } else if (this.dataset.link === "users") {
                document.getElementById("all-users").style.display = "block";
                document.getElementById("all-appointments").style.display = "none";

            }
        })
    })

    // All Appointments
    let selectedStatus = "Pending";
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

    // Complete Appointment
    window.completeAppointment = function(appointmentId) {
        if (!confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        users = users?.map((user) => {
            if (user.appointments) {
                user.appointments = user.appointments.map((appointment) => {
                    if (appointment.id === appointmentId) {
                        return {
                            ...appointment,
                            status: "completed",
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
        const allAppointments = [];
        users.forEach((user) => {
            if (user.appointments) {
                user.appointments.forEach((appointment) => {
                    allAppointments.push(appointment);
                })
            }
        });
        allAppointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const appointmentsContainer = document.getElementById("appointments");
        appointmentsContainer.innerHTML = "";

        if (allAppointments?.length > 0) {
            allAppointments?.forEach((appoint) => {
                const bookedOn = formattedDate(appoint.createdAt);
                const updatedOn = formattedDate(appoint.updatedAt);
                const appointmentDate = formattedDate(appoint.appointmentDate);

                if (appoint.status === "booked" && selectedStatus === "Pending") {
                    const appointment = document.createElement("div");
                    appointment.classList.add("appointment");

                    appointment.innerHTML = `
                        <div class="id-date">
                            <h5><span>ID:</span> ${appoint.id}</h5>
                            <div class="booking-date">
                                <h5>Booked On:<span> ${bookedOn}</span></h5>
                                <button class="complete-btn" onclick="completeAppointment('${appoint.id}')">Complete</button>
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

    // All Users
    function renderUsers() {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const tableBody = document.getElementById("table-body");
        users?.forEach((user) => {
            const tableRow = document.createElement("tr");

            const pending = user.appointments.filter((appointment) => appointment.status === "booked");
            const completed = user.appointments.filter((appointment) => appointment.status === "completed");
            const cancelled = user.appointments.filter((appointment) => appointment.status === "cancelled");

            tableRow.innerHTML = `
                <td>${user.fullname}</td>
                <td>${user.email}</td>
                <td>${user.appointments.length}</td>
                <td>${pending.length}</td>
                <td>${completed.length}</td>
                <td>${cancelled.length}</td>
            `;

            tableBody.append(tableRow);
        });

    }
    renderUsers();
});