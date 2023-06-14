const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RdvSchema = mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    hour: {
      type: String,
      required: true,
    },
    medecin: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "medecins",
    },
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "patients",
      required: true,
    },
    facture: {
      type: Schema.Types.ObjectId,
      ref: "factures",
    },
    ordonnances: [
      {
        type: Schema.Types.ObjectId,
        ref: "ordonnances",
      },
    ],
  },
  { timestamps: true }
);

const RDV = mongoose.model("rendezvous", RdvSchema);

module.exports = RDV;
