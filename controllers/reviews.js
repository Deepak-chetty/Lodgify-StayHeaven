const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const review = require("../models/reviews.js");

module.exports.createReview = wrapAsync(async (req, res) => {
    let listingg = await Listing.findById(req.params.id);
    let newReview = await review(req.body.review);
    newReview.author = req.user._id;

    listingg.reviews.push(newReview);

    await newReview.save();
    await listingg.save();

    req.flash("Success", "Review posted");
    res.redirect(`/listings/${listingg._id}`);
});

module.exports.destroyReview = wrapAsync( async(req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);

    req.flash("Success", "Review was deleted");

    res.redirect(`/listings/${id}`)
});