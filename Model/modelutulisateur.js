const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  date_naissance: { type: Date, required: true },
  telephone: { type: String },
  adresse: {type:String,require:true},
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
  ]
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('mot_de_passe')) return next();
  
    const salt = await bcrypt.genSalt(10);
    this.mot_de_passe = await bcrypt.hash(this.mot_de_passe, salt);
    next();
  });
module.exports = mongoose.model('User', UserSchema);
