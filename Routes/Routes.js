const express = require('express');
const router = express.Router();
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Model/modelutulisateur');

const userController=require('../Controlleur/UtulisateurControleur')

router.post('/register',userController.regesterUser);
router.post('/login',userController.loginUser)
router.get('/users', userController.getAllUsers); 
router.get('/users/:id', userController.getUserById); 
router.put('/users/:id', userController.updateUser); 
router.delete('/users/:id', userController.deleteUser);
router.post('/sendmail',userController.Changepassword)
router.post('/reset-password/:token',userController.resetpass)

// authentification avec Gmail


passport.use(new GoogleStrategy({
    clientID: process.env.client_id,
    clientSecret: process.env.client_secret,
    callbackURL: process.env.callbackURL,
    scope: ['profile', 'email'],
     prompt: 'consent'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Vérifier si l'utilisateur existe déjà dans la base de données
      let user = await User.findOne({ googleId: profile.id }); 
      console.log(profile);
         
      if (user) {
        // Si l'utilisateur existe déjà, le retourner
        return done(null, user);
      } else {
        // Si l'utilisateur n'existe pas, le créer dans la base de données
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          photo: profile.photos[0].value   
        });

        await user.save();
        return done(null, user);
      }
    } catch (err) {
      console.error(err);
      return done(err, false);
    }
  }
));

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('http://localhost:4200/login');
  });
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);  // Utilisation de async/await
      done(null, user);  // Pas d'erreur, donc premier paramètre null
    } catch (err) {
      done(err, null);  // En cas d'erreur, le premier paramètre est l'erreur
    }
  });

module.exports = router;
