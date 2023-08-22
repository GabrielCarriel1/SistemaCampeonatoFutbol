class campeonato {
  constructor(nombre) {
    this.nombre = nombre;
  }
}
class EquipoFutbol {
  constructor(
    sede,
    nombre,
    fechaCreacion,
    categoría,
    escudo,
    coloresedelEquipo,
    alineacion,
    estretegia
  ) {
    this.sede = sede;
    this.nombre = nombre;
    this.fechaCreacion = new Date(fechaCreacion);
    this.categoría = categoría;
    this.escudo = escudo;
    this.coloresedelEquipo = coloresedelEquipo;
    this.alineacion = alineacion;
    this.estretegia = estretegia;
  }
}

class Estadio {
  constructor(nombre) {
    this.nombre = nombre;
  }
}
class Jugador {
  constructor(nombres, apellidos, fechaNacimiento, posicion, numeroCamiseta) {
    this.nombres = nombres;
    this.apellidos = apellidos;
    this.fechaNacimiento = new Date(fechaNacimiento);
    this.posicion = posicion;
    this.numeroCamiseta = Number(numeroCamiseta);
  }
}

class Partido {
  constructor(fechaLimite, horario, estadioAsignad, resultado, fechaPartido) {
    this.fechaLimite = new Date(fechaLimite);
    this.horario = horario;
    this.estadioAsignad = estadioAsignad;
    this.resultado = resultado;
    this.fechaPartido = new Date(fechaPartido);
  }
}
class Sistema {
  constructor(
    equiposParticipantes,
    partidosProgramados,
    resulatdoPartidos,
    estadisticas,
    categoria
  ) {
    this.equiposParticipantes = equiposParticipantes;
    this.partidosProgramados = partidosProgramados;
    this.resulatdoPartidos = resulatdoPartidos;
    this.estadisticas = estadisticas;
    this.categoria = categoria;
  }
}
export { campeonato, EquipoFutbol, Estadio, Jugador, Partido, Sistema };
