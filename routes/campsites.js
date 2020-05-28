var express = require('express');
var router = express.Router();
var Campsite = require('../models/campsite');
var middleware = require('../middleware');

// INDEX ROUTE
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

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, (req, res) => {
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
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campsites");
        }
    });
});

// NEW FORM
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campsites/new");
});

// SHOW ROUTE
router.get("/:id", (req, res) => {
    Campsite.findById(req.params.id).populate("comments").exec((err, foundCampsite) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campsites/show", { campsite: foundCampsite });
        }
    });
});

// EDIT FORM
router.get("/:id/edit", middleware.checkCampsiteOwnership, (req, res) => {
    Campsite.findById(req.params.id, (err, foundCampsite) => {
        if(err){
            req.flash("error", "Campsite was not found");
        }
        res.render("campsites/edit", { campsite: foundCampsite });
    });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkCampsiteOwnership, (req, res) => {
    // TODO ESLINT
    // eslint-disable-next-line no-unused-vars
    Campsite.findByIdAndUpdate(req.params.id, req.body.campsite, (err, updatedCampsite) => {
        if (err) {
            req.flash("error", "Campsite was not found");
            res.redirect("/campsites");
        } else {
            res.redirect(`/campsites/${req.params.id}`);
        }
    });
});

// DESTROY ROUTE
router.delete("/:id", middleware.checkCampsiteOwnership, async (req, res) => {
    try {
        let foundCampsite = await Campsite.findById(req.params.id);
        await foundCampsite.remove();
        req.flash("success", "The Campsite has been deleted successfully.");
        res.redirect("/campsites");
    } catch (error) {
        console.log(error.message);
        req.flash("error", "There was an error when trying to delete this Campsite.");
        res.redirect("/campsites");
    }
});

module.exports = router;