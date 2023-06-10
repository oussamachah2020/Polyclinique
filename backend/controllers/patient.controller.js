const AsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Patient = require("../models/PatientModal");
const Facture = require("../models/FactureModal");
const RDV = require("../models/rendezVous.modal");
const Medecin = require("../models/MedecinModal");
const Ordonnance = require("../models/OrdonnanceModal");
const genToken = require("../utils/genToken");

const getMedecinPatients = AsyncHandler(async (req, res) => {
  const { _id: medecinID } = req.medecin;

  const now = new Date(); // get current date and time

  const medecinRDVS = await RDV.aggregate([
    { $match: { medecinID } }, // filter by medecinID
    {
      $group: {
        _id: "$patientID", // group by patientID
        rdvs: {
          $push: {
            _id: "$_id",
            date: "$date",
            heure: "$heure",
            typeService: "$typeService",
          },
        },
      },
    },
    {
      $project: {
        rdvs: { $slice: ["$rdvs", -1] }, // select only the latest appointment
      },
    },
    {
      $lookup: {
        from: "patients",
        localField: "_id",
        foreignField: "_id",
        as: "patient",
      },
    }, // join with patients collection
    { $unwind: "$patient" }, // destructure patient array
    // { $match: { "rdvs.date": { $lte: new Date() } } }, // filter out appointments that have not yet occurred
    { $sort: { "rdvs.date": -1 } }, // sort rdvs array by date in descending order
  ]);

  console.log("medecin rdvs", medecinRDVS);

  const patients = medecinRDVS.map(({ patient, rdvs }) => {
    console.log("rdvs", rdvs);
    return {
      patient,
      rdv: rdvs[0],
    };
  });
  // rename rdvs to rdv

  console.log("patients", patients);

  res.status(200).json(patients);
});
// get all patients
const getAllPatients = async (req, res) => {
  // res.status(200).json("get all patients");
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (error) {
    console.log("errorr get all patients", error);
    res.status(500).json(error);
  }
};

const deletePatient = AsyncHandler(async (req, res) => {
  const { patientID } = req.params;
  await Patient.findByIdAndDelete(patientID);
  return res.status(200).json({ message: "Patient supprimé avec success" });
});

// get patient profile

const getPatientProfile = (req, res) => {
  return res.status(200).json(req.patient);
};
const getPatientData = async (req, res) => {
  const { patientID } = req.params;
  const patient = await Patient.findById(patientID);
  if (!patient) return res.status(404).json({ message: "Patient introuvable" });
  return res.status(200).json(patient);
};

const register = AsyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, CIN, dateOfBirth, phone } =
    req.body;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const patientExist = await Patient.findOne({ email, phone });

  if (patientExist) {
    return res.status(409).json({ message: "Patient Already Exist" });
  }

  const patient = await Patient.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    CIN,
    dateOfBirth,
    phone,
  });
  if (patient) {
    const token = genToken(patient._id, "patient");
    return res.status(201).json(token);
  }
});

const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const patient = await Patient.findOne({ email })?.lean();
  if (!patient) {
    return res
      .status(404)
      .json({ message: "Aucun patient n'existe avec cet email" });
  }

  const matchingPassword = await bcrypt.compare(password, patient.password);
  if (!matchingPassword)
    return res.status(401).json({ message: "Mot de passe incorrect" });

  const token = genToken(patient._id, "patient");
  return res.status(200).json(token);
});

const updatePatientProfile = async (req, res) => {
  const { firstName, lastName, email, phone, currentPassword, newPassword } =
    req.body;
  const { _id: patientID } = req.patient;

  try {
    let patient = await Patient.findById(patientID);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Update basic profile fields
    patient.firstName = firstName;
    patient.lastName = lastName;
    patient.email = email;
    patient.phone = phone;

    if (currentPassword && newPassword) {
      // Password change requested
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        patient.password
      );

      if (!isPasswordMatch) {
        return res
          .status(400)
          .json({ message: "Mot de passe actuel incorrect" });
      }

      // Hash and update the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      patient.password = hashedPassword;
    }

    // Save the updated patient profile
    patient = await patient.save();

    return res.json({ message: "Profil mis à jour avec succès", patient });
  } catch (error) {
    console.log("Error updating profile:", error);
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la mise à jour du profil",
    });
  }
};

module.exports = {
  register,
  login,
  getAllPatients,
  getMedecinPatients,
  getPatientProfile,
  deletePatient,
  getPatientData,
  updatePatientProfile,
};
