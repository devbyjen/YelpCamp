const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true //not a validation! check elsewhere
    }
});

//This will add in username, password - salted & hashed, extra functions
UserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('User', UserSchema);