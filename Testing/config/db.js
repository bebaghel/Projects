const mongoose = require('mongoose')

// const URI = 'mongodb://127.0.0.1:27017/foxgs'
const URI = process.env.MONGO_URI

// const connectDB = () => {
//     try {
//         mongoose.connect(URI, {
//             useNewUrlParser: true,
//             useCreateIndex: true,
//             useUnifiedTopology: true,
//             useFindAndModify: false
//         })
//         console.log("Connection successfull to MONGODB");

//     } catch (error) {
//         console.error("MongoDB Connection Failed");
//     }
// }

// const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = 'mongodb://127.0.0.1:27017/mongodb'; // Fetch the URI from environment variables
    if (!uri) {
      throw new Error('MongoDB URI not defined in environment variables');
    }
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
