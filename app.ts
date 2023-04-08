import indexRouter from "./api/routes/index";
import propertiesRouter from "./api/routes/properties";
import usersRouter from "./api/routes/users";
import authRouter from "./api/routes/auth";


//FOR TESTING LOOK
//https://dev.to/nathan_sheryak/how-to-test-a-typescript-express-api-with-jest-for-dummies-like-me-4epd

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require('passport');
const session = require('express-session');


//Mongoose
require("./api/models/db");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/properties", propertiesRouter);
app.use("/users", usersRouter);

app.use(session({
    secret: 'cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.authenticate('session'));
app.use('/api/auth', authRouter);

export default app;
