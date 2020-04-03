var mongoose = require("mongoose");

var destinationSchema = new mongoose.Schema({
    name: String,
    cost: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    comments: [
        {type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"}
    ],
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model("Destination", destinationSchema);