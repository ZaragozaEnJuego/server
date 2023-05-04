import bodyParser from "body-parser";
import indexRouter from "./api/routes/index";
import propertiesRouter from "./api/routes/properties";
import usersRouter from "./api/routes/users";
import authRouter from "./api/routes/auth";
import middlewareAuth from "./api/controllers/middlewareAuth";
import { Request,Response ,NextFunction} from "express";

//FOR TESTING LOOK
//https://dev.to/nathan_sheryak/how-to-test-a-typescript-express-api-with-jest-for-dummies-like-me-4epd

var express = require("express");
require("dotenv").config();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");
const session = require("express-session");


const serverUrl = process.env.SERVER_URL ?? "http://localhost:3000";

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
                url: serverUrl,
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
app.use((req:Request, res:Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
      "Access-Control-Allow-Headers",
      "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

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
