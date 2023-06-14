const mongoose = require("mongoose");

const medecinSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "departements",
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: false,
  },
});

const Medecin = mongoose.model("medecins", medecinSchema);

module.exports = Medecin;
