var express = require("express"),
    mongoose = require("mongoose"),
    expressSanitizer = require("express-sanitizer"),
    bodyParser = require("body-parser"),
    app = express(),
    methodOverride = require("method-override");

mongoose.connect("mongodb://localhost:27017/blogs", {useNewUrlParser:true});
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default:Date.now}
})

var Blog = mongoose.model("Blog",blogSchema);


// Blog.create({
//     title: "testDog",
//     image: "https://alpinewebmedia.com/wp-content/uploads/2018/02/pictures-on-the-web-free-to-use.jpg",
//     body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
// })

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs:blogs});
        }
    });
})

app.get("/blogs/new", function(req, res){
    res.render("new");
})

app.post("/blogs", function(req,res){
    // console.log(req.body.body);
    req.body.body = req.sanitize(req.body.body);
    
    Blog.create(req.body.body, function(err, newBlog){
        if(err){
            console.log(err);
        }
        else{
            console.log(newBlog);
            res.redirect("/blogs");
        }
    });
})

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        res.render("display", {blog:blog});
    })
})

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("edit", {blog:foundBlog});
        }
    })
})

app.put("/blogs/:id", function(req, res){
    req.body = req.sanitize(req.body);
    Blog.findByIdAndUpdate(req.params.id, req.body, function(err, updatedBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findOneAndRemove(req.params.id, function(err){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen("2900", function(){
    console.log("Server RunninG!!");
})