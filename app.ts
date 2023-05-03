import bodyParser from "body-parser";
import indexRouter from "./api/routes/index";
import propertiesRouter from "./api/routes/properties";
import usersRouter from "./api/routes/users";
import authRouter from "./api/routes/auth";
import middlewareAuth from "./api/controllers/middlewareAuth";

//FOR TESTING LOOK
//https://dev.to/nathan_sheryak/how-to-test-a-typescript-express-api-with-jest-for-dummies-like-me-4epd

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");
const session = require("express-session");

//Swagger
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Zaragoza en juego",
            version: "0.1.0",
            description: "Jueguito divertido",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
            {
                url: "http://localhost:3001",
            },
            {
                url: "https://server-production-29b0.up.railway.app",
            },
        ],
    },
    apis: ["./api/controllers/*.ts", "./api/models/*.ts"],
};

const specs = swaggerJsdoc(options);

//Mongoose
require("./api/models/db");

var app = express();
app.disable("x-powered-by");

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "cat",
        resave: false,
        saveUninitialized: false,
    })
);

app.use("/", indexRouter);

app.use(passport.authenticate("session"));
app.use("/api/auth", authRouter);

if (process.env.NODE_ENV === "production") {
    app.use(middlewareAuth);
}

app.use("/properties", propertiesRouter);
app.use("/users", usersRouter);
export default app;
