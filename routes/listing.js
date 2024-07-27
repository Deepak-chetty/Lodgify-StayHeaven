const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// new route
router.get("/new", isLoggedIn, listingcontroller.renderNewForm);


router.route("/")
.get(wrapAsync(listingcontroller.index))// index route
.post(isLoggedIn, upload.single('listing[image]'), validateListing, listingcontroller.create); // create route


router.route("/:id")
.get( wrapAsync(listingcontroller.show))// show route
.put( isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, listingcontroller.update)// update route
.delete(isLoggedIn, isOwner, listingcontroller.destroy);// delete route


// edit route
router.get("/:id/edit", isLoggedIn, isOwner,  listingcontroller.edit);

module.exports = router;