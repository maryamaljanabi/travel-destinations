require("dotenv").config();
var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  GeoJSON = require("geojson"),
  User = require("./models/user"),
  Destination = require("./models/destination"),
  Comment = require("./models/comment.js");

var commentRoutes = require("./routes/comments"),
  destinationRoutes = require("./routes/destinations"),
  indexRoutes = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/travel_destinations";
var port = process.env.PORT || 3000;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch((err) => {
    console.log("ERROR: ", err.message);
  });

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

//PASSPORT CONFIGURATION
app.use(
  require("express-session")({
    secret: "whatever sentence you may like",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//A middleware to pass currentUser to all routes
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

//requiring routes
app.use(indexRoutes);
app.use("/destinations/:id/comments", commentRoutes);
app.use("/destinations", destinationRoutes);
app.listen(port, () => {
  console.log("Server online on port: ", port);
});
