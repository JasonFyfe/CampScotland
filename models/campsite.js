var mongoose = require('mongoose');

// SCHEMA SETUP
var campsiteSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
});

module.exports = mongoose.model("Campsite", campsiteSchema);