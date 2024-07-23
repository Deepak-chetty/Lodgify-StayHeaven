const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const review = require("./models/reviews.js");


const MONGO_URL = "mongodb://localhost:27017/airbnb";

main().then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view Engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.listen(port, () => {
    console.log(`listening to the port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Its a root page");
});


const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next();
    }
};

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }else{
        next();
    }
};

// app.get("/testListing", async (req, res) => {
//     let samplelisting = new listing({
//         title: "Beach floor",
//         Description: "Sea side resto & for perfect view",
//         price: 2350,
//         location: "Chinod Beach, Chinod Beach Road, Pdm",
//         country: "India"
//     });

//     await samplelisting.save();
//     console.log("Successfully saved");
//     res.send("Done");
// });


// index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));


// new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});



// Show Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listing});
}));

// create route
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


// edit route
app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));


// update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));


// delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
}));


// reviews
// post review route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listingg = await Listing.findById(req.params.id);
    let newReview = await review(req.body.review);

    listingg.reviews.push(newReview);

    await newReview.save();
    await listingg.save();

    res.redirect(`/listings/${listingg._id}`);
}));

// delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync( async(req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
}))

app.all("*", ( req, res, next) => {
    next(new expressError(404, "Page NOT Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Have a good day!"} = err;
    res.status(statusCode).render("error.ejs", {err});
});