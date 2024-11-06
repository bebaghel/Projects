const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hashedPassword) => {
    if (err) return next(err);
    user.password = hashedPassword;
    next();
  });
});

// userSchema.methods.comparePassword = function(candidatePassword, cb) {
//   if (typeof cb === 'function') {
//     // If a callback is provided, use it
//     bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
//       if (err) return cb(err);
//       cb(null, isMatch);
//     });
//   } else {
//     // If no callback is provided, return a Promise
//     return new Promise((resolve, reject) => {
//       bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
//         if (err) return reject(err);
//         resolve(isMatch);
//       });
//     });
//   }
// };
// compare password 
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// generate JWT token = instance method
userSchema.methods.generateToken = function () {
  return jwt.sign(
      { userId: this._id.toString() }, 
      "process.env.JWT_KEY",
      { expiresIn: '2h' }
  );
};

var User = module.exports = mongoose.model('User', userSchema);
//Add User
module.exports.createUser = async function (newUser) {
  const adduser = await User.create(newUser)
  console.log(adduser)
  return adduser;
}
