var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    app = express();

mongoose.connect("mongodb://localhost:27017/blogs", {useNewUrlParser:true});
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));

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
    newBlog = req.body;
    Blog.create(newBlog, function(err, newBlog){
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

app.listen("2900", function(){
    console.log("Server RunninG!!");
})