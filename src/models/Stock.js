const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: String,
  price: Number,
  date: Date
});

module.exports = mongoose.model('Stock', stockSchema);
