const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const tableName = "pwaMemoApp";
const userTableName = "snippy-user";
const frontBaseUrl = process.env.FRONT_BASE_URL;
const apiBaseUrl = process.env.API_BASE_URL;

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((obj, callback) => {
  callback(null, obj);
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      callbackURL: apiBaseUrl + "/auth/google/callback"
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
      callbackURL: apiBaseUrl + "/auth/github/callback"
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
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: apiBaseUrl + "/auth/twitter/callback"
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
router.get("/twitter", passport.authenticate("twitter", { scope: ["email"] }));
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: frontBaseUrl + "/#/login"
  }),
  function(req, res) {
    res.redirect(frontBaseUrl + "/#/");
  }
);

router.get("/github", passport.authenticate("github", { scope: ["email", "profile"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: frontBaseUrl + "/#/login"
  }),
  function(req, res) {
    res.redirect(frontBaseUrl + "/#/");
  }
);

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: frontBaseUrl + "/#/login"
  }),
  function(req, res) {
    res.redirect(frontBaseUrl + "/#/");
  }
);
// functions
module.exports = router;
