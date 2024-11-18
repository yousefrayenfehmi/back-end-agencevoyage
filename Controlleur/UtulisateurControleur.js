const express = require('express');
const User = require('../Model/modelutulisateur');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { use } = require('../Routes/Routes');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../.env'});
exports.regesterUser=async(req,res)=>{
    const { nom, email, mot_de_passe, date_naissance,telephone,adresse } = req.body;
    try{
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({
        nom,
        email,
        mot_de_passe,
        date_naissance,
        telephone,
        adresse
      });
    await user.save()
    res.json({ msg: 'User registered successfully' });
}
    catch (err) {
        res.status(500).send('Server error');
      }
}

exports.loginUser=async(req,res)=>{
        
        const {email,mot_de_passe}=req.body
        console.log(email,mot_de_passe);
        
        try {
            let user=await User.findOne({email})
            console.log(user);
            
            if(!user) return res.status(400).json({ msg: 'Invalid credentials' });
            const isMatch = await bcrypt.compare("larou@123", user.mot_de_passe);
            console.log(isMatch);
            
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
            const payload = { user: { id: user.id } };
            console.log(payload);
            
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ data:user,token });
    });
 } catch (error) {
            res.status(500).send('Server error');
        }

}
exports.deleteUser=async(req,res)=>{
      
      try {
          let user=User.findByIdAndDelete(req.params.id)
          if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
          }
          res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
      } catch (error) {
        res.status(500).send('Server error');

      }
}
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
  }
};
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yousseffehmi98@gmail.com',
    pass: 'bqqj cspn rlbb xddu',
  },
});
exports.Changepassword=async(req,res)=>{
    const {email}=req.body
    console.log(email);
    
    try {
      const user=await User.find({email})
      if(!user){
              res.status(401).json('Email Introuvable')
      }
      const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
    // Créer le lien de réinitialisation
    const resetLink = `http://localhost:4200/reset-password/${token}`;

    // Envoyer un email avec le lien
    console.log('ffffffff');

  await transporter.sendMail({
    from: 'yousseffehmi98@gmail.com',
    to: email,
    subject: 'Réinitialisation de mot de passe',
    text: `Cliquez sur le lien pour réinitialiser votre mot de passe: ${resetLink}`,
  })
    res.status(200).send('Un email de réinitialisation a été envoyé à votre adresse email.');
  } catch (err) {
    res.status(500).send('Erreur serveur');
  }
    } 
exports.resetpass=async (req, res) => {
  const { token, mot_de_passe } = req.body;
  console.log(token, mot_de_passe);
  
  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    
    const user = await User.findById(decoded.id);
    console.log(user);
    
    if (!user) {
     
      
      return res.status(404).send('Utilisateur non trouvé');
    }
    
    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    user.mot_de_passe = hashedPassword;
    console.log(user);
    
    // Sauvegarder le nouveau mot de passe
    await user.save();

    res.send('Mot de passe réinitialisé avec succès.');
  } catch (err) {
    res.status(400).send('Lien de réinitialisation invalide ou expiré.');
  }
};
