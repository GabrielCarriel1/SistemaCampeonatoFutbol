class LoginFormulario {
  constructor() {
    this.loginForm = document.querySelector(".formulario__login");
    this.usernameInput = document.querySelector("#id-logemail");
    this.passwordInput = document.querySelector("#id-logpass");
    this.errorMessage = document.querySelector("#login-mensaje-error");
    this.cuentasAlmacenadas =
      JSON.parse(localStorage.getItem("usuarios")) || [];

    this.loginForm.addEventListener("submit", this.VerificarLogin.bind(this));
  }

  VerificarLogin(event) {
    event.preventDefault();

    const email = this.usernameInput.value;
    const password = this.passwordInput.value;

    const cuentaEncontrada = this.cuentasAlmacenadas.find(
      (cuenta) => cuenta.email === email && cuenta.password === password
    );

    if (!cuentaEncontrada) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Correo o Contraseña Incorrectos!",
      });
    } else {
      this.informacionLogin(cuentaEncontrada);
    }
  }

  informacionLogin(cuenta) {
    sessionStorage.setItem("login_success", JSON.stringify(cuenta));
    localStorage.setItem("email", cuenta.email);
    localStorage.setItem("contraseña", cuenta.password);

    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Registro exitoso. Redirigiendo...",
    }).then(() => {
      this.redirectPagina();
    });
  }

  redirectPagina() {
    window.location.href = "index.html";
  }
}

const loginFormInstance = new LoginFormulario();
