//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Enthusia, VJTI blog page";
const aboutContent = "Enthusia is VJTI’s annual sports festival, generally held in the month of December. Enthusia has inter-college as well as intra-college events in a variety of sports. Enthusia provides the students with the much-needed physical activity amidst their busy academic schedule. We, at VJTI, are fortunate to have a basketball court, cricket ground, football ground, and an indoor and outdoor Gymnasium.";
const contactContent = "Contact the committee members via VJTI login ID";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true });

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);

let posts = [];

app.get("/", function(req, res) {

    Post.find({}, function(err, posts) {
        res.render("home", {
            startingContent: homeStartingContent,
            posts: posts
        });
    });
});

app.get("/about", function(req, res) {
    res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function(req, res) {
    res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function(req, res) {
    res.render("compose");
});

app.post("/compose", function(req, res) {
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
    });

    posts.push(post);

    post.save();

    post.save(function(err) {

        if (!err) {

            res.redirect("/");

        }

    });
    res.redirect("/");

});

app.get("/posts/:postId", function(req, res) {
    const requestedTitle = _.lowerCase(req.params.postName);
    const requestedPostId = req.params.postId;
    posts.forEach(function(post) {
        const storedTitle = _.lowerCase(post.title);

        if (storedTitle === requestedTitle) {
            res.render("post", {
                title: post.title,
                content: post.content
            });
        }
    });
    Post.findOne({ _id: requestedPostId }, function(err, post) {

        res.render("post", {

            title: post.title,

            content: post.content

        });

    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});