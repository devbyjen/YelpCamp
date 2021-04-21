YelpCamp
--a website to find and rank campgrounds.

Node Modules:

- express: the server
- mongoose: connect to db
- ejs: templating
- method-override: send request types other than get/post from forms
- joi: form validation
- express-session: sessions
- connect-flash: flash messages
- bcrypt: hash passwords (not used bc passport?)
- passport: handle login/auth
- passport-local: login with username/password
- passport-local-mongoose: add passport stuff to mongoose schemas
- multer (handling forms with enctype=multipart/form-data, aka file uploads)
  -dotenv loads environment variables from a .env file (store that config separate from your code!)
  -cloudinary (image file hosting)
  -multer-storage-cloudinary (connect upload with image file hosting)
  -sharp (image resizing)
  -@mapbox/mapbox-sdk (geocoding and location mapping)

Steps from video:
406: set up basics

- express, (start & test server is running)
- ejs (set view engine, make view directory, create a route and use one easy view as a test.)
- mongoose (make models dir, create a schema, export it, connect in app, connect to mongo, add basic connection error handling, create new instance of model in a route to test - dummy info, save to db, print it out. run that view, then check db for data.)

407: seeding campgrounds

- a bunch of fake data to work with. Random city, random descriptor, random place name. Create seeds file that deletes all in db, and replaces with 50 randomly generated campgrounds.

Steps to data validation:

- bootstrap data validation before form submits
- joi data validation after submit but before db
- mongodb data requirements

Authentication:

-uses Passport for login details

Routes/controller uses MVC (Model View Controller)
-data-headvy in /models
-everything user sees in /views
-heart of the application in /controllers

Style:
-stars from starability.css
-bootstrap

External tools:
-cloudinary for image hosting
-mapbox for geocoding/location mapping

BUG LIST:
-show page: image carousel either broken or RIDICULOUSLY slow. (EDIT: I think the indicators are not working. Yet another fun bootstrap bug!)
