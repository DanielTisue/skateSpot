const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Skatespot = require("./models/skatespot");
const Comment = require("./models/comment");
//const User = require("./models/user");
const methodOverride = require("method-override");
const seedDB = require("./seeds");
const commentRoutes = require("./routes/comments");
const skatespotRoutes = require("./routes/skatespots");

mongoose.connect("mongodb://localhost:27017/slam_spot", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
seedDB();

// app.use("/", authRoutes);
app.use("/skateSpots", skatespotRoutes);
app.use("/skateSpots/:id/comments", commentRoutes);

app.get('/', (req, res) => {
 res.render('landing'); 
});

// //INDEX
// app.get('/skateSpots', (req,res) => {
//     Skatespot.find({}, (err, allSkatespots) => {
//     if(err){
//         console.log(err);
//     } else {
//         res.render('skatespots/index', {skatespots: allSkatespots});
//     }
//   });
// });

// //CREATE Skatespot
// app.post("/skateSpots", (req, res) => {
//     // get data from form and add to skatespots array
//     var name = req.body.name;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var newSkatespot = {name: name, image: image, description: desc};
//     // Create a new skatespot and save to DB
//     Skatespot.create(newSkatespot, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             //redirect back to skatespots page
//             res.redirect("skatespots/index");
//         }
//     });
// });

// //NEW - show form to create new skatespot
// app.get("/skateSpots/new", (req, res) => {
//   res.render("skatespots/new"); 
// });

// //SHOW page
// app.get("/skateSpots/:id", function(req, res) {
//     //find the skatespot with provided ID
//     // Skatespot.findById(req.params.id, function(err, foundSkatespot){
//     //     if(err){
//     //         console.log(err);
//     //     } else {
//     //         res.render("show", {skatespot: foundSkatespot});
//     //     }
//     // });
    
//     Skatespot.findById(req.params.id).populate("comments").exec(function(err, foundSkatespot){
//         if(err){
//             console.log(err);
//         } else {
//             console.log(foundSkatespot);
//             //render show template with that skatespot
//             res.render("skatespots/show", {skatespot: foundSkatespot});
//         }
//     });
// });

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server Started!");
});