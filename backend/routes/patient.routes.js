const express = require("express");
const route = express.Router();
const {
  register,
  login,
  getAllPatients,
  getPatientProfile,
  deletePatient,
  getPatientData,
  updatePatientProfile,
} = require("../controllers/patient.controller");
const patientAuth = require("../Middleware/patientAuthMiddleware");
const medecinAuth = require("../Middleware/medecinAuthMiddleware");
const {
  getPatientOrdonnances,
} = require("../controllers/ordonnance.controller");
const { getPatientRDVS } = require("../controllers/rdv.controller");
const { getPatientFactures } = require("../controllers/facture.controller");
const adminAuth = require("../Middleware/adminAuthMiddleware");

route.get("/all", adminAuth, getAllPatients);
route.get("/", patientAuth, getPatientProfile);
route.put("/", patientAuth, updatePatientProfile);

route.get("/factures", patientAuth, getPatientFactures);
route.get("/ordonnances", patientAuth, getPatientOrdonnances);
route.get("/rdvs", patientAuth, getPatientRDVS);
route.post("/register", register).post("/login", login);

route.get("/:idPatient/factures", adminAuth, getPatientFactures);

route.get("/:patientID", adminAuth, getPatientData);
route.delete("/:patientID", adminAuth, deletePatient);

route.get("/:idPatient/rdvs", adminAuth, getPatientRDVS);
// get all patients

module.exports = route;
