const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../../models/users");
const jwt = require("jsonwebtoken");
//include check auth later on
const checkAuth = require("../middleware/check-auth");

//test
router.get("/signup_", (req, res, next) => {
  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    username: "Chad",
    password: "12345",
    admin: true,
    locations: ["Centurion"],
    dateCreated: new Date(),
  });
  console.log(user); //Saving it to the database
  user
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "User Created",
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  // res.status(201).json({
  //     message: 'User Created',
  //     success:true
  // });
});

//The signup route
router.post("/signup", (req, res, next) => {
  //checking if the requested body is correct
  //This request body only taked in the username and password
  console.log("user post", req.body);
  //checking if a user doesn't already exist
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      //if it did equal to one it means that there is a user in existance
      console.log(user.length);
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User exists",
        });
      } else {
        //encrypting the password of the user
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              //when signup is successful it will generate user with given username and password, with the rest being auto generated
              _id: new mongoose.Types.ObjectId(),
              username: req.body.username,
              password: hash,
              //no field was added since it is not on the request body, but upon editing users this can change
              admin: req.body.admin,
              locations: ["Centurion"],
              dateCreated: new Date(),
            });
            //Saving it to the database
            user
              .save()
              .then((result) => {
                //code generated upon success
                console.log(result);
                4;
                res.status(201).json({
                  message: "User Created",
                  success: true,
                });
              })
              .catch((err) => {
                //error code
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

//The login route
router.post("/login", (req, res, next) => {
  //checking to see if the body is what we want
  //body should only contain username and password
  console.log(req.body);
  //obtaining the username variable that is equal to the username that was put in the body
  //checking to see if there is a similar username
  User.find({ username: req.body.username })
    .exec()
    .then((user) => {
      //if 0 then there is no such user
      //console.log(user.length);
      if (user.length == 0) {
        return res.status(401).json({
          message: "Authorization Failed",
          success: false,
        });
      }
      //if there is a similar username the passwords will be compared
      //comparing both encrypted passwords
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          //if they do not match
          return res.status(401).json({
            message: "Authorization failed",
            success: false,
          });
        }
        if (result) {
          //if the password is correct then all the user information will be used to generate a token
          const token = jwt.sign(
            {
              username: user[0].username,
              userId: user[0]._id,
              locations: user[0].locations,
              admin: user[0].admin,
            }, //sendeing new token to enviroment for the specified time
            process.env.JWT_KEY,
            {
              //token only lasts 10 min
              expiresIn: "1m",
            }
          );
          return res.status(200).json({
            message: "Authorization Successful",
            //once everything is successful the user's details and the token will be sent for use
            data: {
              token: token,
              username: user[0].username,
              userId: user[0]._id,
              locations: user[0].locations,
              admin: user[0].admin,
            },
            success: true,
          });
        }
        res.status(401).json({
          message: "Authorization Failed",
          success: false,
        });
      });
    })
    .catch((err) => {
      //error code
      console.log("error ", err);
      res.status(500).json({
        error: err,
      });
    });
});

