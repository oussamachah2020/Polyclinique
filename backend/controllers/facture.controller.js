const AsyncHandler = require("express-async-handler");
const Facture = require("../models/FactureModal");
const RDV = require("../models/rendezVous.modal");

// post facture
const postFacture = AsyncHandler(async (req, res) => {
  const { rdv } = req.body;

  try {
    const dejaFacturé = await Facture.findOne({ rdv });
    console.log("facture found", dejaFacturé);
    if (dejaFacturé)
      return res.status(400).json({ message: "Rendez vous deja facturé" });
    const facture = await Facture.create(req.body);
    res.status(201).json(facture);
  } catch (error) {
    console.log("eroor facture ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// delete ordonnance
const deleteFacture = AsyncHandler(async (req, res) => {
  const { _id } = req.params;
  try {
    const deletedFacture = await Facture.findByIdAndDelete(_id);
    if (deletedFacture) {
      res.status(200).json({ message: "Facture deleted successfully" });
    } else {
      res.status(404).json({ message: "Facture not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Server error" });
  }
});

// get patient factures
const getPatientFactures = AsyncHandler(async (req, res) => {
  const { isPaid } = req.query;
  const patientID = req.patient ? req.patient._id : req.params.idPatient;
  const queryFilter =
    isPaid === undefined
      ? {
          rdv: { $in: await RDV.find({ patient: patientID }) },
        }
      : {
          isPaid,
          rdv: { $in: await RDV.find({ patient: patientID }) },
        };
  try {
    const factures = await Facture.find(queryFilter)
      // .populate("rdv", "-factures") // Populate the RDV field excluding the factures
      // .populate("rdv.medecin")
      .populate({
        path: "rdv",
        select: "-factures",
        populate: {
          path: "medecin",
          select: "firstName lastName",
        },
      }) // Populate the medecin field of the RDV
      .sort({ createdAt: -1 });
    return res.json(factures);
  } catch (error) {
    console.log("error get factures", error);
    return res.status(500).json(error);
  }
});
const getDoctorFactures = AsyncHandler(async (req, res) => {
  const { _id: medecinID } = req.medecin;

  try {
    const factures = await Facture.find({
      rdv: { $in: await RDV.find({ medecin: medecinID }) },
    })
      .populate({
        path: "rdv",
        select: "-facture",
        populate: {
          path: "patient",
          select: "firstName lastName phone",
        },
      }) // Populate the medecin field of the RDV
      .sort({ createdAt: -1 });
    return res.json(factures);
  } catch (error) {
    console.log("error get doctor factures", error);
    return res.status(500).json(error);
  }
});

const updateFacture = async (req, res) => {
  const { factureID } = req.params;
  try {
    const updatedFacture = await Facture.findByIdAndUpdate(factureID, req.body);
    res.status(200).json(updatedFacture);
  } catch (error) {
    console.log("error update facture", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getFacture = AsyncHandler(async (req, res) => {
  const { factureID } = req.params;

  try {
    const facture = await Facture.findById(factureID)
      .populate({
        path: "rdv",
        select: "-factures",
        populate: [
          { path: "patient", select: "firstName lastName phone email" },
          { path: "medecin", select: "firstName lastName email phone" },
        ],
      })
      .sort({ createdAt: -1 });

    if (!facture)
      return res.status(404).json({ message: "Facture non trouvé" });
    return res.json(facture);
  } catch (error) {
    console.log("error get facture", error);
    return res.status(500).json(error);
  }
});
const getAllFactures = AsyncHandler(async (req, res) => {
  try {
    const factures = await Facture.find()
      .populate({
        path: "rdv",
        select: "-facture",
        populate: [
          { path: "patient", select: "firstName lastName phone email" },
          { path: "medecin", select: "firstName lastName email phone" },
        ],
      })
      .sort({ createdAt: -1 });

    return res.json(factures);
  } catch (error) {
    console.log("error get all factures", error);
    return res.status(500).json(error);
  }
});

module.exports = {
  postFacture,
  deleteFacture,
  getPatientFactures,
  getDoctorFactures,
  updateFacture,
  getFacture,
  getAllFactures,
};
