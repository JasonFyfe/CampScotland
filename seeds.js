var mongoose = require('mongoose');
var Campsite = require('./models/campsite');
var Comment = require('./models/comment');

var data =
[
    {
        name: "Loch Lomond",
        image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Loch_Lomond%2C_looking_south_from_Ben_Lomond.jpg",
        description: "Loch Lomond is situated in the Trossachs National Park."
    },
    {
        name: "Loch Ness",
        image: "https://www.historic-uk.com/wp-content/uploads/2017/04/loch-ness-monster-2800x1440.jpg",
        description: "Loch Ness is a freshwater loch in the Highlands."
    },
    {
        name: "Loch Fyne",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Loch_Fyne_from_Tighcladich.jpg",
        description: "Loch Fyne is a sea loch off the Firth of Clyde."
    },
]

function seedDB() {
    Campsite.remove({}, (err) => {
        if(err) {
            console.log(err);
        }
        console.log("Removed all campsites!");

        data.forEach(seed => {
            Campsite.create(seed, (err, campsite) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Added a campsite");

                    Comment.create
                    ({
                        text: "Absolutely stunning, 4g signal isn't great though!",
                        author: "Jason.F"
                    }, (err, comment) => {
                        if(err) {
                            console.log(err);
                        } else {
                            campsite.comments.push(comment);
                            campsite.save();
                            console.log("New Comment Created");
                        }
                    });
                }
            });
        });
    });
};

module.exports = seedDB;