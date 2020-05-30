var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get("/", (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(users);
        }
    });
});

// Show Route
router.get("/:id", (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if (err) {
            req.flash('error', "User not found");
            res.redirect("back");
        } else {
            res.render("users/show", {user: foundUser});
        }
    })
});

module.exports = router;