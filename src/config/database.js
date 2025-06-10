const mongoose = require("mongoose");
const connectDB = async () => {
  // Cluster -> mongodb+srv://namastenodejs-amar:SGzPGIqdx2ZDHgwl@namastenodejs-amartya.n7zdaxt.mongodb.net/
  // Database(devTinder) -> mongodb+srv://namastenodejs-amar:<password>@namastenodejs-amartya.n7zdaxt.mongodb.net/devTinder
  await mongoose.connect(
    process.env.DB_CONNECTION_SECRET
  );
};

module.exports = connectDB;
