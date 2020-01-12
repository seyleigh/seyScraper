const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");
const PORT = process.env.PORT || 3000;
const app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");


// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://<dbuser>:<dbpassword>@ds253368.mlab.com:53368/heroku_11dr059t";
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://usertest:password1@ds253368.mlab.com:53368/heroku_11dr059t";


// mongoose.connect(MONGODB_URI);
mongoose.connect(MONGODB_URI, {
useUnifiedTopology: true,
useNewUrlParser: true
});

app.get("/", ((req, res) => {
    db.Article.find({"saved": false}).then(result => {
        let hbsObject = {articles: result};
        res.render("home", hbsObject);
    }).catch(err => res.json(err));
}));

app.get("/scraped", ((req, res) => {
    axios.get("https://www.denverpost.com/business/jobs/").then(response =>{
        const $ = cheerio.load(response.data);
        $("div.section-highlight-content").each((i, element) => {
            const result = {};
            result.title = $(element).find("h4").find("a").attr("title");
            result.link = $(element).children("a").attr("href");
            result.summary = $(element).find("div").children(".excerpt").text().trim();
            db.Article.create(result).then(dbArticle => {
                console.log(dbArticle)
            })
            .catch(err => {
                console.log(err);
            });
        });
    });
    res.send("Scrape Complete");
}));

app.get("/saved", ((req,res) => {
    db.Article.find({"saved": true}).populate("notes").then(result =>{
        let hbsObject = {articles: result};
        res.render("saved", hbsObject);
    }).catch(err => res.json(err));

}));

app.post("/saved/:id", ((req, res) => {
    db.Article.findOneAndUpdate({"_id": req.params.id}, {"$set": {"saved": true}})
    .then(result => res.json(result))
    .catch(err => res.json(err));
}));

app.post("/delete/:id", ((req, res) => {
    db.Article.findOneAndUpdate({"_id": req.params.id}, {"$set": {"saved": false}})
    .then(result => res.json(result))
    .catch(err => res.json(err));
}));

app.get("/articles/:id", ((req, res) => {
    db.Article.findOne({"_id": req.params.id}).populate("notes").then(result => res.json(result)).catch(err => res.json(err));
}));

app.post("/articles/:id", ((req, res) => {
    db.Note.create(req.body).then(dbNote => {
        return db.Article.findOneAndUpdate({"_id": req.params.id}, {"notes": dbNote._id}, {new: true});
    }).then(dbArticle => res.json(dbArticle)).catch(err => res.json(err));
}));

app.post("/deleteNote/:id", ((req, res) => {
    db.Note.remove({"_id": req.params.id}).then(result => res.json(result)).catch(err => res.json(err));
}));

app.listen(PORT, () => console.log(`app running on port ${PORT}`));