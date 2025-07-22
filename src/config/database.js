const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect("mongodb+srv://gautamupadhyay142000:8959491188@cluster0.otvloda.mongodb.net/devTinder")
}

module.exports = connectDB;