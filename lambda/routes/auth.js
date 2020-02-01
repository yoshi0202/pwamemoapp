const express = require("express");
const router = express.Router();
const aws = require("aws-sdk");
const dynamo = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1" });
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const axios = require("axios");
const bcrypt = require("bcrypt");
const utils = require("../utils/utils");
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
      if (isOauthUserRegisterd(profile.id, "google")) {
        oauthUserUpdate(profile.id);
      } else {
        oauthUserCreate(profile.id, "google");
      }
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
      if (isOauthUserRegisterd(profile.id, "github")) {
        oauthUserUpdate(profile.id);
      } else {
        oauthUserCreate(profile.id, "github");
      }
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

router.post("/signUp", async function(req, res, next) {
  try {
    const userId = utils.createDefaultUserId();
    let params = {
      TableName: userTableName,
      Item: {
        userId: userId,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        loginToken: utils.getRandomToken(32),
        loginType: "email",
        snipCounts: 0
      }
    };
    await dynamo.put(params).promise();
    res.json({
      status: true,
      userId: userId,
      email: req.body.email,
      loginToken: utils.getRandomToken(32),
      loginType: "email",
      snipCounts: 0
    });
  } catch (err) {
    console.log(JSON.stringify(err));
    res.json(err);
  }
});

router.post("/login", async function(req, res, next) {
  try {
    let result = {};
    var params = {
      TableName: userTableName,
      IndexName: "email-index",
      ExpressionAttributeNames: { "#e": "email" },
      ExpressionAttributeValues: { ":e": req.body.email },
      KeyConditionExpression: "#e = :e"
    };
    const userData = await dynamo.query(params).promise();
    console.log(userData);
    if (userData.Items.length === 0) {
      // user not defined
      console.log("user not defined");
      result.status = false;
      result.err = "user not defined";
      res.json(result);
      return;
    }
    if (!userData.Items || !bcrypt.compareSync(req.body.password, userData.Items[0].password)) {
      // auth not succcess
      console.log("password is not valid");
      result.status = false;
      result.err = "password is not valid";
      res.json(result);
      return;
    }
    // auth success
    console.log("password is valid");
    result.status = true;
    result.err = "";
    result.loginToken = utils.getRandomToken(32);
    result.userId = userData.Items[0].userId;
    result.email = userData.Items[0].email;
    result.loginType = userData.Items[0].loginType;
    result.snipCounts = userData.Items[0].snipCounts;
    res.json(result);
    var updateParams = {
      TableName: userTableName,
      Key: {
        userId: result.userId
      },
      ExpressionAttributeNames: {
        "#l": "loginToken"
      },
      ExpressionAttributeValues: {
        ":l": result.loginToken
      },
      UpdateExpression: "SET #l = :l"
    };
    dynamo.update(updateParams).promise();
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.delete("/logout", async function(req, res, next) {
  try {
    var queryParams = {
      TableName: userTableName,
      ExpressionAttributeNames: { "#u": "userId", "#l": "loginToken" },
      ExpressionAttributeValues: { ":u": req.body.userId, ":l": req.body.loginToken },
      KeyConditionExpression: "#u = :u",
      FilterExpression: "#l = :l"
    };
    const result = await dynamo.query(queryParams).promise();
    var updateParams = {
      TableName: userTableName,
      Key: {
        userId: req.body.userId
      },
      ExpressionAttributeNames: {
        "#l": "loginToken"
      },
      UpdateExpression: "REMOVE #l"
    };
    await dynamo.update(updateParams).promise();
    res.json({
      result: "ok"
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/twitter", passport.authenticate("twitter", { scope: ["email"] }));
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: frontBaseUrl + "/login"
  }),
  function(req, res) {
    res.redirect(frontBaseUrl + "/");
  }
);

router.get("/github", passport.authenticate("github", { scope: ["email", "profile"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: frontBaseUrl + "/login"
  }),
  function(req, res) {
    res.redirect(frontBaseUrl + "/?userId=" + res.req.user.id + "&loginType=github");
  }
);
router.post("/github/signin", async function(req, res, next) {
  const params = {
    TableName: userTableName,
    FilterExpression: "#u = :u AND #l = :l",
    ExpressionAttributeNames: {
      "#u": "userId",
      "#l": "loginType"
    },
    ExpressionAttributeValues: {
      ":u": req.body.userId,
      ":l": req.body.loginType
    }
  };
  const result = await dynamo.scan(params).promise();
  res.json(result);
});

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: frontBaseUrl + "/login"
  }),
  function(req, res) {
    res.redirect(frontBaseUrl + "/?userId=" + res.req.user.id + "&loginType=google");
  }
);
router.post("/google/signin", async function(req, res, next) {
  const params = {
    TableName: userTableName,
    FilterExpression: "#u = :u AND #l = :l",
    ExpressionAttributeNames: {
      "#u": "userId",
      "#l": "loginType"
    },
    ExpressionAttributeValues: {
      ":u": req.body.userId,
      ":l": req.body.loginType
    }
  };
  const result = await dynamo.scan(params).promise();
  res.json(result);
});

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
  res.redirect(frontBaseUrl + "/");
});

module.exports = router;

async function isOauthUserRegisterd(userId, provider) {
  const params = {
    TableName: userTableName,
    FilterExpression: "#u = :u AND #l = :l",
    ExpressionAttributeNames: {
      "#u": "userId",
      "#l": "loginType"
    },
    ExpressionAttributeValues: {
      ":u": userId,
      ":l": provider
    }
  };
  const result = await dynamo.scan(params).promise();
  if (result.Count === 0) {
    console.log("user is not existed");
    return false;
  } else {
    console.log("user is existed");
    return true;
  }
}

function oauthUserCreate(userId, provider) {
  let params = {
    TableName: userTableName,
    Item: {
      userId: userId,
      loginToken: utils.getRandomToken(32),
      loginType: provider,
      snipCounts: 0
    }
  };
  dynamo.put(params).promise();
}

function oauthUserUpdate(userId) {
  const updateParams = {
    TableName: userTableName,
    Key: {
      userId: userId
    },
    ExpressionAttributeNames: {
      "#l": "loginToken"
    },
    ExpressionAttributeValues: {
      ":l": utils.getRandomToken(32)
    },
    UpdateExpression: "SET #l = :l"
  };
  dynamo.update(updateParams).promise();
}
