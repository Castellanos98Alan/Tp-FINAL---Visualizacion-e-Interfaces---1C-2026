const formulario = document.getElementById("recuperarForm");

formulario.addEventListener("submit", function(e){

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    if(email === ""){
        alert("Ingrese un correo electrónico.");
        return;
    }

    alert("Si existe una cuenta asociada a ese correo, recibirás un enlace para restablecer tu contraseña.");

    window.location.href = "login.html";

});