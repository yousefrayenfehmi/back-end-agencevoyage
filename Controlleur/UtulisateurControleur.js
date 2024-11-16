const express = require('express');
const User = require('../Model/modelutulisateur');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { use } = require('../Routes/Routes');
require('dotenv').config({ path: '../.env'});
exports.regesterUser=async(req,res)=>{
    const { nom, email, mot_de_passe, date_naissance,telephone,adresse,roles } = req.body;
    try{
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({
        nom,
        email,
        mot_de_passe,
        date_naissance,
        telephone,
        adresse,
        roles
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
        try {
            let user=await User.findOne({email})
            if(!user) return res.status(400).json({ msg: 'Invalid credentials' });
            const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
            const payload = { user: { id: user.id } };

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