var createError = require("http-errors");
var express = require("express");
const session = require("express-session");
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

var app = express();

app.use(
  session({
    secret: "some secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(passport.initialize());

app.use("/api/snip", snipRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/auth", authRouter);

app.use(function(req, res, next) {
  next(utils.createErrorObj(404, "404 not found"));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status).json({
    status: err.status,
    err: err.message
  });
  console.log(err);
});

app.listen(3000);
module.exports = app;
