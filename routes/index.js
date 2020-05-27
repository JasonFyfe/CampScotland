var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// Root route
router.get("/", (req, res) => {
    res.render("landing");
});

// Register Form
router.get("/register", (req, res) => {
    res.render("auth/register");
});
// Register POST route
router.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    // TODO ESLINT
    // eslint-disable-next-line no-unused-vars
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log("Registration Error!");
            console.log(err);
            return res.render("auth/register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campsites");
        });
    });
});

// Login Form
router.get("/login", (req, res) => {
    res.render("auth/login");
});
// Login POST route
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campsites",
        failureRedirect: "/login"
    })
);

// Logout route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campsites");
});

module.exports = router;