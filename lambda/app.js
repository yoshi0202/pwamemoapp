var createError = require("http-errors");
var express = require("express");
const session = require("express-session");
var DynamoDBStore = require("connect-dynamodb")({ session: session });
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const passport = require("passport");
const utils = require("./utils/utils");

const snipRouter = require("./routes/snip");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/category");
const rankingRouter = require("./routes/ranking");

var app = express();

const DynamoDBStoreOptions = {
  table: "snippy-session",
  hashKey: "sessionId", //ハッシュキー　デフォルトは"id"
  AWSConfigJSON: {
    region: "ap-northeast-1",
    correctClockSkew: true,
    httpOptions: {
      secureProtocol: "TLSv1_method",
      ciphers: "ALL"
    }
  }
  // reapInterval: 24 * 60* 60 * 1000 //セッション情報の保持時間
};

// app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    store: new DynamoDBStore(DynamoDBStoreOptions),
    name: "snippy-session",
    secret: "some secret",
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false }
    // cookie: { secure: true }
  })
);

app.use(logger("dev"));
app.use(express.json({ extended: true, limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(passport.initialize());

app.use("/api/snip", snipRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/ranking", rankingRouter);
app.use("/auth", authRouter);

app.use(function(req, res, next) {
  next(utils.createErrorObj(404, "404 not found"));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    status: err.status || 500,
    err: err.message
  });
  console.log(err);
});

app.listen(3000);
module.exports = app;
