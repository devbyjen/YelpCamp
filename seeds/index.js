const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const mbGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbToken = 'pk.eyJ1IjoiZGV2YnlqZW4iLCJhIjoiY2tucXV5dzlvMDJjdzJvbWtobXM3c2I5NCJ9.SVLWu1WXklmR0SA78xptXA';//process.env.MAPBOX_TOKEN;
const geocoder = mbGeocoding({accessToken: mbToken});
const csvFilePath = ('C:/Users/Mom and Dad/Desktop/Jennie/code/bootcamp/YelpCamp/seeds/data/allcampgrounds.csv');
const csv=require('csvtojson');
const {typeLookup, getDescriptionString, getJSONArray} = require('./data/cgDataHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



//get data from csv file

const seedDB = async() => {
    
    const jsonArray = await getJSONArray(csvFilePath, csv);
    await Campground.deleteMany({}); //delete all first
    for(let i=0; i<jsonArray.length; i++){
        let data = jsonArray[i];
        // const randomCity = getRandomElement(cities);
        // const price = Math.floor(Math.random()*20)+10;
        let description = getDescriptionString(data);
        
        const c = new Campground({
            title: data.name,
            location: `${data.city}, ${data.state}`,
            geometry: {
                type: 'Point',
                coordinates: [data.longitude, data.latitude]
            },
            images: {
                url: 'https://res.cloudinary.com/devbyjen/image/upload/v1619454480/YelpCamp/trees-silhouette.jpg',
                filename: "donotdelete",
            },
            description: description,
            author: "6076048071276d098844cefa", //My author id
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