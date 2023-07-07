const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// PLEASE EDIT YOUR MONGODB CONNECTION STRING HERE
/* YOU CAN FIND SAMPLE COLLECTION at mongodb_collections folder */
const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const connection = mongoose.connection;

connection.on("error", () => {
  console.log("Mongo DB Connection Failed");
});

connection.on("connected", () => {
  console.log("Mongo DB Connection Successful");

  // Read the JSON data for rooms
  const roomsFilePath = path.join(__dirname, "../mongodb_collections/rooms.json");
  const roomsData = JSON.parse(fs.readFileSync(roomsFilePath));

  // Read the JSON data for users
  const usersFilePath = path.join(__dirname, "../mongodb_collections/users.json");
  const usersData = JSON.parse(fs.readFileSync(usersFilePath));

  // Insert data into the rooms collection
  const RoomModel = require("./models/room"); // Replace with your actual room model
  RoomModel.insertMany(roomsData)
    .then((result) => {
      console.log(`${result.length} room documents inserted into the collection`);
    })
    .catch((error) => {
      console.error("Error inserting room documents:", error);
    });

  // Insert data into the users collection
  const UserModel = require("./models/user"); // Replace with your actual user model
  UserModel.insertMany(usersData)
    .then((result) => {
      console.log(`${result.length} user documents inserted into the collection`);
    })
    .catch((error) => {
      console.error("Error inserting user documents:", error);
    })
    .finally(() => {
      // Close the MongoDB connection
      connection.close();
    });
});

module.exports = mongoose;
