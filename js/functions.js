// Función para determinar la letra según el turno
function getShiftLetter(date) {
  const hour = date.getHours();
  // De 6am a 2pm - A
  if (hour >= 6 && hour < 14) {
    return "A";
  }
  // De 2pm a 10pm - B
  else if (hour >= 14 && hour < 22) {
    return "B";
  }
  // De 10pm a 6am - C
  else {
    return "C";
  }
}

const showAlert = (text, tipo) => {
  const divAlert = document.getElementById("alert");

  const check = `<symbol id="check-circle-fill" width="16" height="16" style="fill: #FFF" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
</symbol>`;

  const alertIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" style="fill: #FFF" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
</svg>`;

  divAlert.innerHTML = `<div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                          ${text}
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          ></button>
                        </div>`;

  const toastLiveExample = document.getElementById("liveToast");
  const body = document.getElementById("alert-body");
  const header = document.getElementById("alert-header");
  const iconDiv = document.getElementById("icon-alert");

  body.innerHTML = text;
  header.className = `toast-header bg-${tipo} text-white`;
  iconDiv.innerHTML = tipo === "danger" ? alertIcon : check;

  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
  toastBootstrap.show();

  window.scrollTo({
    top: 0,
    behavior: "smooth", // Puedes usar 'auto' para un desplazamiento instantáneo
  });
};

const generarLote = () => {
  // obtener la fecha actual
  const date = new Date();
  // obtener el mes actual
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  // obtener el año actual
  const year = date.getFullYear().toString().substr(-2);
  // obtener día actual
  const day = date.getDate().toString().padStart(2, "0");

  // Llamar a la función getShiftLetter para obtener la letra del turno
  const shiftLetter = getShiftLetter(date);
  // Concatenar el mes, día, el año y la letra del turno
  // El formato será MMDDAA seguido de la letra del turno (A, B, o C)
  const formattedDate = month + day + year + shiftLetter;

  // Asignar la fecha formateada al valor del elemento con id "lote"
  document.getElementById("lote").value = formattedDate;

  // Obtener año, mes y día
  const yearI = date.getFullYear();
  const monthI = String(date.getMonth() + 1).padStart(2, "0"); // Mes empieza desde 0, por eso sumamos 1
  const dayI = String(date.getDate()).padStart(2, "0");

  // Formatear la fecha en YYYY-MM-DD
  const txtDate = `${yearI}-${monthI}-${dayI}`;

  document.getElementById("fecha").value = txtDate;
  document.getElementById("turno").value = shiftLetter;
  generateQR();
};

let activar = false;

function readQRTag() {
  removeClasses();
  const folio = document.getElementById("divFolio");
  const registro = document.getElementById("divRegistro");
  const fechayturno = document.getElementById("fechayturno");
  const divCaducidad = document.getElementById("divCaducidad");
  const lote = document.getElementById("lote");
  const rc = document.getElementById("rc");
  const button_generar = document.getElementById("button-generar");
  const btnAddCaducidad = document.getElementById("btnAddCaducidad");
  const operacion = document.getElementById("op");
  const button_personalizar = document.getElementById("button-personalizar");
  const leerTagbtn = document.getElementById("leerTag");
  const divCantidadTotal = document.getElementById("divCantidadTotal");
  const divCantidad = document.getElementById("divCantidad");
  const divIncDate = document.getElementById("divIncDate");

  const divEstandar = document.getElementById("divEstandar");

  var formulario = document.getElementById("dataForm");
  formulario.reset();

  folio.hidden = !folio.hidden;
  divIncDate.hidden = !divIncDate.hidden;
  registro.hidden = !registro.hidden;
  divEstandar.hidden = !divEstandar.hidden;

  divCantidadTotal.hidden = !divCantidadTotal.hidden;
  divCantidad.hidden = !divCantidad.hidden;

  fechayturno.hidden = !fechayturno.hidden;
  lote.disabled = !lote.disabled;
  button_generar.disabled = !button_generar.disabled;
  btnAddCaducidad.disabled = !btnAddCaducidad.disabled;
  button_personalizar.disabled = !button_personalizar.disabled;

  if (!activar) {
    rc.removeEventListener("input", activateOperation);
    rc.removeEventListener("input", changeLot);
    operacion.disabled = false;
    divCaducidad.hidden = true;
    divCaducidad.hidden
      ? (btnAddCaducidad.innerHTML = "Incluir Caducidad")
      : (btnAddCaducidad.innerHTML = "Quitar Caducidad");
    leerTagbtn.innerHTML = "Generar etiquetas";
  } else {
    rc.addEventListener("input", activateOperation);
    rc.addEventListener("input", changeLot);
    leerTagbtn.innerHTML = "Leer Etiqueta";
  }
  activar = !activar;
}

function addCaducidad() {
  const caducidad = document.getElementById("divCaducidad");
  const caducidadInput = document.getElementById("caducidad");
  const btnC = document.getElementById("btnAddCaducidad");

  caducidad.hidden = !caducidad.hidden;

  caducidad.hidden
    ? (btnC.innerHTML = "Incluir Caducidad")
    : (btnC.innerHTML = "Quitar Caducidad");

  if (caducidad.hidden === true) {
    caducidadInput.value = "";
  }
}

function getData() {
  let rc = document.getElementById("rc").value;
  let lote = document.getElementById("lote").value;
  let cantidad = document.getElementById("cantidad").value;
  let cantidadTotal = document.getElementById("cantidadTotal").value;
  let operacion = document.getElementById("op").value;
  let estandar = document.getElementById("estandar").value;
  let folio = document.getElementById("folio").value;
  let fecha = document.getElementById("fecha").value;
  let unidad = document.getElementById("unidad").value;
  let caducidad = document.getElementById("caducidad").value;
  let caducidadDate = document.getElementById("caducidadDate").value;
  let includedDate = document.getElementById("includedDate").checked;
  let includedSec = document.getElementById("includedSec").checked;
  const qrContainer = document.getElementById("qrContainer");

  rc = rc.trim();
  lote = lote.trim();
  cantidad = cantidad.trim();
  operacion = operacion.trim();
  estandar = estandar.trim();
  unidad = unidad.trim();
  folio = folio.trim();
  caducidad = caducidad.trim();
  caducidadDate = caducidadDate.trim();
  cantidadTotal = cantidadTotal.trim();

  return {
    rc,
    lote,
    cantidad,
    operacion,
    estandar,
    folio,
    unidad,
    qrContainer,
    fecha,
    caducidad,
    caducidadDate,
    cantidadTotal,
    includedDate,
    includedSec,
  };
}

function validateForm() {
  // Obtén los valores del formulario

  const { rc, lote, cantidad, cantidadTotal, operacion, estandar } = getData();

  if (rc === "" || rc.trim() === "") {
    document.getElementById("rc").classList.add("is-invalid");
    showAlert(
      "La clave <strong>RC o UEPS</strong> no puede estar vacia",
      "danger"
    );
    return false;
  }

  if (!numPartList.includes(rc)) {
    showAlert("La clave <strong>RC o UEPS</strong> no existe", "danger");
    return false;
  }

  if (lote === "" || lote.trim() === "") {
    document.getElementById("lote").classList.add("is-invalid");
    showAlert("El <strong>Lote</strong> no puede estar vacio", "danger");
    return false;
  } else {
    document.getElementById("lote").classList.remove("is-invalid");
    document.getElementById("lote").classList.add("is-valid");
  }

  if (!activar) {
    if (cantidadTotal === "" || cantidadTotal.trim() === "") {
      document.getElementById("cantidadTotal").classList.add("is-invalid");
      showAlert(
        "La <strong>CANTIDAD TOTAL</strong> no puede estar vacia",
        "danger"
      );
      return false;
    } else {
      // Expresión regular para validar si es un número entero o flotante
      var numberPattern = /^-?\d+(\.\d+)?$/;

      if (numberPattern.test(cantidadTotal)) {
        document.getElementById("cantidadTotal").classList.remove("is-invalid");
        document.getElementById("cantidadTotal").classList.add("is-valid");
      } else {
        document.getElementById("cantidadTotal").classList.add("is-invalid");
        showAlert(
          "La <strong>CANTIDAD TOTAL</strong> debe ser un numero",
          "danger"
        );
        return false;
      }
    }
  } else {
    if (cantidad === "" || cantidad.trim() === "") {
      document.getElementById("cantidad").classList.add("is-invalid");

      showAlert("La <strong>CANTIDAD </strong> no puede estar vacia", "danger");
      return false;
    } else {
      // Expresión regular para validar si es un número entero o flotante
      var numberPattern = /^-?\d+(\.\d+)?$/;

      if (numberPattern.test(cantidad)) {
        document.getElementById("cantidad").classList.remove("is-invalid");
        document.getElementById("cantidad").classList.add("is-valid");
      } else {
        document.getElementById("cantidadTotal").classList.add("is-invalid");
        showAlert(
          "La <strong>CANTIDAD TOTAL</strong> debe ser un numero",
          "danger"
        );
        return false;
      }
    }
  }

  if (rc.length <= 8) {
    if (operacion === "") {
      document.getElementById("op").classList.add("is-invalid");
      showAlert("La <strong>OPERACION</strong> no puede estar vacia", "danger");
      return false;
    } else {
      document.getElementById("op").classList.remove("is-invalid");
      document.getElementById("op").classList.add("is-valid");
    }
  } else {
    document.getElementById("op").classList.remove("is-invalid");
    document.getElementById("op").classList.add("is-valid");
  }

  if (operacion.trim() % 10 !== 0) {
    document.getElementById("op").classList.add("is-invalid");
    showAlert(
      "La <strong>OPERACION</strong> debe ser multiplo de <strong>10</strong>",
      "danger"
    );
    return false;
  } else {
    document.getElementById("op").classList.remove("is-invalid");
    document.getElementById("op").classList.add("is-valid");
  }

  if ((estandar === "" || estandar.trim() === "") && activar === false) {
    document.getElementById("estandar").classList.add("is-invalid");

    showAlert(
      "La <strong>CANTIDAD DE CAJAS</strong> no puede estar vacia",
      "danger"
    );
    return false;
  } else {
    // Expresión regular para validar si es un número entero o flotante
    var numberPattern = /^-?\d+(\.\d+)?$/;

    if (numberPattern.test(estandar)) {
      document.getElementById("estandar").classList.remove("is-invalid");
      document.getElementById("estandar").classList.add("is-valid");
    } else {
      document.getElementById("cantidadTotal").classList.add("is-invalid");
      showAlert(
        "La <strong>CANTIDAD TOTAL</strong> debe ser un numero",
        "danger"
      );
      return false;
    }
  }

  if (parseInt(estandar, 10) > parseInt(cantidadTotal, 10)) {
    document.getElementById("estandar").classList.add("is-invalid");
    showAlert(
      "La <strong>La cantidad por contenedor es mayor a la cantidad total</strong>",
      "danger"
    );
    return false;
  } else {
    document.getElementById("estandar").classList.remove("is-invalid");
    document.getElementById("estandar").classList.add("is-valid");
  }

  return true;
}

function setMaxDate() {
  const date = document.getElementById("fecha");
  // Obtén la fecha actual
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript son 0-11, así que sumamos 1
  const dd = String(today.getDate()).padStart(2, "0");

  // Formatea la fecha en el formato requerido (YYYY-MM-DD)
  const maxDate = `${yyyy}-${mm}-${dd}`;

  // Establece el valor máximo permitido
  date.max = maxDate;
}

function getDateData() {
  const loteInput = document.getElementById("lote");
  const turno = document.getElementById("turno").value;
  const dateValue = document.getElementById("fecha").value;

  if (dateValue) {
    // Dividimos la fecha en sus componentes
    const [year, month, day] = dateValue.split("-");

    // Crear una fecha en UTC para evitar desajustes de zona horaria
    const date = new Date(Date.UTC(year, month - 1, day));

    console.log(dateValue);
    console.log(date);

    // Obtener los componentes de la fecha
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0"); // Los meses en JavaScript son 0-11, así que sumamos 1
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const yy = String(date.getUTCFullYear()).slice(-2);

    console.log(mm);
    console.log(dd);
    console.log(yy);

    // Formatear la fecha como MMDDYY
    const formattedDate = `${mm}${dd}${yy}`;

    // Actualizar el valor de loteInput con el valor formateado
    loteInput.value = formattedDate + turno;
  } else {
    // Si el valor está vacío, limpia el loteInput
    loteInput.value = "";
  }
  generateQR();
}

function activateOperation() {
  const rc = document.getElementById("rc").value;
  const operacion = document.getElementById("op");

  if (rc.length <= 8) {
    operacion.disabled = false;
    document.getElementById("tagTitle").innerText = "RC";
  } else {
    operacion.disabled = true;
    document.getElementById("tagTitle").innerText = "UEPS";
  }
}

function changeLot() {
  const rc = document.getElementById("rc").value;
  const divFechaTurno = document.getElementById("fechayturno");
  const btnG = document.getElementById("button-generar");
  const button_personalizar = document.getElementById("button-personalizar");
  const lote = document.getElementById("lote");

  if (rc.length <= 8) {
    divFechaTurno.hidden = false;
    btnG.hidden = false;
    button_personalizar.hidden = false;
    lote.disabled = true;
    lote.placeholder = "MMDDYYT";
  } else {
    divFechaTurno.hidden = true;
    btnG.hidden = true;
    button_personalizar.hidden = true;
    lote.disabled = false;
    lote.placeholder = "";
  }
}

function personalizarLote() {
  const divFechaTurno = document.getElementById("fechayturno");
  const button_personalizar = document.getElementById("button-personalizar");
  const lote = document.getElementById("lote");
  const btnG = document.getElementById("button-generar");
  const rc = document.getElementById("rc");
  const operacion = document.getElementById("op");

  divFechaTurno.hidden = !divFechaTurno.hidden;
  lote.disabled = !lote.disabled;
  btnG.hidden = !btnG.hidden;

  divFechaTurno.hidden
    ? (button_personalizar.innerHTML = "Usar lote de produccion")
    : (button_personalizar.innerHTML = "Personalizar");

  if (divFechaTurno.hidden) {
    rc.removeEventListener("input", changeLot);
    operacion.disabled = false;
  } else {
    rc.addEventListener("input", changeLot);
  }
}

function generateQR() {
  const { rc, lote, cantidad, estandar, operacion, unidad, includedDate, cantidadTotal } =
    getData();
  const qrContainer = document.getElementById("qrContainer");

  console.log(includedDate);

  // Formatear los datos en el formato deseado
  // const qrText = `RC:${rc}\t LOTE:${lote}\t CANTIDAD:${cantidad}\t operacion:${operacion};`;
  const qrText = `${rc}\t${lote}\t${
    estandar === "" ? cantidad : estandar
  }\t${unidad}\t${operacion}\t`;

  document.getElementById("tagNumPart").innerText = rc;
  document.getElementById("tagLot").innerText = lote;
  document.getElementById("tagQty").innerText =
    estandar === "" ? cantidad : estandar + " " + unidad;
  document.getElementById("tagOp").innerText = operacion;

  let secDate = "";

  // Asegúrate de que ambos valores sean numéricos antes de realizar la operación
  if (cantidadTotal !== "" && estandar !== "") {
    // Intenta convertir ambos valores a números flotantes
    let cantidadTotalNum = parseFloat(cantidadTotal);
    let estandarNum = parseFloat(estandar);

    // Verifica si las conversiones son válidas
    if (!isNaN(cantidadTotalNum) && !isNaN(estandarNum)) {
      // Realiza la operación solo si ambos son números válidos
      secDate = Math.ceil(cantidadTotalNum / estandarNum);
      document.getElementById("endDiv").innerHTML = secDate;
    } 
  }

  // Generar QR

  qrContainer.innerHTML = ""; // Limpiar el contenedor QR anterior
  new QRCode(qrContainer, {
    text: qrText,
    width: 128,
    height: 128,
  });
}

const llenarSelect = (opciones = []) => {
  const areaSelect = document.getElementById("area");
  areaSelect.innerHTML = "";
  opciones.forEach((opcion) => {
    const optionElement = document.createElement("option");
    optionElement.value = opcion.valor;
    optionElement.textContent = opcion.texto;
    areaSelect.appendChild(optionElement);
  });
};

const selectArea = () => {
  const area = document.getElementById("area").value;
  localStorage.setItem("area", area);
  console.log(window.localStorage);
};

const selectPlanta = () => {
  const planta = document.getElementById("planta").value;
  localStorage.setItem("planta", planta);
  viewPlantAndArea(planta);
  localStorage.setItem("area", getOptions(planta)[0].valor);
  viewLocalSettings();
  console.log(window.localStorage);
};

const viewPlantAndArea = (planta) => {
  llenarSelect(getOptions(planta));
};

const getOptions = (planta) => {
  switch (planta) {
    case "V1":
      return opcionesV1;
    case "V2":
      return opcionesV2;
    case "CA":
      return opcionesCA;
    case "HU":
      return opcionesHU;

    default:
      console.log("error: " + area);
      break;
  }
};

const getDateToCaducate = () => {
  const { caducidad, fecha } = getData();

  if (caducidad === "") {
    document.getElementById("caducidadDate").value = "";
    return;
  }
  let cadFecha = new Date();

  if (fecha !== "") {
    cadFecha = new Date(fecha);
  }

  cadFecha.setDate(cadFecha.getDate() + parseInt(caducidad) + 1);

  document.getElementById("caducidadDate").value =
    cadFecha.getDate() +
    "/" +
    (cadFecha.getMonth() + 1) +
    "/" +
    cadFecha.getFullYear();
};

const validateNumPart = () => {
  const rcInput = document.getElementById("rc");

  const rcValue = rcInput.value;
  const validationMessage = document.getElementById("validationMessage");
  if (rcValue === "") {
    validationMessage.textContent = "";
    return;
  }

  // Verifica si el valor está en la lista de datos
  if (numPartList.includes(rcValue)) {
    validationMessage.textContent = "El numero de parte si existe";
    validationMessage.style.color = "green";
    if (!rcInput.classList.contains("is-valid")) {
      rcInput.classList.add("is-valid");
      rcInput.classList.remove("is-invalid");
    }
  } else {
    validationMessage.textContent = "El numero de parte no existe";
    validationMessage.style.color = "red";
    if (!rcInput.classList.contains("is-invalid")) {
      rcInput.classList.add("is-invalid");
      rcInput.classList.remove("is-valid");
    }
  }
};

const removeClasses = () => {
  const validationMessage = document.getElementById("validationMessage");
  validationMessage.textContent = "";

  document.querySelectorAll("input").forEach(function (input) {
    input.classList.remove("is-invalid");
    input.classList.remove("is-valid");
  });
};

const showDate = () => {
  const { includedDate } = getData();

  // Formatea la fecha como dd/mm/aaaa
  var formattedDate = obtenerFechaActual();

  console.log(formattedDate);

  if (includedDate) {
    document.getElementById(
      "fechaView"
    ).innerHTML = `<h4><b>${formattedDate}</b></h4>`;
  } else {
    document.getElementById("fechaView").innerHTML = "";
  }
};

const showSec = () => {
  document.getElementById("secView").hidden =
    !document.getElementById("secView").hidden;
};

const obtenerFechaActual = () => {
  // Obtén la fecha actual
  var today = new Date();

  // Extrae el día, mes y año
  var day = String(today.getDate()).padStart(2, "0");
  var month = String(today.getMonth() + 1).padStart(2, "0"); // Enero es 0
  var year = today.getFullYear();

  // Formatea la fecha como dd/mm/aaaa
  var formattedDate = day + "/" + month + "/" + year;

  return formattedDate;
};
