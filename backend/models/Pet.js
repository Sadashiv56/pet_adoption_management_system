const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String },
  age: { type: Number },
  description: { type: String },
  status: { type: String, enum: ['available','adopted','pending'], default: 'available' },
  photo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);
