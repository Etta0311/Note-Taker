const express = require('express');

const notetaker = require("./notetaker");
const app = express();

app.use("/notes", notetaker);

module.exports = app;