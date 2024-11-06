const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../model/User');
const { body } = require('express-validator');
const userController = require('../controller/userController')
const jwt = require('jsonwebtoken')
// Register Route
// router.post('/register', (req, res) => {
//     const { username, password } = req.body;
//     User.findOne({ username: username }, (err, existingUser) => {
//         if (err) return res.status(500).json({ error: err.message });
//         if (existingUser) return res.status(400).json({ message: 'User already exists' });
//         const newUser = new User({ username, password });
//         newUser.save((err) => {
//             if (err) return res.status(500).json({ error: err.message });
//             res.status(201).json({ message: 'User created' });
//         });
//     });
// });
const authUser = passport.authenticate('local', { session: false });
const authValidator =   [
    body('username', 'username is required').notEmpty(),
    body('password', "password is required").notEmpty(),
];

router.post('/login',  userController.login)
router.post('/register',  userController.register)
router.get('/',authUser, userController.home)

// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) {
//         return res.json({ status: false, message: 'No record exists with this email' });
//     }
//     console.log(user)
//     const passwordMatch = await user.comparePassword(password);
//     console.log(passwordMatch)
//     if (passwordMatch) {
//         const token = user.generateToken();
//         const userdata = user.toObject();
//         delete userdata.password;
//         res.json({ status: true, message: 'Login successful', token, response: userdata });
//     } else {
//         res.status(401).json({ status: false, message: 'Incorrect password' });
//     }
// });
// router.post('register', userController)


// Login Route
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/auth/profile',
//     failureRedirect: '/auth/login',
//     failureFlash: true
// }));

// Profile Route (Protected)
// router.get('/profile', (req, res) => {
//     if (!req.isAuthenticated()) return res.status(401).json({ message: 'Unauthorized' });
//     res.json({ user: req.user });
// });

// Login route  Token not worked
// router.post('/log', function (req, res, next) {
//     passport.authenticate('local', {session: false}, (err, user, info) => {
//         if ( !user) {
//             return res.status(400).json({
//                 message: 'Something is not right',
//                 user   : user
//             });
//         }
//        req.login(user, {session: false}, (err) => {
//            if (err) {
//                res.send(err);
//            }
//            // generate a signed son web token with the contents of user object and return it in the response
//         //    const token = jwt.sign(user, 'your_jwt_secret');
//            return res.json({user,  response: "Login success"});
//         });
//     })(req, res, next);
// })

// //ogin route worked
// router.post("/signup", function (req, res) {
//     console.log(req.body);
  
//     const userToBeChecked = new User({
//       username: req.body.username,
//       password: req.body.password,
//     });
  
//     // Checking if user if correct or not
//     req.login(userToBeChecked, function (err) {
//       if (err) {  console.log(err);
        
//         // If authentication fails, then coming
//         // back to login.html page
//         res.redirect("/login");
//       } else {
//         passport.authenticate("local")(
//           req, res, function () {
//           User.find({ username: req.user.username }, 
//             function (err, docs) {
//             if (err) {
//               console.log(err);
//             } else {
//               //login is successful
//               console.log("credentials are correct");
//               res.send("login successful");
//             }
//           });
//         });
//       }
//     });
//   });


module.exports = router;
