const mongoose = require("mongoose");
const Reviews = require("./reviews");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String
    },
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/two-brown-table-outside-Z95viY3WaZs",
        Set: (v) => v === "" ? "https://unsplash.com/photos/two-brown-table-outside-Z95viY3WaZs" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Reviews.deleteMany({_id: {$in: listing.reviews}});
    }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;