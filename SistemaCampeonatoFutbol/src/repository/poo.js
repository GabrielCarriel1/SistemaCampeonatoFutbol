class Equipo {
  constructor(nombre, sede, ciudad, categoria, color, imagen) {
    this.nombre = nombre;
    this.sede = sede;
    this.ciudad = ciudad;
    this.categoria = categoria;
    this.color = color;
    this.imagen = imagen;
  }
}

class Torneo {
  constructor() {
    this.equipos = [];
    this.formRegistrarEquipos = document.querySelector(
      "#form-registrar-equipos"
    );

    // Escuchar el evento de envío del formulario de registro de equipos
    this.formRegistrarEquipos.addEventListener(
      "submit",
      this.registrarEquipo.bind(this)
    );
  }

  registrarEquipo(event) {
    event.preventDefault();

    const nombreEquipo =
      this.formRegistrarEquipos.querySelector("#nombre-equipo").value;
    const sedeEquipo =
      this.formRegistrarEquipos.querySelector("#id-sede").value;
    const ciudadEquipo =
      this.formRegistrarEquipos.querySelector("#id-ciudad").value;
    const categoriaEquipo =
      this.formRegistrarEquipos.querySelector("#id-categoria").value;
    const imagenEquipoInput =
      this.formRegistrarEquipos.querySelector("#id-escudo-equipo");
    const imagenEquipoFile = imagenEquipoInput.files[0];
    const colorEquipo =
      this.formRegistrarEquipos.querySelector("#color-equipo").value;

    const nuevoEquipo = new Equipo(
      nombreEquipo,
      sedeEquipo,
      ciudadEquipo,
      categoriaEquipo,
      colorEquipo,
      URL.createObjectURL(imagenEquipoFile)
    );

    this.registrarEquipoEnLocalStorage(nuevoEquipo);
    this.actualizarListaEquipos();
    imagenEquipoInput.value = "";

    alert(`Equipo "${nombreEquipo}" registrado con éxito.`);
    this.formRegistrarEquipos.reset();
  }

  registrarEquipoEnLocalStorage(equipo) {
    const equiposRegistrados =
      JSON.parse(localStorage.getItem("equipos")) || [];
    equiposRegistrados.push(equipo);
    localStorage.setItem("equipos", JSON.stringify(equiposRegistrados));
  }

  actualizarListaEquipos() {
    const listaEquiposRegistrados = document.getElementById(
      "equipos-registrados"
    );
    listaEquiposRegistrados.innerHTML = "";

    this.equipos.forEach((equipo, index) => {
      const nuevoEquipo = document.createElement("li");
      nuevoEquipo.className =
        "list-group-item d-flex justify-content-between align-items-center";

      const equipoInfo = document.createElement("span");
      equipoInfo.textContent = equipo.nombre;

      const imagenEquipo = document.createElement("img");
      imagenEquipo.src = equipo.imagen;
      imagenEquipo.alt = "Escudo del Equipo";
      imagenEquipo.style.maxHeight = "50px";
      imagenEquipo.style.borderRadius = "50%";

      const botonesContainer = document.createElement("div");
      botonesContainer.classList.add("d-flex");

      const botonEditar = document.createElement("button");
      botonEditar.textContent = "Jugadores";
      botonEditar.classList.add("btn", "btn-warning", "me-2");
      botonEditar.addEventListener("click", () => {
        // Lógica para editar el equipo (si deseas implementarla)
      });

      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "Eliminar";
      botonEliminar.classList.add("btn", "btn-danger");
      botonEliminar.addEventListener("click", () => {
        this.eliminarEquipo(index);
      });

      botonesContainer.appendChild(botonEditar);
      botonesContainer.appendChild(botonEliminar);

      nuevoEquipo.appendChild(equipoInfo);
      nuevoEquipo.appendChild(imagenEquipo);
      nuevoEquipo.appendChild(botonesContainer);

      listaEquiposRegistrados.appendChild(nuevoEquipo);
    });
  }
  eliminarEquipo(index) {
    const equipoNombre = this.equipos[index].nombre;

    const equipoNombreModal = document.getElementById("equipoNombreModal");
    equipoNombreModal.textContent = equipoNombre;

    const btnConfirmarEliminacion = document.getElementById(
      "btnConfirmarEliminacion"
    );

    const confirmarEliminacionModal = new bootstrap.Modal(
      document.getElementById("confirmarEliminacionModal")
    );
    confirmarEliminacionModal.show();

    btnConfirmarEliminacion.addEventListener("click", () => {
      this.equipos.splice(index, 1);
      this.guardarEquiposEnLocalStorage();
      this.actualizarListaEquipos();
      confirmarEliminacionModal.hide();
    });
  }