//The delete route
router.delete("/delete/:userId", checkAuth, (req, res, next) => {
  //id obtianed from the url
  const id = req.params.userId;
  //checking to see if the id is correct
  console.log(id);
  //removing the user that has the requested id
  User.remove({ _id: id })
    .exec()
    .then((result) => {
      //if success will send code
      res.status(200).json(result);
    })
    .catch((err) => {
      //error code
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//The display route
router.get("/display", checkAuth, (req, res, next) => {
  //Obtaining all available users
  User.find()
    .exec()
    .then((docs) => {
      //showing all available users
      console.log(docs);
      //making sure there are users
      if (docs.length >= 0) {
        res.status(200).json(docs);
      } else {
        res.status(404).json({
          message: "No entries found",
        });
      }
    })
    .catch((err) => {
      //error code
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//The spesific display route
router.get("/display/:userId", checkAuth, (req, res, next) => {
  //Obtaining requested id from user
  const id = req.params.userId;
  //Finding the user who has that id
  User.findById(id)
    .exec()
    .then((doc) => {
      //showing the user
      console.log("From database", doc);
      //checking to see if there is a user
      if (doc) {
        res.status(200).json(doc);
        return;
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
        return;
      }
    })
    .catch((err) => {
      //error code
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//The edit route
router.patch("/edit/:userId", checkAuth, (req, res, next) => {
  //checking the requesing id and equaling it to the id variable
  console.log(req.params);
  const id = req.params.userId;
  //showing the entire body that needs updating
  console.log(req.body);
  //updateOps is the requested body
  const updateOps = req.body;
  console.log(updateOps);
  console.log(id);
  //updating the user with the same id with the requested body
  //meaning only the id and the newly edited field are neccesary
  //However it is good practise to include all of them, letting all the data be available
  User.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      //showing the updating was successful
      console.log("132", result);
      res.status(200).json({
        message: "User Edited",
        editedProduct: result,
        success: true,
      });
    })
    .catch((err) => {
      //error code
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/:userId/addLocation", checkAuth, (req, res, next) => {3
  //checking the requesing id and equaling it to the id variable
  console.log(req.params);
  const id = req.params.userId;
  const newLocation = req.body.locations;
  //showing the entire body that needs updating
  console.log(req.body);
  //updateOps is the requested body
  console.log(id);
  //updating the user with the same id with the requested body
  //meaning only the id and the newly edited field are neccesary
  //However it is good practise to include all of them, letting all the data be available
  User.findById(id)
    .exec()
    .then((user) =>
      User.updateOne({ _id: id }, { $push: { locations: newLocation } })
        .exec()
        .then((result) => {
            user.locations.push(newLocation)
          //showing the updating was successful
          console.log("132", result);
          const token = jwt.sign(
            {
              username: user.username,
              userId: user._id,
              locations: user.locations,
              admin: user.admin,
            }, //sendeing new token to enviroment for the specified time
            process.env.JWT_KEY,
            {
              //token only lasts 10 min
              expiresIn: "10m",
            })
          res.status(200).json({
            message: "Location added",
            //once everything is successful the user's details and the token will be sent for use
            data: {
              token: token,
              username: user.username,
              userId: user._id,
              locations: user.locations,
              admin: user.admin,
            },
            success: true,
          });
        })
        .catch((err) => {
          //error code
          console.log(err);
          res.status(500).json({
            error: err,
          });
        })
    );
});

router.post("/:userId/removelocation", checkAuth, (req, res, next) => {3
  //checking the requesing id and equaling it to the id variable
  console.log(req.params);
  const id = req.params.userId;
  const oldLocation = req.body.locations;
  //showing the entire body that needs updating
  console.log(req.body);
  //updateOps is the requested body
  console.log(id);
  //updating the user with the same id with the requested body
  //meaning only the id and the newly edited field are neccesary
  //However it is good practise to include all of them, letting all the data be available
  User.findById(id)
    .exec()
    .then((user) =>
      User.updateOne({ _id: id }, { $pull: { locations: oldLocation } })
        .exec()
        .then((result) => {
          user.locations.pull(oldLocation)
          console.log("RESULT: ", result)
          console.log("LOCATIONS: ", user.locations)
          const token = jwt.sign(
            {
              username: user.username,
              userId: user._id,
              locations: user.locations,
              admin: user.admin,
            }, //sendeing new token to enviroment for the specified time
            process.env.JWT_KEY,
            {
              //token only lasts 10 min
              expiresIn: "10m",
            })
          res.status(200).json({
            message: "Location removed",
            //once everything is successful the user's details and the token will be sent for use
            data: {
              token: token,
              username: user.username,
              userId: user._id,
              locations: user.locations,
              admin: user.admin,
            },
            
            success: true,
          });
        })
        .catch((err) => {
          //error code
          console.log(err);
          res.status(500).json({
            error: err,
          });
        })
    );
});

router.post("/remove", checkAuth, (req, res, next) => {
  // Extract the user ID from the request body or from the authenticated user's data
  const userIdToRemove = req.body.userId; // Assuming the client sends the user ID to remove
  
  // Use Mongoose to find the user by ID and remove it from the database
  User.deleteOne(userIdToRemove)
    .exec()
    .then((result) => {
      if (result) {
        // If the user was found and removed successfully
        res.status(200).json({
          message: "User removed successfully",
          success: true,
        });
      } else {
        // If the user was not found
        res.status(404).json({
          message: "User not found",
          success: false,
        });
      }
    })
    .catch((err) => {
      // If an error occurred during the removal process
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
//exporting router for use
module.exports = router;
