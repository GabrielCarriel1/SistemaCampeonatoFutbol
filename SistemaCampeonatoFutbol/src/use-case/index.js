class Campeonato {
  constructor(nombre, fechaInicio, fechaFin) {
    this.nombre = nombre;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
  }
}

class App {
  constructor() {
    this.botonCerrarSesion = document.getElementById("cerrarSesion");
    this.botonCerrarSesion.addEventListener("click", () => {
      sessionStorage.removeItem("login_success");
      window.location.href = "pag-principal.html";
    });

    this.iniciarSesion();

    const fechaInicioInput = document.querySelector("#id-fecha-inicio");
    fechaInicioInput.valueAsDate = new Date();

    const formCrearCampeonato = document.querySelector(
      "#form-crear-campeonato"
    );
    formCrearCampeonato.addEventListener(
      "submit",
      this.handleCrearCampeonato.bind(this)
    );
  }

  iniciarSesion() {
    document.addEventListener("DOMContentLoaded", () => {
      const usuarioLogueado = JSON.parse(
        sessionStorage.getItem("login_success")
      );

      if (!usuarioLogueado) {
        window.location = "pag-principal.html";
      }
    });
  }

  handleCrearCampeonato(event) {
    event.preventDefault();

    const nombreCampeonato = document.querySelector("#id-nombre").value;
    const fechaInicio = document.querySelector("#id-fecha-inicio").value;
    const fechaFin = document.querySelector("#id-fecha-fin").value;

    if (fechaFin <= fechaInicio) {
      this.mostrarError("La fecha final no puede ser menor que la inicial.");
      return;
    }

    const campeonato = new Campeonato(nombreCampeonato, fechaInicio, fechaFin);
    const campeonatosRegistrados =
      JSON.parse(localStorage.getItem("campeonatos")) || [];
    campeonatosRegistrados.push(campeonato);
    localStorage.setItem("campeonatos", JSON.stringify(campeonatosRegistrados));

    this.mostrarExito("¡Campeonato creado exitosamente!", () => {
      window.location.href = "crear-equipos.html";
    });
  }

  mostrarError(mensaje) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: mensaje,
    });
  }

  mostrarExito(mensaje, callback) {
    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: mensaje,
      allowOutsideClick: false,
    }).then(() => {
      if (callback) {
        callback();
      }
    });
  }
}

const app = new App();
