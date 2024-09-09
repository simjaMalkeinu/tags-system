function generateTags() {
  // Tamaño de la página en milímetros (4x2.5 pulgadas a milímetros)
  const pageWidth = 101;
  const pageHeight = 50.8;
  const code = 65;
  const margins = { top: 2, right: 0, bottom: 0, left: 2 };

  // tamaño del qr
  const qrSize = 35;

  if (!validateForm()) {
    return;
  }

  const {
    rc,
    lote,
    cantidad,
    cantidadTotal,
    operacion,
    estandar,
    folio,
    unidad,
    qrContainer,
    caducidadDate,
    includedDate,
    includedSec,
    observaciones,
    fechaReceive
  } = getData();

  const validateRC = rc.length < 10 ? true : false;

  // Crea un nuevo documento PDF con tamaño personalizado y sin márgenes
  const doc = new jspdf.jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [pageWidth, pageHeight],
  });

  if (folio !== "") {
    let num = folio;
    num = num.split("-");
    console.log(num[1]);
  }

  let prefijo = localStorage.getItem("area");

  let invoice = parseInt(localStorage.getItem("Invoice"), 10);

  let cont = 0;

  let cantEtiquetas = 0;
  let res = 0;

  let secuencia = 1;

  if (cantidad === "" && cantidadTotal !== "") {
    cantEtiquetas = Math.ceil(
      parseFloat(cantidadTotal, 10) / parseFloat(estandar, 10)
    );
    res = parseFloat(cantidadTotal, 10);
  } else if (cantidadTotal === "" && cantidad !== "") {
    cantEtiquetas = 1;
    res = parseFloat(cantidad, 10);
  }

  for (let i = invoice; i < invoice + cantEtiquetas; i++) {
    // Limpia el contenedor QR para cada nueva generación
    qrContainer.innerHTML = "";

    // Formatear los datos en el formato deseado
    let qrText = "";
    // const qrText = `RC:${rc}\t LOTE:${lote}\t CANTIDAD:${cantidad}\t operacion:${operacion};`;

    if (cantidadTotal !== "") {
      qrText = `${rc}\t ${lote}\t ${
        res >= estandar ? estandar : res
      }\t ${unidad}\t ${operacion}\t`;
    } else {
      qrText = `${rc}\t ${lote}\t ${cantidad}\t ${unidad}\t ${operacion}\t`;
    }

    folio !== "" ? (cont += 1) : null;

    let fj = obtenerFechaJuliana(today);
    let foliotext = "";

    let QRInfo = "";

    if (folio !== "") {
      //console.log(eval(num[1]) + i);
      QRInfo = `${folio}-${String.fromCharCode(code + cont)}\t ${qrText}`;
      foliotext = `${folio}-${String.fromCharCode(code + cont)}`;
    } else {
      // Agrega un identificador único al texto del QR para cada caja
      QRInfo = `${prefijo}${fj}-${(i + 1)
        .toString()
        .padStart(4, "0")}\t ${qrText}`;
      foliotext = `${prefijo}${fj}-${(i + 1).toString().padStart(3, "0")}`;
    }

    new QRCode(qrContainer, {
      text: QRInfo,
      width: 128,
      height: 128,
    });

    const canvas = qrContainer.querySelector("canvas");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      // Asegúrate de crear el objeto `doc` de jsPDF fuera de este bucle si aún no está creado.
      // Agrega una nueva página para cada caja, excepto para la primera
      if (i > invoice) doc.addPage([pageWidth, pageHeight], "landscape");

      // El resto de tu código para dibujar en el documento PDF aquí...
      // Añade el texto y el QR en cada página
      doc.setFontSize(12);

      let titleTag = validateRC ? "RC:" : "UEPS:";
      const fontSizeTag = 12;
      // Datos de la etiqueta
      var tagInfo = [
        [
          {
            content: titleTag + " " + rc,
            colSpan: 2,
            styles: { fontStyle: "bold", fontSize: fontSizeTag },
          },
        ],
        [
          {
            content: "Lote:",
            styles: {
              fontStyle: "normal",
              fontSize: fontSizeTag,
              halign: "right",
            },
          },
          {
            content: lote,
            styles: { fontStyle: "bold", fontSize: fontSizeTag },
          },
        ],
      ];

      if (cantidadTotal !== "") {
        tagInfo.push([
          {
            content:
              res >= estandar
                ? "Cantidad: " + estandar + " " + unidad
                : "Cantidad: " + res + " " + unidad,
            colSpan: 2,
            styles: { fontStyle: "bold", fontSize: fontSizeTag },
          },
        ]);
      } else if (cantidad !== "") {
        tagInfo.push([
          {
            content: "Cantidad: " + res + " " + unidad,
            colSpan: 2,
            styles: { fontStyle: "bold", fontSize: fontSizeTag },
          },
        ]);
      }

      operacion !== ""
        ? tagInfo.push([
            {
              content: "Operación:",
              styles: {
                fontStyle: "normal",
                fontSize: fontSizeTag,
                halign: "right",
              },
            },
            {
              content: operacion,
              styles: { fontStyle: "bold", fontSize: fontSizeTag },
            },
          ])
        : null;

      caducidadDate !== ""
        ? tagInfo.push([
            {
              content: "CAD: " + caducidadDate,
              colSpan: 2,
              styles: { fontStyle: "bold", fontSize: fontSizeTag },
            },
          ])
        : null;

      includedDate
        ? tagInfo.push([
            {
              content: "FECHA: " + obtenerFechaImp(fechaReceive),
              colSpan: 2,
              styles: { fontStyle: "bold", fontSize: fontSizeTag - 2 },
            },
          ])
        : null;

      // Usar autoTable para crear la tabla
      doc.autoTable({
        // theme: "plain", // Aplicar el tema "plain"
        theme: "grid",
        body: tagInfo,
        startY: margins.top,
        margin: margins,
        tableWidth: 55,
        styles: {
          halign: "center",
          textColor: [0, 0, 0],
          // lineColor: [0, 0, 255], // Color de línea (azul)
          // lineWidth: 0.1, // Ancho de línea (mínimo para que no se vea) },
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: operacion === "" ? 18 : 26 },
          1: { cellWidth: operacion === "" ? 37 : 29 },
        },
      });

      // Incluye el identificador único también en el texto que se añade al PDF
      doc.addImage(imgData, "PNG", 60, 2, qrSize, qrSize); // Añade el QR generado al PDF

      doc.setFontSize(10);
      doc.text("Nomina", 60, 41);
      // Ajusta estas coordenadas según sea necesario para eliminar los márgenes no deseados
      doc.rect(60, 42, 16, 7);

      // Añade el texto y el QR en cada página
      doc.setFontSize(10);
      doc.text(foliotext, 78, 46.5); // Asegúrate de ajustar estas coordenadas según tus necesidades

      if (includedSec) {
        const leyenda = `${
          secuencia + " de " + cantEtiquetas
        } / ${observaciones}`;
        const longitud = Math.ceil(leyenda.length / 2);
        const centrado = Math.ceil(57 / 2 - longitud) - 5;

        console.log(leyenda, leyenda.length, longitud, centrado);

        doc.text(leyenda, centrado, 48);
        // doc.text(`${"Observaciones: " + observaciones}`, 2, 48);
      }
    }
    res = res - parseFloat(estandar, 10);
    secuencia += 1;
  }

  localStorage.setItem("Invoice", invoice + parseInt(cantEtiquetas, 10));

  // Guarda o descarga el PDF al finalizar el bucle
  doc.save(`TAGS-${rc}${operacion}.pdf`);
  const text = validateRC ? " el RC " : "la CLAVE UEPS ";
  showAlert(
    "Etiquetas generadas exitosamente con " +
      text +
      "<strong>" +
      rc +
      "</strong>",
    "success"
  );
}
