//call model
const Users = require("../models/user");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const passport = require("passport");

class userController {
  register(req, res) {
    res.render("register", {
      title: "Register",
    });
  }
  registerPost(req, res, next) {
    const { username, password } = req.body;
    let errors = [];
    if (!username || !password) {
      errors.push({ msg: "Please enter all fields" });
    }
    if (password.length < 6) {
      errors.push({ msg: "Password must be at least 6 characters" });
    }
    if (errors.length > 0) {
      res.render("register", {
        errors,
        username,
        password,
      });
    } else {
      Users.findOne({ username: username }).then((user) => {
        if (user) {
          errors.push({ msg: "Username already exists" });
          res.render("register", {
            errors,
            username,
            password,
          });
        } else {
          const newUser = new Users({
            username,
            password,
          });
          //Hash password
          bcrypt.hash(newUser.password, 10, function (err, hash) {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                res.redirect("/user/login");
              })
              .catch(next);
          });
        }
      });
    }
  }

  login(req, res, next) {
    res.render("login");
  }

  signin(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/user/dashboard",
      failureRedirect: "/user/login",
      failureFlash: true,
    })(req, res, next);
  }
  dashboard(req, res, next) {
    res.render("dashboard");
  }
  signout(req, res, next) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success_msg", "You are logged out");
      res.redirect("/user/login");
    });
  }
}

module.exports = new userController();
