const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userName: {type: String, required: true, min: 6, max: 255, default: null},
    email: {type: String, unique: true, required: true, min: 6, max: 1024},
    password: {type: String, required: true, minlength: 6},
    token: {type: String}
});

module.exports = mongoose.model("User", UserSchema);