const express = require('express');
const router = express.Router();

const userController=require('../Controlleur/UtulisateurControleur')

router.post('/register',userController.regesterUser);
router.post('/login',userController.loginUser)
router.get('/users', userController.getAllUsers); 
router.get('/users/:id', userController.getUserById); 
router.put('/users/:id', userController.updateUser); 
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
