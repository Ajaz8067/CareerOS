/* =================================================
CareerOS Authentication JavaScript
Register + Login
================================================= */

/* =================================================
REGISTER
================================================= */

console.log("auth.js loaded successfully");

const registerForm = document.getElementById("registerForm");

if (registerForm) {


    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Get values
        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // Get error elements
        const nameError =
            document.getElementById("nameError");

        const emailError =
            document.getElementById("emailError");

        const passwordError =
            document.getElementById("passwordError");

        const confirmPasswordError =
            document.getElementById("confirmPasswordError");

        const successMessage =
            document.getElementById("successMessage");


        // Clear old messages
        nameError.textContent = "";
        emailError.textContent = "";
        passwordError.textContent = "";
        confirmPasswordError.textContent = "";
        successMessage.textContent = "";


        // Basic validation

        if (name === "") {
            nameError.textContent =
                "Please enter your name.";
            return;
        }


        if (email === "") {
            emailError.textContent =
                "Please enter your email.";
            return;
        }


        if (password === "") {
            passwordError.textContent =
                "Please enter a password.";
            return;
        }


        if (password.length < 6) {
            passwordError.textContent =
                "Password must be at least 6 characters.";
            return;
        }


        if (confirmPassword === "") {
            confirmPasswordError.textContent =
                "Please confirm your password.";
            return;
        }


        if (password !== confirmPassword) {
            confirmPasswordError.textContent =
                "Passwords do not match.";
            return;
        }


        // Send data to Spring Boot

        try {

            const response = await fetch(

                "https://careeros-backend-4si3.onrender.com/api/users/register",
                
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            if (!response.ok) {
                throw new Error("Registration failed.");
            }


            const data = await response.json();

            console.log(
                "Registration successful:",
                data
            );


            successMessage.textContent =
                "Account created successfully!";


            registerForm.reset();


        } catch (error) {

            console.error(error);

            successMessage.textContent =
                "Something went wrong. Please try again.";
        }

    });


}

/* =================================================
LOGIN
================================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {


    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();
        console.log("LOGIN FORM SUBMITTED");


        // Get login values

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        // Message element

        const message =
            document.getElementById("message");


        // Clear old message

        message.textContent = "";


        // Basic validation

        if (email === "") {

            message.textContent =
                "Please enter your email.";

            return;
        }


        if (password === "") {

            message.textContent =
                "Please enter your password.";

            return;
        }


        // Send login data to Spring Boot

        try {
            console.log("Sending login request...");

            const response = await fetch(
            "https://careeros-backend-4si3.onrender.com/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );
            console.log("Response status:", response.status);


            if (!response.ok) {


                message.textContent =
                    "Invalid email or password.";

                return;


            }

            const responseText = await response.text();

            console.log("Login response body:", responseText);

            if (!responseText.trim()) {
                throw new Error("Login API returned an empty response.");
            }


            const data = JSON.parse(responseText);
            console.log("LOGIN DATA:", data);
            console.log("USER ID:", data.id);

            console.log("Login response data:", data);
            console.log("Actual user ID:", data.id);

            // Save login information
            localStorage.setItem("loggedIn", "true");
            localStorage.setItem("userId", data.id);
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userEmail", data.email);

            console.log("Login successful:", data);


            message.textContent = "Login successful!";
            setTimeout(function () {


                window.location.href = "index.html";


            }, 1000);



        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to server.";
        }

    });


}


/* =================================================
NAVBAR LOGIN STATE
================================================= */

const loginNav = document.getElementById("loginNav");
const registerNav = document.getElementById("registerNav");
const userNav = document.getElementById("userNav");
const logoutBtn = document.getElementById("logoutBtn");

const loggedIn = localStorage.getItem("loggedIn");

const userName = localStorage.getItem("userName");

if (loggedIn === "true") {


    if (loginNav) {
        loginNav.style.display = "none";
    }

    if (registerNav) {
        registerNav.style.display = "none";
    }

    if (userNav) {
        userNav.style.display = "inline-block";
        userNav.textContent = "Welcome, " + userName + " ðŸ‘‹";
    }

    if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
    }


}

/* =================================================
LOGOUT
================================================= */

if (logoutBtn) {


    logoutBtn.addEventListener("click", function (event) {

        event.preventDefault();

        localStorage.removeItem("loggedIn");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        window.location.href = "index.html";
    });


}
