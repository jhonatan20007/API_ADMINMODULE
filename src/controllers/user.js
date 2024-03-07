const express = require("express");
const router = express.Router();
const { getUsuarios,getConfigEmpresa } = require("../functions/user");
router.get("/", function (req, res) {
  res.send({ mensaje: "¡Hola Mundo desde user!" });
});
//[GET] /user/getUsuarios
router.get("/getUsuarios", function (req, res) {
  var email = req.query.email;
  var pss = req.query.pss;
  getUsuarios({ Email: email, Password: pss })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send({ error: error.message });
    });
});

//[GET] /user/getconfigempresa
router.get("/getconfigempresa/:id", function (req, res) {
    var idcliente = req.params.id;
    getConfigEmpresa({idcliente: idcliente})
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send({ error: error.message });
      });
  });

module.exports = router;
