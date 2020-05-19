var express = require('express');
var router = express.Router();
var Campsite = require('../models/campsite');

// INDEX ROUTE - Show all campsites
router.get("/", (req, res) => {
    Campsite.find({}, (err, campsites) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campsites/index", { campsites: campsites });
        }
    });
});

// CREATE ROUTE - Add a new campsite to DB
router.post("/", isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampsite = { name: name, image: image, description: description, author: author };

    // TODO ESLINT
    // eslint-disable-next-line no-unused-vars
    Campsite.create(newCampsite, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            res.redirect("/campsites");
        }
    });
});

// NEW - Show form to create a new campsite
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campsites/new");
});

// SHOW - Shows more info about one campsite
router.get("/:id", (req, res) => {
    Campsite.findById(req.params.id).populate("comments").exec((err, foundCampsite) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campsites/show", {campsite: foundCampsite});
        }
    });
});

// Middleware
// TODO Refactor to seperate file
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;