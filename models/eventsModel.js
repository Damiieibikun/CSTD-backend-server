const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, 
    location: { type: String, required: true },
    flyer: { type: String, required: true }, 
  },
  { timestamps: true }
);

const eventsModel =  mongoose.model("Event", eventSchema);
module.exports = eventsModel