  guardarEquiposEnLocalStorage() {
    localStorage.setItem("equipos", JSON.stringify(this.equipos));
  }
  generarEnfrentamientos() {
    const equipos = this.equipos;

    if (equipos.length < 2) {
      alert("No hay suficientes equipos para generar enfrentamientos.");
      return;
    }

    const tablaEnfrentamientos = document.getElementById(
      "tablaEnfrentamientos"
    );
    tablaEnfrentamientos.innerHTML = "";

    const cantidadEnfrentamientos = equipos.length / 2;
    const intervaloEnfrentamientos = 1;

    let fechaEnfrentamientoActual = new Date();

    for (let i = 0; i < cantidadEnfrentamientos; i++) {
      const enfrentamientoRow = document.createElement("tr");
      enfrentamientoRow.innerHTML = `
        <td>${fechaEnfrentamientoActual.toISOString().substr(0, 10)}</td>
        <td>${equipos[i].nombre || "Equipo"}</td>
        <td class="vs">VS</td>
        <td>${equipos[i + 1].nombre || "Equipo"}</td>
        <td><input type="number" class="goles-equipo-a" placeholder="Goles" min="0"></td>
        <td class="vs">-</td>
        <td><input type="number" class="goles-equipo-b" placeholder="Goles" min="0"></td>
        <td><input type="number" class="tarjetas-amarillas-input" placeholder="Tar. Amar"></td>
        <td><input type="number" class="tarjetas-rojas-input" placeholder="Tar. Roj"></td>
        <td><input type="text" class="jugadores-expulsados-input" placeholder="Explsds"></td>
      `;
      tablaEnfrentamientos.appendChild(enfrentamientoRow);

      // Incrementar la fecha del enfrentamiento actual según el intervalo
      fechaEnfrentamientoActual = new Date(
        fechaEnfrentamientoActual.getTime() +
          intervaloEnfrentamientos * 24 * 60 * 60 * 1000
      );
    }

    const modal = new bootstrap.Modal(
      document.getElementById("enfrentamientoModal")
    );
    modal.show();
  }

  registrarResultados() {
    const golesEquipoAInputs = document.querySelectorAll(".goles-equipo-a");
    const golesEquipoBInputs = document.querySelectorAll(".goles-equipo-b");
    const tarjetasAmarillasInputs = document.querySelectorAll(
      ".tarjetas-amarillas-input"
    );
    const tarjetasRojasInputs = document.querySelectorAll(
      ".tarjetas-rojas-input"
    );
    const jugadoresExpulsadosInputs = document.querySelectorAll(
      ".jugadores-expulsados-input"
    );

    const partidosJugados = [];

    golesEquipoAInputs.forEach((input, index) => {
      const fecha = tablaEnfrentamientos.rows[index].cells[0].textContent;
      const equipoA = tablaEnfrentamientos.rows[index].cells[1].textContent;
      const equipoB = tablaEnfrentamientos.rows[index].cells[3].textContent;
      const golesEquipoA = parseInt(input.value);
      const golesEquipoB = parseInt(golesEquipoBInputs[index].value);
      const tarjetasAmarillas = tarjetasAmarillasInputs[index].value;
      const tarjetasRojas = tarjetasRojasInputs[index].value;
      const jugadoresExpulsados = jugadoresExpulsadosInputs[index].value;

      const partido = {
        fecha,
        equipoA,
        equipoB,
        golesEquipoA,
        golesEquipoB,
        tarjetasAmarillas,
        tarjetasRojas,
        jugadoresExpulsados,
      };

      partidosJugados.push(partido);
    });

    localStorage.setItem("partidosJugados", JSON.stringify(partidosJugados));

    this.calcularYMostrarTablaPosiciones();

    const modal = new bootstrap.Modal(
      document.getElementById("enfrentamientoModal")
    );
    modal.hide();
  }

  calcularYMostrarTablaPosiciones() {
    const tablaPosiciones = document.getElementById("tablaPosiciones");
    tablaPosiciones.innerHTML = "";

    const equiposPosiciones = this.calcularPosiciones();

    equiposPosiciones.forEach((equipo, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${index + 1}</td>
        <td><img src="${
          equipo.imagen
        }" alt="Escudo del Equipo" width="30" height="30"></td>
        <td>${equipo.nombre}</td>
        <td>${equipo.partidosJugados}</td>
        <td>${equipo.goles}</td>
        <td>${equipo.puntos}</td>
      `;
      tablaPosiciones.appendChild(fila);
    });

    const modal = new bootstrap.Modal(
      document.getElementById("posicionesModal")
    );
    modal.show();
  }

  calcularPosiciones() {
    const equiposPosiciones = this.equipos.map((equipo) => {
      const partidosEquipo = this.obtenerPartidosEquipo(equipo.nombre);

      const puntos = partidosEquipo.reduce((totalPuntos, partido) => {
        return totalPuntos + partido.puntosEquipo(equipo.nombre);
      }, 0);

      const goles = partidosEquipo.reduce((totalGoles, partido) => {
        return totalGoles + partido.golesEquipo(equipo.nombre);
      }, 0);

      return {
        nombre: equipo.nombre,
        imagen: equipo.imagen,
        partidosJugados: partidosEquipo.length,
        puntos,
        goles,
      };
    });

    equiposPosiciones.sort((a, b) => b.puntos - a.puntos || b.goles - a.goles);

    return equiposPosiciones;
  }

  obtenerPartidosEquipo(nombreEquipo) {
    const partidosJugados =
      JSON.parse(localStorage.getItem("partidosJugados")) || [];
    return partidosJugados.filter(
      (partido) =>
        partido.equipoA === nombreEquipo || partido.equipoB === nombreEquipo
    );
  }
}

const torneo = new Torneo();
torneo.actualizarListaEquipos();
