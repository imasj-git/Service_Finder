const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema); 