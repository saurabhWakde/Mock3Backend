const mongoose = require('mongoose');

const classifiedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  location: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
  price: { type: Number, required: true },
});

module.exports = mongoose.model('Classified', classifiedSchema);
