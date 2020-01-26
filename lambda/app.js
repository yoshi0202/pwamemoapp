var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

var apiRouter = require("./routes/api");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: "365117955301-66d93pfbbh36emssqahqc7oih4t6epnq.apps.googleusercontent.com",
      clientSecret: "dwATsssFH4mx6fDu_oRdn3-G",
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      if (profile) {
        return done(null, profile);
      } else {
        return done(null, false);
      }
    }
  )
);

app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"], session: false }));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    successRedirect: "http://localhost:8080",
    failureRedirect: "http://localhost:8080/login"
  })
);

app.use("/api", apiRouter);

app.use(function(req, res, next) {
  res.status(404).json({
    status: 404,
    msg: "404 not found"
  });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err);
  // res.send(err);
});

app.listen(3000);
module.exports = app;
