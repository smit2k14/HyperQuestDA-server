const { Router } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("./models/user"); //importing database model
const jwt = require("jsonwebtoken");
const checkAuth = require("./middleware/check-auth");

///////////Homepage///////////////////
router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "welcome",
  });
});

///////////////////User Signup//////////////////

router.get("/signup", (req, res, next) => {
  return res.status(200).json({
    message: "GET request to Login Page",
  });
  //res.setHeader("content-type", "text/html");
  //res.render("signup");
  //res.end();
});

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(200).json({
          message: "User already Exist",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status("500");
          } else {
            const user = new User({
              //inserting values into database
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });

            user //saving user details
              .save()
              .then((result) => {
                console.log(result);
                return res.status("200").json({
                  message: "User Added Successfully",
                });
              })
              .catch((err) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({ err });
                }
              });
          }
        });
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
});

////////////////////User Login/////////////////

router.get("/login", (req, res, next) => {
  return res.status(200).json({
    message: "GET request to Login Page",
  });
});
router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            console.log(err);
          }
          res.setHeader("content-type", "application/json");
          if (result == true) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id,
              },
              "hyperquest secret",
              {
                expiresIn: "1h",
              }
            );
            return res.status(200).json({
              message: "Auth Successful",
              token: token,
            });
          } else {
            return res.status(401).json({
              message: "Invalid credentials",
            });
          }
        });
      } else {
        return res.status("200").json({
          message: "Signup First",
        });
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
});
/////////////////////////////////////////////////////////////////////////////

router.get("/content", checkAuth, (req, res, next) => {
  //Route Protecting Content Page
  return res.status(200).json({
    message: "Content Page Visited",
  });
});

module.exports = router;
