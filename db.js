const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

// PLEASE EDIT YOUR MONGODB CONNECTION STRING HERE
const mongoURL = process.env.MONGODB_URL;

mongoose.connect("mongodb+srv://thotamohanreddy993:mohan123@hotelbookingcluster.nyya41y.mongodb.net/?retryWrites=true&w=majority", {
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
  const roomsFilePath = path.join(__dirname, "./mongodb_collections/rooms.json");
  const roomsData = JSON.parse(fs.readFileSync(roomsFilePath));

  // Read the JSON data for users
  const usersFilePath = path.join(__dirname, "./mongodb_collections/users.json");
  const usersData = JSON.parse(fs.readFileSync(usersFilePath));

  // Clear existing data from the rooms collection
  const RoomModel = require("./models/room"); // Replace with your actual room model
  RoomModel.deleteMany({})
    .then(() => {
      console.log("Existing room documents cleared");
      // Insert data into the rooms collection
      return RoomModel.insertMany(roomsData);
    })
    .then((result) => {
      console.log(`${result.length} room documents inserted into the collection`);
    })
    .catch((error) => {
      console.error("Error inserting room documents:", error);
    });

  // Clear existing data from the users collection
  const UserModel = require("./models/user"); // Replace with your actual user model
  UserModel.deleteMany({})
    .then(() => {
      console.log("Existing user documents cleared");
      // Insert data into the users collection
      return UserModel.insertMany(usersData);
    })
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

