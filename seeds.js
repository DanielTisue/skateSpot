var mongoose = require("mongoose");
var Skatespot = require("./models/skatespot");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Leap of Faith", 
        image: "https://images.unsplash.com/photo-1496886077455-6e206da90837?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "blah blah blah"
    },
    {
        name: "Kareem Krooked", 
        image: "https://images.unsplash.com/photo-1454094309557-181967334e22?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "blah blah blah"
    },
    {
        name: "Guy Mariano Mouse", 
        image: "https://images.unsplash.com/30/skater.jpg?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "blah blah blah"
    },
    {
        name: "Leap of Faith", 
        image: "https://images.unsplash.com/photo-1496886077455-6e206da90837?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "blah blah blah"
    },
    {
        name: "Leap of Faith", 
        image: "https://images.unsplash.com/photo-1496886077455-6e206da90837?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "blah blah blah"
    },
    {
        name: "Leap of Faith", 
        image: "https://images.unsplash.com/photo-1496886077455-6e206da90837?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "blah blah blah"
    },
    {
        name: "Leap of Faith", 
        image: "https://images.unsplash.com/photo-1496886077455-6e206da90837?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "blah blah blah"
    },
    {
        name: "Leap of Faith", 
        image: "https://images.unsplash.com/photo-1496886077455-6e206da90837?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
        description: "blah blah blah"
    }
];

function seedDB(){
   //Remove all Skatespots
   Skatespot.remove({}, function(err){
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log("removed Skatespots!");
    //      //add a few Skatespots
    //     data.forEach(function(seed){
    //         Skatespot.create(seed, function(err, skatespot){
    //             if(err){
    //                 console.log(err);
    //             } else {
    //                 console.log("added a skatespot");
    //                 //create a comment
    //                 Comment.create(
    //                     {
    //                         text: "This place is great, but I wish there was internet",
    //                         author: "Homer"
    //                     }, function(err, comment){
    //                         if(err){
    //                             console.log(err);
    //                         } else {
    //                             //add a few comments
    //                             skatespot.comments.push(comment);
    //                             skatespot.save();
    //                             console.log("Created new comment");
    //                         }
    //                     });
    //             }
    //         });
    //     });
    }); 
};

module.exports = seedDB;