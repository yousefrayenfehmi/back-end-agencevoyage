const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./Routes/Routes');
const connectDB = require('./Connection/connection');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
// Connexion à la base de données
const app = express();
app.use(cors());
connectDB();
app.use(session({
  secret: process,  // Utilisez une clé secrète pour sécuriser les sessions
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Assurez-vous que secure est false pour les environnements locaux non HTTPS
}));

// Initialiser Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour analyser les données JSON
app.use(express.json());

// Routes des utilisateurs
app.use('/api', userRoutes);

// Définir le port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});