var mongoose = require('mongoose');


var User = mongoose.model(
    'User',
    {
        username: String,
        sessionID: Number,
    }
);

module.exports = User;
