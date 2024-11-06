const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./model/User');
const authRoutes = require('./routes/auth');
const connectDB = require('./config/db')
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'secretkey', // Change this to a more secure key in production
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function(err, user) {
//       if (err) return done(err);
//       if (!user) return done(null, false);
//       user.comparePassword(password, function(err, isMatch) {
//         if (err) return done(err);
//         if (isMatch) return done(null, user);
//         else return done(null, false);
//       });
//     });
//   }
// ));

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // Compare the password
      const isMatch = await user.comparePassword(password);
      // const isMatch = ( user.password === password ? true : false);

      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } catch (err) {
      return done(err);
    }
  }
));
// Serialize and deserialize user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});


// Routes
const userRoutes = require('./routes/auth')
app.use('/user', userRoutes)

app.use('/auth', authRoutes);
// app.get('/login', passport.authenticate('local', {
//   successRedirect: '/auth/profile',
//   failureRedirect: '/auth/login',
//   failureFlash: true
// }));
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ msg: 'Server error', error: err });
    }
    if (!user) {
      return res.status(401).json({ msg: 'Login failed', error: info.message });
    }

    // Log in the user and return success message
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ msg: 'Server error', error: err });
      }
      return res.status(200).json({ msg: 'Login successful', user });
    });
  })(req, res, next);
});

app.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return res.json({ msg: "error" })
    if (!user) return res.json({ msg: "Login failed" })
    req.login(user, () => {
      return res.json({ msg: "Login success ", user })
    })
  })(req, res, next)
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// server.js
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const users = require('./users');

// const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find(user => user.username === username);
  if (!user) {
    return done(null, false, { message: 'Incorrect username.' });
  }
  if (user.password !== password) {
    return done(null, false, { message: 'Incorrect password.' });
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(user => user.id === id);
  done(null, user);
});

// JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your-secret-key',
};

passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
  const user = users.find(user => user.id === jwt_payload.id);
  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
}));

// Login route (local)
app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, 'your-secret-key');
  return res.json({ token });
});
// const app = {
//   require('dotenv').config();
// const express = require("express");
// const app = express();
// const cors = require('cors');
// app.use(cors());
// // require('./config/passport')
// const connectDB = require('./config/db')
// connectDB()
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('./model/User')
// const session = require('express-session');
// // const flash = require('connect-flash');
// // app.use(flash())

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(passport.initialize());

// // Use session middleware
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: false
// }));


// // const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
// // const jwt = require('jsonwebtoken');
// // const users = require('./model/User')
// // JWT Strategy
// // const jwtOptions = {
// //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// //   secretOrKey: 'your-secret-key',
// // };

// // passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
// //   const user = users.find(user => user.id === jwt_payload.id);
// //   if (user) {
// //     return done(null, user);
// //   } else {
// //     return done(null, false);
// //   }
// // }));

// // // Login route (local)
// // app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
// //   const token = jwt.sign({ id: req.user.id }, process.env.JWT_KEY);
// //   return res.json({ token });
// // });

// // // Protected route (JWT)
// // app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
// //   res.send(`Hello ${req.user.username}`);
// // });

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(async function(id, done) {
//   try {
//     // Find the user by ID
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });
// // passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// app.use(express.json())

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


// passport.use(new LocalStrategy( async ( name, password, done) => {
//   try {
//     console.log("Recieved Crediantial:", name, password);
//     const user = await User.findOne(name, password)
//     if(!user){
//       return done(null, false, {msg: 'incorrect username'})
//     }

//     const isPassMatch = user.password === password ? true : false;
//     if(isPassMatch){
//         return done(null, user);
//     } else {
//       return done(null, false, { msg: "Incorrect password"})
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }))

// app.get('/', passport.authenticate('local', {session:false}), (req, res) => {
//   res.send("Welcome to our Hotel")
// })


// //API route
// const userRouter = require('./routes/userRoute')
// const product = require('./routes/productRoute')

// // require('./config/passport')(passport);

// app.use('/user', userRouter)
// app.use('/products', product)

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log("App is running on port " + port);
// });




// }
// Protected route (JWT)
app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(`Hello ${req.user.username}`);
});


