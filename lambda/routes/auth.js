const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const OAuth2Strategy = require("passport-oauth2").Strategy;
const axios = require("axios");
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

router.get("/qiita", function(req, res, next) {
  console.log("qiita auth");
  const scope = "read_qiita";
  const url = "https://qiita.com/api/v2/oauth/authorize";
  const state = "aaaaaaaaaa";
  const urlParams = `client_id=${process.env.QIITA_OAUTH_CLIENT_ID}&scope=${scope}&state=${state}`;
  res.redirect(`${url}?${urlParams}`);
});
router.get("/qiita/callback", async function(req, res, next) {
  const result = await axios.post(
    "https://qiita.com/api/v2/access_tokens",
    {
      client_id: process.env.QIITA_OAUTH_CLIENT_ID,
      client_secret: process.env.QIITA_OAUTH_CLIENT_SECRET,
      code: req.query.code
    },
    { headers: { "Content-Type": "application/json" } }
  );
  console.log(result.data);
  const userResult = await axios.get("https://qiita.com/api/v2/authenticated_user", {
    headers: {
      Authorization: `Bearer ${result.data.token}`,
      "Content-Type": "application/json"
    },
    data: {}
  });
  console.log(userResult);
  res.redirect(frontBaseUrl + "/#/");
});
// functions
module.exports = router;
