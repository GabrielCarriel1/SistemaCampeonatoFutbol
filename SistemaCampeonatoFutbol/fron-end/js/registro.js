class RegistroForm {
  constructor() {
    this.registroForm = document.querySelector(".formulario__register");
    this.usernameInput = document.querySelector("#logname");
    this.emailInput = document.querySelector("#logemail");
    this.passwordInput = document.querySelector("#logpass");
    this.mensajeError = document.querySelector("#mensaje-error");
    this.usuariosRegistrados =
      JSON.parse(localStorage.getItem("usuarios")) || [];

    this.registroForm.addEventListener(
      "submit",
      this.handleRegistro.bind(this)
    );
  }

  handleRegistro(event) {
    event.preventDefault();

    const email = this.emailInput.value;
    const usuarioExistente = this.usuariosRegistrados.find(
      (usuario) => usuario.email === email
    );

    if (usuarioExistente) {
      swal("Error", "Este correo electrónico ya está registrado.", "error");
    } else {
      this.registerNewUser();
    }
  }

  registerNewUser() {
    const nuevoUsuario = {
      username: this.usernameInput.value,
      email: this.emailInput.value,
      password: this.passwordInput.value,
    };

    this.usuariosRegistrados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(this.usuariosRegistrados));
    localStorage.setItem("nombreUsuario", nuevoUsuario.username);

    swal("Éxito", "Registro exitoso. Redirigiendo...", "success").then(() => {
      this.redirectToLoginPage();
    });
  }

  redirectToLoginPage() {
    window.location.href = "sesion.html";
  }
}

const registroFormInstance = new RegistroForm();
