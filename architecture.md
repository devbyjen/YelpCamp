YelpCamp
--a website to find and rank campgrounds.

Node Modules: express, mongoose, ejs

Steps from video:
406: set up basics

- express, (start & test server is running)
- ejs (set view engine, make view directory, create a route and use one easy view as a test.)
- mongoose (make models dir, create a schema, export it, connect in app, connect to mongo, add basic connection error handling, create new instance of model in a route to test - dummy info, save to db, print it out. run that view, then check db for data.)

407: seeding campgrounds

- a bunch of fake data to work with. Random city, random descriptor, random place name. Create seeds file that deletes all in db, and replaces with 50 randomly generated campgrounds.
