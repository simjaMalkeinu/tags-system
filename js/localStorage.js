const getLocalStorage = () => {
  let lastFolio = localStorage.getItem("Invoice");
  let lastday = localStorage.getItem("day");
  let area = localStorage.getItem("area");
  let planta = localStorage.getItem("planta");
  const today = new Date();

  return {
    lastFolio,
    lastday,
    area,
    planta,
    today,
  };
};

const configEnviroment = () => {
  const { lastday, lastFolio, today } = getLocalStorage();

  if (lastFolio === null || lastday === null) {
    localStorage.setItem("Invoice", 0);
    localStorage.setItem("planta", "V1");
    localStorage.setItem("area", getOptions("V1")[0].valor);
    localStorage.setItem("day", obtenerFechaJuliana(today));
  } else {
    const diaActual = obtenerFechaJuliana(today);

    if (lastday < diaActual) {
      if (today.getHours() > 5) {
        localStorage.setItem("day", diaActual);
        localStorage.setItem("Invoice", 0);
        lastFolio = localStorage.getItem("Invoice");
        lastday = localStorage.getItem("day");
      }
    }
  }
};

const viewLocalSettings = () => {
  document.getElementById("area").value = localStorage.getItem("area");
  document.getElementById("planta").value = localStorage.getItem("planta");
};
