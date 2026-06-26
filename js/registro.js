const formulario = document.getElementById("registroForm");

formulario.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmarPassword = document.getElementById("confirmarPassword").value;

    // Validaciones
    if (password.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    if (!/[A-Z]/.test(password)) {
        alert("La contraseña debe contener al menos una letra mayúscula.");
        return;
    }

    if (!/[0-9]/.test(password)) {
        alert("La contraseña debe contener al menos un número.");
        return;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        alert("La contraseña debe contener al menos un carácter especial.");
        return;
    }

    if (password !== confirmarPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    // Guardar usuario
    const usuario = {
        email: email,
        password: password
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));

    alert("Usuario registrado correctamente.");

    window.location.href = "login.html";

});