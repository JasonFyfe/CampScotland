var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = 3000;

mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/camp_scotland", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// SCHEMA SETUP
var campsiteSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campsite = mongoose.model("Campsite", campsiteSchema);

app.get("/", (req, res) => {
    res.render("landing");
});

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

app.get("/campsites/new", (req, res) => {
    res.render("new");
});

app.get("/campsites/:id", (req, res) => {

    Campsite.findById(req.params.id, (err, foundCampsite) => {
        if(err)
        {
            console.log(err);
        } else {
            res.render("show", {campsite: foundCampsite});
        }
    });
});

app.listen(port, () => {
    console.log(`Camp Scotland Server listening on port: ${port}`);
});