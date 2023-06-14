const asyncHandler = require("express-async-handler");
const RDV = require("../models/rendezVous.modal");

const addRDV = asyncHandler(async (req, res) => {
  const { medecinID, date, hour } = req.body;
  if (!medecinID || !date || !hour) {
    return res
      .status(400)
      .json({ message: "Les données ne sont pas suffisantes" });
  }

  const { _id: patientID } = req.patient;

  try {
    // Check if there is already a rendezvous at the requested hour on the requested day
    const existingRDV = await RDV.findOne({ medecin: medecinID, date, hour });
    if (existingRDV) {
      return res
        .status(400)
        .json({ message: "La plage horaire demandée est déjà réservée" });
    }

    await RDV.create({
      patient: patientID,
      medecin: medecinID,
      date: new Date(date).toISOString(), // Convert the date to a string in ISO format
      hour,
    });

    res.status(201).json({ message: "Rendez-vous pris avec succès" });
  } catch (error) {
    res.status(500).json(error);
  }
});

const deleteRDV = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedrdv = await RDV.findByIdAndDelete(id);

  if (deletedrdv) {
    res.status(200).json({ msg: "rendez-vous supprimé" });
  }
});

const getMedecinFutureRDVS = async (req, res) => {
  console.log("future rdvs hit");
  const medecinID = req.medecin ? req.medecin._id : req.params.idDoctor;
  try {
    const futureRDVS = await RDV.find({
      medecin: medecinID,
      date: { $gte: new Date() },
    })
      .populate("patient", "lastName firstName phone")
      .sort({ date: 1 });

    console.log("future rdvs", futureRDVS);
    return res.status(200).json(futureRDVS);
  } catch (error) {
    console.log("erroor", error);
    return res.status(500).json(error);
  }
};
const getMedecinRDVS = async (req, res) => {
  console.log("medecin rdvs hit");
  const medecinID = req.medecin ? req.medecin._id : req.params.idDoctor;
  console.log("medecin id", medecinID);
  try {
    const rdvs = await RDV.find({
      medecin: medecinID,
    }).populate("patient", "lastName firstName phone");

    console.log("rdvs", rdvs);

    return res.status(200).json(rdvs);
  } catch (error) {
    console.log("erroor", error);
    return res.status(500).json(error);
  }
};

const getDoctorPastRDVS = async (req, res) => {
  console.log("get doctor past rdvs hit");
  const medecinID = req.medecin ? req.medecin._id : req.params.idDoctor;

  const currentDate = new Date();

  try {
    const rdvs = await RDV.find({
      medecin: medecinID,
      date: { $lt: currentDate },
    })

      .populate("patient", "lastName firstName phone")
      .sort({ date: -1 });

    return res.status(200).json(rdvs);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json(error);
  }
};
const getPatientRDVS = async (req, res) => {
  const { idPatient } = req.params;
  const patientIDToQuery = req.patient ? req.patient._id : idPatient;
  try {
    const rdvs = await RDV.find({
      patient: patientIDToQuery,
    })
      .populate("medecin", "lastName firstName")
      .sort({ date: 1 });

    return res.status(200).json(rdvs);
  } catch (error) {
    console.log("erroor", error);
    return res.status(500).json(error);
  }
};

const getAllRDVS = async (req, res) => {
  try {
    const rdvs = await RDV.find()
      .populate("medecin", "lastName firstName")
      .populate("patient", "firstName lastName")
      .sort({ date: -1 });

    return res.status(200).json(rdvs);
  } catch (error) {
    console.log("erroor", error);
    return res.status(500).json(error);
  }
};

module.exports = {
  getAllRDVS,
  deleteRDV,
  addRDV,
  getMedecinFutureRDVS,
  getMedecinRDVS,
  getPatientRDVS,
  getDoctorPastRDVS,
};
