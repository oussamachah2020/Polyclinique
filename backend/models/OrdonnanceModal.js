const mongoose = require("mongoose");

const ordonnanceSchema = mongoose.Schema({
  rdv: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "rendezvous",
    required: true,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
  description: {
    type: String,
    required: false,
  },
  medicaments: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      methodOfUse: {
        type: String,
        required: true,
      },
    },
  ],
});

const Ordonnance = mongoose.model("ordonnances", ordonnanceSchema);

module.exports = Ordonnance;
