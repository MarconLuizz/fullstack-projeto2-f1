const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    champion: { type: String, required: true },
    team: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Season", seasonSchema);
