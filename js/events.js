document.querySelectorAll("input").forEach(function (input) {
  if (input.id !== "caducidad" && input.id !== "includedDate" && input.id !== "includedSec") {
    input.addEventListener("input", generateQR);
  }
  if (input.id === "includedDate") {
    input.addEventListener("input", showDate);
  }
  if (input.id === "includedSec") {
    input.addEventListener("input", showSec);
  }
});

document.querySelectorAll("select").forEach(function (select) {
  if (
    select.id !== "area" &&
    select.id !== "planta" &&
    select.id !== "includedDate"
  ) {
    select.addEventListener("change", generateQR);
  }
});

// Añade un event listener para detectar cambios en el dateInput
document.getElementById("fecha").addEventListener("input", getDateData);
document.getElementById("area").addEventListener("input", selectArea);
document.getElementById("planta").addEventListener("input", selectPlanta);
document.getElementById("turno").addEventListener("change", getDateData);
document.getElementById("rc").addEventListener("input", activateOperation);
document.getElementById("rc").addEventListener("input", changeLot);
document.getElementById("rc").addEventListener("input", validateNumPart);
document
  .getElementById("caducidad")
  .addEventListener("input", getDateToCaducate);

document.addEventListener("DOMContentLoaded", () => {
  setMaxDate();
  document.getElementById("dataForm").addEventListener("submit", (e) => {
    e.preventDefault();
    generateTags();
  });
});
