const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const dbConfig = require("./app/configs/db.config");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

app.use(express.json()); //Parse request of content-type - application/json

app.use(express.urlencoded({ extended: true })); //Parse request of content-type - application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Ashish Application" }); // simple route
});

const Role = db.role;

console.log(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`);

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
    initial();
  })

  .catch((err) => {
    console.error("Connection Error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });
      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

// routes
require("./app/routes/auth.route")(app);
require("./app/routes/user.route")(app);

const PORT = process.env.PORT || 8080; // set our port

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)); // listen for requests
