const express = require("express");
const router = express.Router();
const { getSumMonth } = require("../functions/resumen");

router.get("/", function (req, res) {
  res.send({ mensaje: "¡Hola Mundo desd resumen!" });
 
});
//[Get] /resumen/getSumMonth
router.get("/getSumMonth", function (req, res) {
    // res.send({ mensaje: "¡Hola Mundo desd resumen!" });
      getSumMonth()
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send({ error: error.message });
      });
  });


module.exports = router;
