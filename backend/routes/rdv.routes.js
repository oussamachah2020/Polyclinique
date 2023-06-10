const express = require("express");
const {
  deleteRDV,
  addRDV,
  getMedecinFutureRDVS,
  getMedecinRDVS,
  getAllRDVS,
  getDoctorPastRDVS,
} = require("../controllers/rdv.controller");
const patientAuth = require("../Middleware/patientAuthMiddleware");
const medecinAuth = require("../Middleware/medecinAuthMiddleware");
const adminAuth = require("../Middleware/adminAuthMiddleware");
const { getMedecinPastRDVS } = require("../controllers/medecin.controller");
const adminMedecinAuth = require("../Middleware/adminMedecinMiddleware");
const route = express.Router();

route.get("/all", adminAuth, getAllRDVS);

route.post("/", patientAuth, addRDV);
route.delete("/:id", deleteRDV);

route.get("/medecin/past", medecinAuth, getDoctorPastRDVS);
route.get("/medecin/future", medecinAuth, getMedecinFutureRDVS);

route.get("/medecin", medecinAuth, getMedecinRDVS);

route.get("/medecin/:idDoctor/future", adminAuth, getMedecinFutureRDVS);
route.get("/medecin/:idDoctor/past", adminAuth, getMedecinPastRDVS);
route.get("/medecin/:idDoctor", adminAuth, getMedecinRDVS);

module.exports = route;
