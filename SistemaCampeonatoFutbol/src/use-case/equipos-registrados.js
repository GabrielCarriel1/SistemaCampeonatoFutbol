document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está logueado
  const usuarioLogueado = JSON.parse(sessionStorage.getItem("login_success"));

  if (!usuarioLogueado) {
    window.location = "pag-principal.html";
  }

  // Elementos del DOM
  const formRegistrarEquipos = document.querySelector(
    "#form-registrar-equipos"
  );
  const listaEquiposRegistrados = document.getElementById(
    "equipos-registrados"
  );
  const btnRegistrarResultados = document.getElementById(
    "btnRegistrarResultados"
  );
  const btnEnfrentamiento = document.getElementById("btnEnfrentamiento");
  const modal = new bootstrap.Modal(
    document.getElementById("enfrentamientoModal")
  );
  const tablaEnfrentamientos = document.getElementById("tablaEnfrentamientos");

  // Agregar evento al formulario de registro de equipos
  formRegistrarEquipos.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombreEquipo = document.querySelector("#nombre-equipo").value;
    const sedeEquipo = document.querySelector("#id-sede").value;
    const ciudadEquipo = document.querySelector("#id-ciudad").value;
    const categoriaEquipo = document.querySelector("#id-categoria").value;
    const imagenEquipoInput = document.querySelector("#id-escudo-equipo");
    const imagenEquipoFile = imagenEquipoInput.files[0];
    const colorEquipo = document.querySelector("#color-equipo").value;

    const nuevoEquipo = {
      nombre: nombreEquipo,
      sede: sedeEquipo,
      ciudad: ciudadEquipo,
      categoria: categoriaEquipo,
      color: colorEquipo,
      imagen: URL.createObjectURL(imagenEquipoFile),
    };

    const equiposRegistrados =
      JSON.parse(localStorage.getItem("equipos")) || [];
    equiposRegistrados.push(nuevoEquipo);
    localStorage.setItem("equipos", JSON.stringify(equiposRegistrados));

    actualizarListaEquipos();
    imagenEquipoInput.value = "";

    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: `Equipo "${nombreEquipo}" registrado con éxito.`,
    }).then(() => {
      formRegistrarEquipos.reset();
    });
  });

  // Función para eliminar equipo
  function eliminarEquipo(index) {
    const equiposRegistrados =
      JSON.parse(localStorage.getItem("equipos")) || [];
    const equipoNombre = equiposRegistrados[index].nombre;

    const equipoNombreModal = document.getElementById("equipoNombreModal");
    equipoNombreModal.textContent = equipoNombre;

    const btnConfirmarEliminacion = document.getElementById(
      "btnConfirmarEliminacion"
    );

    const confirmarEliminacionModal = new bootstrap.Modal(
      document.getElementById("confirmarEliminacionModal")
    );
    confirmarEliminacionModal.show();
    btnConfirmarEliminacion.addEventListener("click", function () {
      equiposRegistrados.splice(index, 1);
      localStorage.setItem("equipos", JSON.stringify(equiposRegistrados));
      actualizarListaEquipos();
      confirmarEliminacionModal.hide();
    });
  }
  // Función para abrir el modal de registro de jugadores
  function abrirModalRegistroJugador() {
    const modal = new bootstrap.Modal(
      document.getElementById("registroJugadorModal")
    );
    modal.show();

    const formRegistroJugador = document.querySelector(
      "#form-registro-jugador"
    );
    formRegistroJugador.addEventListener("submit", function (event) {
      event.preventDefault();

      const nombreJugador = document.querySelector("#nombreJugador").value;
      const apellidoJugador = document.querySelector("#apellidoJugador").value;
      const fechaNacimiento = document.querySelector("#fechaNacimiento");
      const posicion = document.querySelector("#id-posicion").value;
      const numeroCamiseta = document.querySelector("#numeroCamiseta").value;

      const jugador = {
        nombre: nombreJugador,
        apellido: apellidoJugador,
        fechaNacimiento: fechaNacimiento,
        posicion: posicion,
        numeroCamiseta: numeroCamiseta,
      };

      // Guardar el jugador en el localStorage
      const jugadoresRegistrados =
        JSON.parse(localStorage.getItem("jugadores")) || [];
      jugadoresRegistrados.push(jugador);
      localStorage.setItem("jugadores", JSON.stringify(jugadoresRegistrados));

      Swal.fire({
        icon: "success",
        title: `Jugador "${nombreJugador}" registrado con éxito.`,
        showConfirmButton: false,
        timer: 2500,
      });
      formRegistroJugador.reset();
      modal.hide();
    });
  }

  // Función para actualizar lista de equipos
  function actualizarListaEquipos() {
    listaEquiposRegistrados.innerHTML = "";

    const equiposRegistrados =
      JSON.parse(localStorage.getItem("equipos")) || [];
    equiposRegistrados.forEach(function (equipo, index) {
      const nuevoEquipo = document.createElement("li");
      nuevoEquipo.className =
        "list-group-item d-flex justify-content-between align-items-center";

      // Crear elementos para mostrar información del equipo
      const imagenEquipo = document.createElement("img");
      imagenEquipo.src = equipo.imagen;
      imagenEquipo.alt = "Escudo del Equipo";
      imagenEquipo.style.maxHeight = "50px";
      imagenEquipo.style.borderRadius = "50%";

      const equipoInfo = document.createElement("span");
      equipoInfo.textContent = equipo.nombre;

      const botonesContainer = document.createElement("div");
      botonesContainer.classList.add("d-flex");

      const botonJugadores = document.createElement("button");
      botonJugadores.textContent = "Jugadores";
      botonJugadores.classList.add("btn", "btn-info", "btn-sm", "me-2"); // Agregamos "btn-sm" para botón pequeño
      botonJugadores.addEventListener("click", function () {
        abrirModalRegistroJugador(equipo.nombre);
      });

      const botonEliminar = document.createElement("button");
      botonEliminar.textContent = "Eliminar";
      botonEliminar.classList.add("btn", "btn-danger", "btn-sm"); // Agregamos "btn-sm" para botón pequeño
      botonEliminar.addEventListener("click", function () {
        eliminarEquipo(index);
      });

      botonesContainer.appendChild(botonJugadores);
      botonesContainer.appendChild(botonEliminar);

      nuevoEquipo.appendChild(imagenEquipo);
      nuevoEquipo.appendChild(equipoInfo);
      nuevoEquipo.appendChild(botonesContainer);

      listaEquiposRegistrados.appendChild(nuevoEquipo);
    });
  }

  btnEnfrentamiento.addEventListener("click", () => {
    const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
    const campeonatos = JSON.parse(localStorage.getItem("campeonatos")) || [];

    if (campeonatos.length === 0) {
      Swal.fire({
        icon: "success",
        title: `No existe un campeonato creado, Crea uno`,
        showConfirmButton: false,
        timer: 3000, // La notificación se cerrará automáticamente después de 1.5 segundos
      });
      return;
    }

    const cantidadEquipos = equipos.length;
    if (cantidadEquipos < 2) {
      Swal.fire({
        icon: "success",
        title: `No hay suficientes equipos patra generar enfretamientos`,
        showConfirmButton: false,
        timer: 3000, // La notificación se cerrará automáticamente después de 1.5 segundos
      });
      return;
    }

    const equiposDisponibles = JSON.parse(JSON.stringify(equipos));

    tablaEnfrentamientos.innerHTML = "";

    const intervaloEnfrentamientos = 24 * 60 * 60 * 1000;
    let fechaEnfrentamientoActual = new Date();

    const jugadoresExpulsados =
      JSON.parse(localStorage.getItem("jugadores")) || [];

    for (let i = 0; i < cantidadEquipos - 1; i++) {
      for (let j = i + 1; j < cantidadEquipos; j++) {
        const equipoLocalIndex = Math.floor(
          Math.random() * equiposDisponibles.length
        );
        const equipoLocal = equiposDisponibles.splice(equipoLocalIndex, 1)[0];

        const equipoVisitanteIndex = Math.floor(
          Math.random() * equiposDisponibles.length
        );
        const equipoVisitante = equiposDisponibles.splice(
          equipoVisitanteIndex,
          1
        )[0];

        const enfrentamientoRow = document.createElement("tr");
        enfrentamientoRow.innerHTML = `
          <td>${fechaEnfrentamientoActual.toISOString().substr(0, 10)}</td>
          <td>${equipoLocal.nombre || "Equipo"}</td>
          <td class="vs">VS</td>
          <td>${equipoVisitante.nombre || "Equipo"}</td>
          <td><input type="number" class="goles-equipo-a" placeholder="Goles" min="0"></td>
          <td class="vs">-</td>
          <td><input type="number" class="goles-equipo-b" placeholder="Goles" min="0"></td>
          <td><input type="number" class="tarjetas-amarillas-local-input" placeholder="Tar. Amar" min="0"></td>
          <td><input type="number" class="tarjetas-amarillas-visitante-input" placeholder="Tar. Amar" min="0"></td>
          <td><input type="number" class="tarjetas-rojas-local-input" placeholder="Tar. Roj" min="0"></td>
          <td><input type="number" class="tarjetas-rojas-visitante-input" placeholder="Tar. Roj" min="0"></td>
          <td>
            <select class="form-select jugadores-expulsados-input">
              <option value="">Jugador Sustituido</option>
              ${jugadoresExpulsados
                .map(
                  (jugador) =>
                    `<option value="${jugador.nombre}">${jugador.nombre} ${jugador.apellido}</option>`
                )
                .join("")}
            </select>
          </td>
        `;

        tablaEnfrentamientos.appendChild(enfrentamientoRow);

        fechaEnfrentamientoActual = new Date(
          fechaEnfrentamientoActual.getTime() + intervaloEnfrentamientos
        );
      }
    }

    modal.show();
  });

  btnRegistrarResultados.addEventListener("click", () => {
    // Obtener valores de los inputs
    const golesEquipoAInputs = document.querySelectorAll(".goles-equipo-a");
    const golesEquipoBInputs = document.querySelectorAll(".goles-equipo-b");
    const tarjetasAmarillasLocal = document.querySelectorAll(
      ".tarjetas-amarillas-local-input"
    );
    const tarjetasAmarillasVisitante = document.querySelectorAll(
      ".tarjetas-amarillas-visitante-input"
    );

    const tarjetasRojasLocal = document.querySelectorAll(
      ".tarjetas-rojas-local-input"
    );
    const tarjetasRojasVisitante = document.querySelectorAll(
      ".tarjetas-rojas-visitante-input"
    );
    const jugadoresExpulsadosInputs = document.querySelectorAll(
      ".jugadores-expulsados-input"
    );

    // Obtener la lista actual de partidos jugados del Local Storage
    const partidosJugados =
      JSON.parse(localStorage.getItem("partidosJugados")) || [];

    // Recorrer los inputs y construir objetos de partido
    golesEquipoAInputs.forEach((input, index) => {
      const golesEquipoA = parseInt(input.value);
      const golesEquipoB = parseInt(golesEquipoBInputs[index].value);
      const partido = {
        fecha: tablaEnfrentamientos.rows[index].cells[0].textContent,
        equipoA: tablaEnfrentamientos.rows[index].cells[1].textContent,
        equipoB: tablaEnfrentamientos.rows[index].cells[3].textContent,
        golesEquipoA: golesEquipoA,
        golesEquipoB: golesEquipoB,
        tarjetasAmarillasLocal: tarjetasAmarillasLocal[index].value,
        tarjetasAmarillasVisitante: tarjetasAmarillasVisitante[index].value,
        tarjetasRojasLocal: tarjetasRojasLocal[index].value,
        tarjetasRojasVisitante: tarjetasRojasVisitante[index].value,
        jugadoresExpulsados: jugadoresExpulsadosInputs[index].value,
      };

      if (golesEquipoA > golesEquipoB) {
        partido.puntosEquipoA = 3;
        partido.puntosEquipoB = 0;
      } else if (golesEquipoA < golesEquipoB) {
        partido.puntosEquipoA = 0;
        partido.puntosEquipoB = 3;
      } else {
        partido.puntosEquipoA = 1;
        partido.puntosEquipoB = 1;
      }

      partidosJugados.push(partido);
    });

    localStorage.setItem("partidosJugados", JSON.stringify(partidosJugados));

    calcularYMostrarTablaPosiciones();

    modal.hide();
  });

  function calcularYMostrarTablaPosiciones() {
    const tablaPosiciones = document.getElementById("tablaPosiciones");
    tablaPosiciones.innerHTML = "";

    const equipos = JSON.parse(localStorage.getItem("equipos")) || [];
    const partidosJugados =
      JSON.parse(localStorage.getItem("partidosJugados")) || [];

    const equiposPosiciones = equipos.map((equipo) => {
      const partidosEquipo = partidosJugados.filter(
        (partido) =>
          partido.equipoA === equipo.nombre || partido.equipoB === equipo.nombre
      );

      const puntos = partidosEquipo.reduce((totalPuntos, partido) => {
        return (
          totalPuntos +
          (equipo.nombre === partido.equipoA
            ? partido.puntosEquipoA
            : partido.puntosEquipoB)
        );
      }, 0);

      const goles = partidosEquipo.reduce((totalGoles, partido) => {
        return (
          totalGoles +
          (equipo.nombre === partido.equipoA
            ? partido.golesEquipoA
            : partido.golesEquipoB)
        );
      }, 0);

      const tarjetasAmarillas = partidosEquipo.reduce(
        (totalAmarillas, partido) => {
          return (
            totalAmarillas +
            (equipo.nombre === partido.equipoA
              ? partido.tarjetasAmarillasLocal
              : partido.tarjetasAmarillasVisitante)
          );
        },
        0
      );

      const tarjetasRojas = partidosEquipo.reduce((totalRojas, partido) => {
        return (
          totalRojas +
          (equipo.nombre === partido.equipoA
            ? partido.tarjetasRojasLocal
            : partido.tarjetasRojasVisitante)
        );
      }, 0);

      return {
        nombre: equipo.nombre,
        escudo: equipo.imagen,
        partidosJugados: partidosEquipo.length,
        puntos: puntos,
        goles: goles,
        tarjetasAmarillas: parseInt(tarjetasAmarillas),
        tarjetasRojas: parseInt(tarjetasRojas),
      };
    });

    equiposPosiciones.sort((a, b) => b.puntos - a.puntos || b.goles - a.goles);

    equiposPosiciones.forEach((equipo, index) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${index + 1}</td>
        <td><img src="${
          equipo.escudo
        }" alt="Escudo del Equipo" width="60" height="60"></td>
        <td>${equipo.nombre}</td>
        <td>${equipo.partidosJugados}</td>
        <td>${equipo.goles}</td>
        <td>${equipo.puntos}</td>
        <td>${equipo.tarjetasAmarillas}</td>
        <td>${equipo.tarjetasRojas}</td>
      `;
      tablaPosiciones.appendChild(fila);
    });
    const modal = new bootstrap.Modal(
      document.getElementById("posicionesModal")
    );
    modal.show();
  }

  window.onload = () => {
    actualizarListaEquipos();
  };
});
