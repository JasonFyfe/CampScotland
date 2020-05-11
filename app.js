var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campsite = require('./models/campsite'),
    seedDB = require('./seeds');
    app = express(),
    port = 3000;

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/camp_scotland", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
seedDB();

// LANDING PAGE ROUTE
app.get("/", (req, res) => {
    res.render("landing");
});

// INDEX ROUTE - Show all campsites
app.get("/campsites", (req, res) => {
    Campsite.find({}, (err, campsites) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("campsites", { campsites: campsites });
        }
    });
});

// CREATE ROUTE - Add a new campsite to DB
app.post("/campsites", (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampsite = { name: name, image: image, description: description };

    Campsite.create(newCampsite, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            res.redirect("/campsites");
        }
    });
});

// NEW - Show form to create a new campsite
app.get("/campsites/new", (req, res) => {
    res.render("new");
});

// SHOW - Shows more info about one campsite
app.get("/campsites/:id", (req, res) => {
    Campsite.findById(req.params.id).populate("comments").exec((err, foundCampsite) => {
        if(err) {
            console.log(err);
        } else {
            res.render("show", {campsite: foundCampsite});
        }
    });
});

app.listen(port, () => {
    console.log(`Camp Scotland Server listening on port: ${port}`);
});