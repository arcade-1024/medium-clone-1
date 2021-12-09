const express = require("express");
const app = express();
const mongoose = require("mongoose");

const UserModule = require("./user");
const PostModule = require('./post');
const AuthModule = require("./auth");

const userModule = new UserModule();
const authModule = new AuthModule();
const postModule = new PostModule();

const {controller: userController} = userModule;
const {controller: authController} = authModule;
const {controller: postController} = postModule

const passport = require("passport");
const session = require("express-session");
require("./config/passport")(passport);

mongoose
    .connect("mongodb://db:27017/medium-clone")
    .then(() => console.log("MongoDB up"))
    .catch((e) => console.log(e));

require("dotenv").config();

app.use(express.json());

app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

const {routes: userRoutes, rootRoute: userRootRoute} =
    userController.initializeRouter();

const {routes: authRoutes, rootRoute: authRootRoute} =
    authController.initializeAuthRouter();

const {routes: postRoutes, rootRoute: postRootRoutes} = postController.initializeRouter()

const router = express.Router();


const createRoutes = (rootRoute, route) =>
    router[route.method.toLowerCase()](
        `${rootRoute}${route.route}`,
        ...[...route.middleware, route.function]
    );

authRoutes.forEach((route) => createRoutes(authRootRoute, route));

userRoutes.forEach((route) => createRoutes(userRootRoute, route));

postRoutes.forEach((route) => createRoutes(postRootRoutes, route));

app.use(router);

const port = process.env.PORT;

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});
