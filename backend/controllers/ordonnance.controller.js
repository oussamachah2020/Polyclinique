const Ordonnance = require("../models/OrdonnanceModal");
const AsyncHandler = require("express-async-handler");
const RDV = require("../models/rendezVous.modal");
// get patient ordonnances

const getPatientOrdonnances = async (req, res) => {
  const { _id: patientID } = req.patient;
  console.log("get ordonnances hit");

  try {
    const ordonnances = await Ordonnance.find({
      rdv: { $in: await RDV.find({ patient: patientID }) },
    })
      .populate({
        path: "rdv",
        select: "-ordonnances",
        populate: {
          path: "medecin",
          select: "firstName lastName phone",
        },
      }) // Populate the medecin field of the RDV
      .sort({ date: -1 });
    return res.json(ordonnances);
  } catch (error) {
    console.log("error get doctor factures", error);
    return res.status(500).json(error);
  }
};

const getMedecinOrdonnances = AsyncHandler(async (req, res) => {
  const { _id: medecinID } = req.medecin;

  try {
    const ordonnances = await Ordonnance.find({
      rdv: { $in: await RDV.find({ medecin: medecinID }) },
    })
      .populate({
        path: "rdv",
        select: "-ordonnances",
        populate: {
          path: "patient",
          select: "firstName lastName phone",
        },
      }) // Populate the medecin field of the RDV
      .sort({ date: -1 });
    return res.json(ordonnances);
  } catch (error) {
    console.log("error get doctor factures", error);
    return res.status(500).json(error);
  }
});

// ajouter une ordonnance
const addOrdonnance = async (req, res) => {
  const { rdv, description, medicaments } = req.body;

  if (!rdv)
    return res.status(400).json({ message: "Non rendez vous selectionné" });
  if (!medicaments)
    return res
      .status(400)
      .json({ message: "Les medicaments sonts obligatoires" });
  try {
    await Ordonnance.create({
      rdv,
      description,
      medicaments,
    });

    res.status(201).json({ message: "Ordonnance envoyé avec success" });
  } catch (error) {
    console.log("erooor", error);
    res.status(500).json(error);
  }
};
// delete ordonnance
const deleteOrdonnance = async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedOrdonnance = await Ordonnance.findByIdAndDelete(_id);
    if (deletedOrdonnance) {
      res.status(200).json({ message: "Ordonnance deleted successfully" });
    } else {
      res.status(404).json({ message: "Ordonnance not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPatientOrdonnances,
  deleteOrdonnance,
  getMedecinOrdonnances,
  addOrdonnance,
};
