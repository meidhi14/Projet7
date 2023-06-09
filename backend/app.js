const express = require("express");
const mongoose = require("mongoose");
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/user");
const path = require("path");

const app = express();

// --- Connection à la base de donnée ---
mongoose
  .connect(
    "mongodb+srv://meidhi:12345@cluster0.byaksxe.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// --- les CORS ---
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// --- Utiliser les requêtes json ---
app.use(express.json());

// --- Utilisation du router bookRoutes ---
app.use("/api/books", bookRoutes);

// --- Utilisation du router userRoutes ---
app.use("/api/auth", userRoutes);

// --- Utilisation des fichier static ---
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
