const mongoose = require("mongoose");

const connectDB = (url) => {
  mongoose.set("strictQuery", false);
  return mongoose.connect(url);
};

// When the strict option is set to true, Mongoose will ensure that only the fields that are
// specified in your schema will be saved in the database, and all other fields will not be
// saved (if some other fields are sent).
// Right now, this option is enabled by default, but it will be changed in Mongoose v7 to
// false by default. That means that all the fields will be saved in the database, even if
// some of them are not specified in the schema model.

module.exports = connectDB;
