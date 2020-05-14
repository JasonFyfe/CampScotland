var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campsite = require('./models/campsite'),
    Comment = require('./models/comment'),
    seedDB = require('./seeds');
    app = express(),
    port = 4000; //TODO change back to 3000

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/camp_scotland", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
seedDB();

// LANDING PAGE ROUTE
app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/map", (req, res) => {
    res.render("map");
});

// INDEX ROUTE - Show all campsites
app.get("/campsites", (req, res) => {
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
    res.render("campsites/new");
});

// SHOW - Shows more info about one campsite
app.get("/campsites/:id", (req, res) => {
    Campsite.findById(req.params.id).populate("comments").exec((err, foundCampsite) => {
        if(err) {
            console.log(err);
        } else {
            res.render("campsites/show", {campsite: foundCampsite});
        }
    });
});

// ====================
// COMMENT ROUTES
// ====================
app.get("/campsites/:id/comments/new", (req, res) => {
    Campsite.findById(req.params.id, (err, campsite) => {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campsite: campsite});
        }
    });
});

app.post("/campsites/:id/comments", (req, res) => {
    Campsite.findById(req.params.id, (err, campsite) => {
        if(err){
            console.log(err);
            res.redirect("/campsites");
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, (err, comment) => {
                if(err){
                    console.log(err);
                } else {
                    campsite.comments.push(comment);
                    campsite.save();
                    res.redirect(`/campsites/${campsite.id}`);
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Camp Scotland Server listening on port: ${port}`);
});