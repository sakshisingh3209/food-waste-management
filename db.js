const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');

const mongoUrl = process.env.MONGODB_LOCAL_URL;


mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to MongoDb Server");
})

db.on('error', (err) => {
    console.log("MongoDb connection error", err);
});

db.on('disconnected', () => {
    console.log("MongoDb Server Disconnected");
});


module.exports = db;