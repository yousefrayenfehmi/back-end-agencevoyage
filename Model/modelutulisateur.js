const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schéma pour les utilisateurs classiques
const UserSchema = new mongoose.Schema({
  nom: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  mot_de_passe: { type: String, required: false },
  date_naissance: { type: Date, required: false },
  telephone: { type: String },
  adresse: { type: String, required: false },
  date_inscription: { type: Date, default: Date.now },
  statut: { type: String, enum: ['actif', 'inactif'], default: 'actif' },
  roles: { type: [String], default: ['utilisateur'] },
  historique_reservations: [
    {
      reservation_id: mongoose.Schema.Types.ObjectId,
      type: String,
      date_reservation: Date,
      details: mongoose.Schema.Types.Mixed
    }
  ],
  googleId: { type: String },  // Ajout de googleId pour l'authentification Google
  photo: { type: String },     // Ajout de photo pour l'utilisateur Google
  google: { type: Boolean, default: false } // Indicateur si l'utilisateur s'est inscrit via Google
});

// Hashage du mot de passe avant de sauvegarder un utilisateur classique
UserSchema.pre('save', async function (next) {
  if (!this.isModified('mot_de_passe')) return next();

  const salt = await bcrypt.genSalt(10);
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
  next();
});

// Exportation du modèle
module.exports = mongoose.model('User', UserSchema);

// Schéma pour les utilisateurs Google


// Hashage du mot de passe avant de sauvegarder un utilisateur classique
UserSchema.pre('save', async function (next) {
  if (!this.isModified('mot_de_passe')) return next();

  const salt = await bcrypt.genSalt(10);
  this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
  next();
});

// Exportation des modèles
module.exports =  mongoose.model('User', UserSchema);
 

