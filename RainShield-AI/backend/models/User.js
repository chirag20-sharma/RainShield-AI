// User model
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  // Define user schema here
});
module.exports = mongoose.model('User', userSchema);