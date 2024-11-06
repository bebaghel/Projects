const { body, validationResult } = require('express-validator');
const User = require('../model/User');
const passport = require('passport');
// Home Route
const homes = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.send("error")
        if (!user) return res.json({ msg: "login fail", error: info.message })

        try {
            req.logIn(user, async (err) => {
                res.json({ msg: "Welcome to Home page" })
                console.log("logged in user", req.user)
            })
        } catch (error) {
            return res.json({ error })
        }
    })(req, res, next)
}

const home = async (req, res) => {
    res.json({msg: "welcomme to home page"})
}
// Register Route
const register = async (req, res) => {
    
        body('username', 'username is required').notEmpty();
        body('password', "password is required").notEmpty();
    
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ status: false, response: errors.array() })
    } else {
        try {
            const { username, password } = req.body;
            // const userExist = await User.findOne({ email });
            // if (userExist) {
            //     return res.json({ status: false, message: "Email already exist" });
            // }
            const newUser = new User({ username, password });
            console.log("new User", newUser)
            User.create(newUser, async (err, user) => {
                if (err) {
                    return res.json({ status: false, response: err })
                } else {
                    await newUser.save();
                    console.log("user:", user)
                    const userpass = newUser.toObject();
                    delete userpass.password;
                    return res.status(201).json({ status: true, message: 'User registered successfully', response: userpass });
                }
            })
        } catch (error) {
            res.status(500).json({ status: false, message: 'Server-error', error: error.message });
        }
    }

};

// Login Route
const login = async (req, res, next) => {
    passport.authenticate('local', async (err, user, info) => {
        if (err) {
            return res.status(500).json({ msg: 'Error', error: err.message });
        }
        if (!user) {
            return res.status(401).json({ msg: 'User not exist', error: info.message });
        }

        try {
            req.logIn(user, async (err) => {
                if (err) {
                    return res.status(500).json({ msg: 'Error during login' });
                }

                const { password } = req.body;
                const passwordMatch = await user.comparePassword(password);

                if (passwordMatch) {
                    const token = user.generateToken();
                    const userdata = user.toObject();
                    delete userdata.password;
                    return res.json({ status: true, message: 'Login successful', token, response: userdata });
                } else {
                    return res.status(401).json({ status: false, message: 'Incorrect password' });
                }
            });
        } catch (error) {
            return res.status(500).json({ msg: 'Error processing request', error: error.message });
        }
    })(req, res, next);
};
// const login = async (req, res, next) => {
//     passport.authenticate('local', (err, user, info) => {
//         if (err) {
//             return res.status(500).json({ msg: 'Server error', error: err });
//         }
//         if (!user) {
//             return res.status(401).json({ msg: 'Login failed', error: info.message });
//         }

//         // Log in the user and return success message
//         req.logIn(user, (err) => {
//             if (err) {
//                 return res.status(500).json({ msg: 'Server error', error: err });
//             }
//             return res.status(200).json({ msg: 'Login successful', user });
//         });
//     })(req, res, next);
// };

module.exports = { home, register, login };