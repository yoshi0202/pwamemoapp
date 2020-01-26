const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const tableName = "pwaMemoApp";
const userTableName = "snippy-user";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(accessToken);
      console.log(profile);
      console.log(refreshToken);
      if (profile) {
        return done(null, profile);
      } else {
        return done(null, false);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(accessToken);
      console.log(profile);
      console.log(refreshToken);
      if (profile) {
        return done(null, profile);
      } else {
        return done(null, false);
      }
    }
  )
);

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:8080/#/login"
  }),
  function(req, res) {
    res.redirect("http://localhost:8080");
  }
);

router.get("/github", passport.authenticate("github", { scope: ["email", "profile"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "http://localhost:8080/#/login"
  }),
  function(req, res) {
    res.redirect("http://localhost:8080");
  }
);
// functions
module.exports = router;
