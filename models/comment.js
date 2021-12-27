const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//add changes

const commentSchema = Schema ({
    text: String,
    rating: Number,
    author: 
    {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
       username: String
     }
});

module.exports = mongoose.model('Comment', commentSchema);