const express = require('express');
const router = express.Router();
const {body} = require('express-validator')
const userController = require('../controller/userController')
const passport = require('passport')


const registerValidator =  [
    body('email','Email is required').notEmpty(),
    body('password', "password is required").notEmpty(),
];

router.post('/register',  registerValidator, userController.register)

router.post('/login',  userController.login)
router.get('/', passport.authenticate('local', {session: false}),  userController.home);


module.exports = router;

