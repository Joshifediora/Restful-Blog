var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");

//App config
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
mongoose.connect(process.env.DATABASEURL);
app.set("view engine", "ejs");
app.use(express.static("Public"));
app.use(methodOverride("_method"));

//Mongose model config
var BlogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now} 
});

var Blog = mongoose.model("Blog", BlogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1457542553555-6331c3c0855f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=3488674f31991d53e6d02334c7ff3a79&auto=format&fit=crop&w=751&q=80",
//     body: "Hello this is the very first blog post created on this site!!!",
// });

//Restful Routes
app.get("/", function(req, res){res.redirect("/blogs")});

//Index route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){console.log(err)}
        else{ res.render("index", {blogs: blogs} );}
    })
   
});

//New Route
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//Create route
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newblog){
       if(err){console.log(err); res.render("new")}
       else{res.redirect("/blogs")}
    });
});

//Show Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundblog){
        if(err){res.redirect("/blogs")}
        else{res.render("show", {blog: foundblog});}
    });
    
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundblog){
    if(err){res.redirect("/blogs/:id")}
    else{res.render("edit", {blog: foundblog});}
    });
});

//Update route
app.put("/blogs/:id", function(req, res){
     req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedblog){
        if(err){res.redirect("/blogs")}
        else{res.redirect("/blogs/"+ req.params.id)}
    });
});

//Delete route
app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){res.redirect("/blogs")}
            else{res.redirect("/blogs");
        }
    });
});





app.listen(process.env.PORT, process.env.IP, function(){console.log("Restful Blog App server is up!!")});