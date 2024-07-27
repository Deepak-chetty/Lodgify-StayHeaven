const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const { reviewSchema} = require("../schema.js");
const review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



// post review route
router.post("/", isLoggedIn, validateReview, reviewController.createReview);

// delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviewController.destroyReview);


module.exports = router;