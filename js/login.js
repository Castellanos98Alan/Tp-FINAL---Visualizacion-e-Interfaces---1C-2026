// Mostrar/Ocultar contraseña

const passwordInput = document.getElementById("password");
const btnMostrar = document.getElementById("mostrarPassword");

btnMostrar.addEventListener("click", function () {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        btnMostrar.textContent = "👁";
    } else {
        passwordInput.type = "password";
        btnMostrar.textContent = "👁";
    }

});

// Login

const formulario = document.getElementById("loginForm");

formulario.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

    if (!usuarioGuardado) {
        alert("No existe ningún usuario registrado.");
        return;
    }

    if (
        email === usuarioGuardado.email &&
        password === usuarioGuardado.password
    ) {

        alert("Inicio de sesión exitoso.");

        window.location.href = "index.html";

    } else {

        alert("Correo o contraseña incorrectos.");

    }

});
