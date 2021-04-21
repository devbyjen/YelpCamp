const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async() => {
    await Campground.deleteMany({}); //delete all first
    for(let i=0; i<50; i++){
        const randomCity = getRandomElement(cities);
        const price = Math.floor(Math.random()*20)+10;
        const c = new Campground({
            title: `${getRandomElement(descriptors)} ${getRandomElement(places)}`,
            location: `${randomCity.city}, ${randomCity.state}`,
            images: {
                url: "https://source.unsplash.com/collection/155011",
                filename: "filename"
            },
            description: "A campy campground blah blah blahA campy campground blah blah blahA campy campground blah blah blahA campy campground blah blah blahA campy campground blah blah blahA campy campground blah blah blahA campy campground blah blah blahA campy campground blah blah blahA campy campground blah blah blahA campy campground blah blah blah",
            price,
            author: "6076048071276d098844cefa",
            averageRating: 0
        });
        await c.save();
    }
}

seedDB().then( () => {
    mongoose.connection.close();
});

function getRandomElement(arr) {
    const randomNum = Math.floor(Math.random() * arr.length);
    return arr[randomNum];
}