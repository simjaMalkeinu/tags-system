function obtenerFechaJuliana(fecha) {
  // Obtener la fecha juliana en formato de días del año
  var inicioAño = new Date(fecha.getFullYear(), 0, 1);
  var diasDelAño = Math.floor((fecha - inicioAño) / (1000 * 60 * 60 * 24)) + 1;

  return diasDelAño;
}
