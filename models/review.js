const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    body: String,
    rating: Number, //1-5
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review', ReviewSchema);