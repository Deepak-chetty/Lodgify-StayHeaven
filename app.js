if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

// const MONGO_URL = "mongodb://localhost:27017/airbnb";
const dbUrl = "mongodb+srv://srdeepak31:lVTeOyRuzo05TKBQ@cluster0.1kkayid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

main().then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
    console.log("Error in Mongo session store", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}



app.set("view Engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.listen(port, () => {
    console.log(`listening to the port ${port}`);
});

// app.get("/", (req, res) => {
//     res.send("Its a root page");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/demouser", async(req, res) => {
    let fakeUser = new User({
        email: "demo@email.com",
        username: "demo-user"
    });
    const registeredUser = await User.register(fakeUser, "demopassword");
    res.send(registeredUser);
});

app.use((req, res, next) => {
    res.locals.Success = req.flash("Success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);


app.all("*", ( req, res, next) => {
    next(new expressError(404, "Page NOT Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Have a good day!"} = err;
    res.status(statusCode).render("error.ejs", {err});
});