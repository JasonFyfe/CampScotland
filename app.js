var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    // TODO ESLINT
    // eslint-disable-next-line no-unused-vars
    Campsite = require('./models/campsite'),
    // TODO ESLINT
    // eslint-disable-next-line no-unused-vars
    Comment = require('./models/comment'),
    User = require('./models/user'),
    // TODO ESLINT
    // eslint-disable-next-line no-unused-vars
    seedDB = require('./seeds'),
    app = express(),
    port = 3000;

// Requiring routes
var campsiteRoutes = require("./routes/campsites"),
    commentRoutes = require("./routes/comments"),
    authRoutes = require("./routes/index");

// Mongoose and Express Setup
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/camp_scotland", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// seedDB(); - Seeds the Database

// Passport configuration
app.use(require('express-session')({
    secret: "Secret needed here",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Allows us to check current logged in user
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// Route Setup
app.use("/", authRoutes);
app.use("/campsites", campsiteRoutes);
app.use("/campsites/:id/comments", commentRoutes);

app.listen(port, () => {
    console.log(`Camp Scotland Server listening on port: ${port}`);
});