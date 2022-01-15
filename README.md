# SkateSpots
Skate Spots is a skate spot search site for the skateboard community. Users upload either their own personal favorite spots or known spots. Users also have the ability to comment/ rate other spots.

## Motivation
This was a comissioned project that was created to fufill a need for new skateboarders. New could be defined as either just starting out or new to a specific location. Often times when a skateboarder moves to a new location he/she is unaware of where to go skateboard. This site allows for that skateboarder to tap into a once before hidden community by visiting 'new' spots. Not only does this site serve as a spot locator but also as an introduction to a new skate community.

## Tech Used
<b>Built with</b>
- Html, Css, EJs, Javascript, Bootstrap 5
- Node.Js, MongoDb, Express/

<b>Architecture</b>
- MVC

## Features
This project uses restful CRUD routing, nosql data models with MongoDb as well as virtual schemas/properties, user authentication, middleware, geolocation, and image upload capability. The User has the ability to CRUD new spots as well as CRUD rate/review any spot. They can only delete spots/reviews created by that individual User. 

## Security Features
This project is equipped with both client side and route validation. It is secured against Mongo injection, Cross site scripting (XSS) through Html Sanitation, Content security policy, and other additional securitites provided by Helmet. 

## API Reference
- Cloudinary API (image upload): 
https://cloudinary.com/documentation 

- MapBox GeoLocation API/ MapBox API (geolocation & map script):
 https://www.mapbox.com/ 

## Production
You can visit this site at https://www.wtfspots.com

## Credits
All current photos from https://www.unsplash.com

