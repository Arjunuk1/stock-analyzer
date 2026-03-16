const express = require("express");
const path = require("path");
const stockRoutes = require("./routes/stockRoutes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api", stockRoutes);

module.exports = app;