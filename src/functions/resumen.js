const connectDB = require("../database/database");
const { toLocalISOString } = require("../functions/utils");

async function getSumMonth() {
  client = await connectDB();
  const database = client.db("Gateway");
  const cliente = database.collection("transaction");
  let result;
  try {
    const ahora = new Date();

    // Mes actual
    const mesActualInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const mesActualFin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);

    // Mes anterior
    const mesAnteriorInicio = new Date(
      ahora.getFullYear(),
      ahora.getMonth() - 1,
      1
    );
    const mesAnteriorFin = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

    // Dos meses antes del actual
    const dosMesesAntesInicio = new Date(
      ahora.getFullYear(),
      ahora.getMonth() - 2,
      1
    );
    const dosMesesAntesFin = new Date(
      ahora.getFullYear(),
      ahora.getMonth() - 1,
      0
    );

    // Formatear las fechas para MongoDB (ISO 8601)
    mesActualInicio.setHours(4, 59, 59, 999);
    mesActualFin.setHours(28, 59, 59, 999);
    const formatoInicioMesActual = toLocalISOString(mesActualInicio); //.toISOString();
    const formatoFinMesActual = toLocalISOString(mesActualFin); //.toISOString();

    mesAnteriorInicio.setHours(4, 59, 59, 999);
    mesAnteriorFin.setHours(28, 59, 59, 999);
    const formatoInicioMesAnterior = toLocalISOString(mesAnteriorInicio); //mesAnteriorInicio.toISOString();
    const formatoFinMesAnterior = toLocalISOString(mesAnteriorFin); //mesAnteriorFin.toISOString();

    dosMesesAntesInicio.setHours(4, 59, 59, 999);
    dosMesesAntesFin.setHours(28, 59, 59, 999);
    const formatoInicioDosMesesAntes = toLocalISOString(dosMesesAntesInicio); //.toISOString();
    const formatoFinDosMesesAntes = toLocalISOString(dosMesesAntesFin); //.toISOString();
    const totales = {
      BANCOLOMBIA_TRANSFER: { lastMonth: 0, thisMonth: 0, lastTwoMonth: 0 },
      PSE: { lastMonth: 0, thisMonth: 0, lastTwoMonth: 0 },
    };

    // Función para sumar por método de pago y periodo
    const sumarPorMetodoYPeriodo = async (fechaInicio, fechaFin, periodo) => {
      const transacciones = await cliente
        .aggregate([
          {
            $match: {
              "data.transaction.created_at": {
                $gte: fechaInicio,
                $lte: fechaFin,
              },
              "data.transaction.status": "APPROVED",
            },
          },
          {
            $group: {
              _id: "$data.transaction.payment_method_type",
              totalAmount: { $sum: "$data.transaction.amount_in_cents" },
            },
          },
        ])
        .toArray();
      transacciones.forEach((resultado) => {
        totales[resultado._id][periodo] = resultado.totalAmount;
      });
      // console.log(counttran, periodo);
    };

    // Sumar para los diferentes periodos
    await sumarPorMetodoYPeriodo(
      formatoInicioMesAnterior,
      formatoFinMesAnterior,
      "lastMonth"
    );
    await sumarPorMetodoYPeriodo(
      formatoInicioMesActual,
      formatoFinMesActual,
      "thisMonth"
    );
    await sumarPorMetodoYPeriodo(
      formatoInicioDosMesesAntes,
      formatoFinDosMesesAntes,
      "lastTwoMonth"
    );

    result = {
      PSE: totales["PSE"],
      Bancolombia: totales["BANCOLOMBIA_TRANSFER"],
    };
  } catch (error) {
    console.error("error " + error);
    return error;
  } finally {
    if (client) {
        console.log("Cerrando cliente");
        await client.close();
    }
    return result;
  }
}

module.exports = { getSumMonth };
