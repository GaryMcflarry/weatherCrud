const mongoose = require('mongoose');

// const userSchema = mongoose.Schema({
//     _id: mongoose.Schema.Types.ObjectId,
//     username: {type: String, required: true, unique: true},
//     password: {type: String, required: true},
//     admin: {type: Boolean, required: true},
//     locations: {type: [String], defaults: ['Default Location']},
//     dateCreated: Date
// })

const userSchema_ = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    admin: {type: Boolean},
    locations: {type: [String]},
    dateCreated: Date
})


module.exports = mongoose.model('User', userSchema_);