var express = require("express");
var exphbs = require("express-handlebars");
var session = require("express-session");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });


const defaultNote = {
  title: "Willkommen",
  content:
    "Herzlich wilkommen bei NeverNote, der sichersten Notizen-App der Welt. ",
};

let publicNotes = [defaultNote];

var app = express();

app.use(urlencodedParser);

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "random very secure text",
    resave: false,
    maxAge: 24*60*60*1000,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use("/static", express.static("static"));

app.get("/", function (req, res) {
    const privateNotes = req.session.notes || [];
    res.render("home", { publicNotes,  privateNotes });
});

app.post("/", function (req, res) {
  const note = {
    title: req.body.title,
    content: req.body.content,
  };
  if (req.body.public) {
    publicNotes.unshift(note);
  } else {
      if(req.session.notes) req.session.notes.unshift(note);
      else req.session.notes = [note];
  }
  res.redirect('/')
});

app.post("/clear", function (req, res) {
    req.session.notes = [];
    res.redirect('/')
   });

app.post("/clearall", function (req, res) {
   console.log("delete everything");
   publicNotes = [defaultNote];
  });

app.listen(3000);
