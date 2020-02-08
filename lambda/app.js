var createError = require("http-errors");
var express = require("express");
const session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const passport = require("passport");

var snipRouter = require("./routes/snip");
var userRouter = require("./routes/user");
var authRouter = require("./routes/auth");
var categoryRouter = require("./routes/category");

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
