var mongoose = require('mongoose');
const Comment = require('./comment');

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

// Pre-Hook - When a campsite is destroyed attempt to destroy all associated comments.
campsiteSchema.pre('remove', async function() {
    await Comment.remove({
        _id: {
            $in: this.comments
        }
    });
});

module.exports = mongoose.model("Campsite", campsiteSchema);