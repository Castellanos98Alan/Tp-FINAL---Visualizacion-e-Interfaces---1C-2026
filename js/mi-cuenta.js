document.addEventListener("DOMContentLoaded", () => {
  const accountTriggers = [...document.querySelectorAll(".login-button, .btn-account")];

  if (!accountTriggers.length) return;

  const sessionActive = localStorage.getItem("sesionIniciada") === "true";

  accountTriggers.forEach((trigger) => {
    trigger.textContent = sessionActive ? "Mi cuenta" : "Ingresar";

    if (trigger.tagName === "A") {
      trigger.href = sessionActive ? "#" : "/html/login.html";
    }

    if (!sessionActive && trigger.tagName === "BUTTON") {
      trigger.addEventListener("click", () => {
        window.location.href = "/html/login.html";
      });
    }
  });

  if (!sessionActive) return;

  document.body.insertAdjacentHTML("beforeend", `
    <div class="account-modal" id="accountModal" aria-hidden="true">
      <div class="account-modal__backdrop" data-account-close></div>
      <section class="account-card" role="dialog" aria-modal="true" aria-labelledby="accountTitle">
        <button class="account-card__close" type="button" aria-label="Cerrar Mi cuenta" data-account-close>
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <header class="account-card__header">
          <h2 id="accountTitle">Mi cuenta</h2>
          <p>Consultá y gestioná tu información personal.</p>
        </header>
        <div class="account-profile">
          <div class="account-profile__avatar" id="accountInitials">JM</div>
          <strong id="accountName">Julieta Miño</strong>
        </div>
        <div class="account-data" id="accountData">
          <div class="account-row" data-field="email">
            <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
            <span>Correo electrónico</span><strong id="accountEmail"></strong>
            <svg class="account-row__chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </div>
          <div class="account-row" data-field="phone">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"/></svg>
            <span>Teléfono</span><strong id="accountPhone"></strong>
            <svg class="account-row__chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </div>
          <div class="account-row" data-field="locality">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            <span>Localidad</span><strong id="accountLocality"></strong>
            <svg class="account-row__chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </div>
          <div class="account-row account-row--password" data-field="password">
            <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
            <span>Contraseña</span><strong>•••••••••</strong>
            <svg class="account-row__chevron" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
          </div>
        </div>
        <p class="account-form-error" id="accountFormError" role="alert" hidden></p>
        <div class="account-actions">
          <button class="account-button account-button--primary" type="button" id="editAccount">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg><span>Editar datos</span>
          </button>
          <button class="account-button account-button--logout" type="button" id="logoutAccount">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>Cerrar sesión
          </button>
        </div>
        <a class="account-claims" href="/html/mis-reclamos.html">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>
          Mis reclamos
          <svg class="account-claims__arrow" aria-hidden="true" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
        </a>
      </section>
    </div>
  `);

  const modal = document.getElementById("accountModal");
  const accountData = document.getElementById("accountData");
  const editButton = document.getElementById("editAccount");
  const formError = document.getElementById("accountFormError");
  const defaults = {
    name: "Julieta Miño",
    email: "julieta.mino@gmail.com",
    phone: "(11) 1234-5678",
    locality: "Morón, Buenos Aires"
  };
  let lastFocusedElement = null;
  let editing = false;

  function getAccount() {
    try {
      const user = JSON.parse(localStorage.getItem("usuario")) || {};
      const profile = JSON.parse(localStorage.getItem("perfilUsuario")) || {};
      const registeredName = user.name || [user.nombre, user.apellido].filter(Boolean).join(" ");
      return {
        ...defaults,
        ...profile,
        name: profile.name || registeredName || defaults.name,
        email: profile.email || user.email || defaults.email
      };
    } catch (error) {
      return { ...defaults };
    }
  }

  function renderAccount() {
    const account = getAccount();
    document.getElementById("accountName").textContent = account.name;
    document.getElementById("accountInitials").textContent = account.name
      .trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
    document.getElementById("accountEmail").textContent = account.email;
    document.getElementById("accountPhone").textContent = account.phone;
    document.getElementById("accountLocality").textContent = account.locality;
  }

  function setEditing(enabled) {
    editing = enabled;
    formError.hidden = true;
    formError.textContent = "";

    ["phone", "locality"].forEach((field) => {
      const row = accountData.querySelector(`[data-field="${field}"]`);
      const current = row.querySelector("strong, input");
      const replacement = document.createElement(enabled ? "input" : "strong");

      if (enabled) {
        replacement.type = field === "phone" ? "tel" : "text";
        replacement.name = field;
        replacement.value = current.textContent;
        replacement.setAttribute("aria-label", row.querySelector("span").textContent);

        if (field === "phone") {
          replacement.inputMode = "tel";
          replacement.autocomplete = "tel";
          replacement.placeholder = "+54 9 11 1234-5678";

        } else {
          replacement.id = `account${field[0].toUpperCase()}${field.slice(1)}`;
          replacement.textContent = current.value;
        }
        current.replaceWith(replacement);
      }});

    const passwordRow = accountData.querySelector('[data-field="password"]');
    const passwordValue = passwordRow.querySelector("strong, .account-password-fields");

    if (enabled) {
      const passwordFields = document.createElement("div");
      passwordFields.className = "account-password-fields";
      passwordFields.innerHTML = `
        <input type="password" name="newPassword" placeholder="Nueva contraseña" aria-label="Nueva contraseña" autocomplete="new-password">
        <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" aria-label="Confirmar contraseña" autocomplete="new-password">
      `;
      passwordValue.replaceWith(passwordFields);
    } else {
      const maskedPassword = document.createElement("strong");
      maskedPassword.textContent = "•••••••••";
      passwordValue.replaceWith(maskedPassword);
    }

    editButton.querySelector("span").textContent = enabled ? "Guardar cambios" : "Editar datos";
    if (enabled) accountData.querySelector("input").focus();
  }

  function validatePassword(password, confirmation) {
    if (!password && !confirmation) return "";
    if (!password || !confirmation) return "Completá y confirmá la nueva contraseña.";
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(password)) return "La contraseña debe incluir al menos una letra mayúscula.";
    if (!/[0-9]/.test(password)) return "La contraseña debe incluir al menos un número.";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "La contraseña debe incluir al menos un carácter especial.";
    }
    if (password !== confirmation) return "Las contraseñas no coinciden.";
    return "";
  }

  function limpiarPrefijoCelularNacional(numero) {
    for (const areaLength of [2, 3, 4]) {
      const codigoArea = numero.slice(0, areaLength);
      const resto = numero.slice(areaLength);

      if (resto.startsWith("15")) {
        const normalizado = codigoArea + resto.slice(2);

        if (normalizado.length === 10) {
          return normalizado;
        }
      }
    }

    return numero;
  }

  function validateArgentineMobilePhone(phone) {
    const value = phone.trim();

    if (!value) {
      return "Ingresá un número de teléfono.";
    }

    const digits = value.replace(/\D/g, "");
    let nationalNumber = digits;

    if (digits.startsWith("549")) {
      nationalNumber = digits.slice(3);
    } else if (digits.startsWith("54")) {
      return "Para celular argentino en formato internacional usá +54 9 + código de área + número.";
    } else if (digits.startsWith("0")) {
      nationalNumber = limpiarPrefijoCelularNacional(digits.slice(1));
    } else {
      nationalNumber = limpiarPrefijoCelularNacional(digits);
    }

    if (!/^\d{10}$/.test(nationalNumber)) {
      return "Ingresá un celular argentino válido. Ej: +54 9 11 1234-5678 o 11 1234-5678.";
    }

    return "";
  }

  function openModal(event) {
    event.preventDefault();
    lastFocusedElement = event.currentTarget;
    renderAccount();
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("account-modal-open");
    modal.querySelector(".account-card__close").focus();
  }

  function closeModal() {
    if (editing) {
      setEditing(false);
      renderAccount();
    }
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("account-modal-open");
    lastFocusedElement?.focus();
  }

  accountTriggers.forEach((trigger) => trigger.addEventListener("click", openModal));
  modal.querySelectorAll("[data-account-close]").forEach((element) => element.addEventListener("click", closeModal));
  editButton.addEventListener("click", () => {
    if (!editing) return setEditing(true);

    const phoneInput = accountData.querySelector('[name="phone"]');
    const phoneError = validateArgentineMobilePhone(phoneInput.value);

    if (phoneError) {
      formError.textContent = phoneError;
      formError.hidden = false;
      phoneInput.focus();
      return;
    }

    const newPassword = accountData.querySelector('[name="newPassword"]').value;
    const confirmPassword = accountData.querySelector('[name="confirmPassword"]').value;
    const passwordError = validatePassword(newPassword, confirmPassword);

    if (passwordError) {
      formError.textContent = passwordError;
      formError.hidden = false;
      accountData.querySelector('[name="newPassword"]').focus();
      return;
    }

    const current = getAccount();
    localStorage.setItem("perfilUsuario", JSON.stringify({
      ...current,
      phone: accountData.querySelector('[name="phone"]').value.trim(),
      locality: accountData.querySelector('[name="locality"]').value.trim()
    }));

    if (newPassword) {
      const registeredUser = JSON.parse(localStorage.getItem("usuario")) || {};
      registeredUser.password = newPassword;
      localStorage.setItem("usuario", JSON.stringify(registeredUser));
    }

    setEditing(false);
  });
  document.getElementById("logoutAccount").addEventListener("click", () => {
    localStorage.removeItem("sesionIniciada");
    window.location.href = "/html/login.html";
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  renderAccount();
});

