const express = require('express');

const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./Routes/Routes');
const connectDB = require('./Connection/connection');
const cors = require('cors');

// Connexion à la base de données
connectDB();
const app = express();
app.use(cors());

// Middleware pour analyser les données JSON
app.use(express.json());

// Routes des utilisateurs
app.use('/api', userRoutes);

// Définir le port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});