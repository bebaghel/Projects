const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../model/User'); // Adjust the path as needed
const jwtSecret = 'THISISSECRETKEY'; // Use an environment variable in production

// Passport JWT strategy
passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
}, async (payload, done) => {
    console.log(payload);
    try {
        const user = await User.findById(payload.id);
        if (!user) return done(null, false);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async function(id, done) {
    try {
      // Find the user by ID
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

passport.initialize();


