var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
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
    app = express();
require('dotenv').config();


// Requiring routes
var campsiteRoutes = require("./routes/campsites"),
    commentRoutes = require("./routes/comments"),
    userRoutes = require("./routes/users"),
    authRoutes = require("./routes/index");

// Mongoose and Express Setup
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); - Seeds the Database

// Moment.js Setup
app.locals.moment = require('moment');

// Passport configuration
app.use(require('express-session')({
    secret: process.env.PASSPORT_SECRET,
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Route Setup
app.use("/", authRoutes);
app.use("/campsites", campsiteRoutes);
app.use("/campsites/:id/comments", commentRoutes);
app.use("/users", userRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Camp Scotland Server initialised.");
});