var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 3000;

var campsites = [
    {name: "Salmon Creek", image: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_960_720.jpg"},
    {name: "Granite Hill", image: "https://cdn.pixabay.com/photo/2019/07/25/17/09/camp-4363073_960_720.png"},
    {name: "Mountain Goat's Rest", image: "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929_960_720.jpg"},
];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campsites", (req, res) => {
    res.render("campsites", {campsites: campsites});
});

app.post("/campsites", (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var newCampsite = {name: name, image: image};

    campsites.push(newCampsite);
    res.redirect("/campsites");
});

app.get("/campsites/new", (req, res) => {
    res.render("new");
});

app.listen(port, () => {
    console.log(`Camp Scotland Server listening on port: ${port}`);
});