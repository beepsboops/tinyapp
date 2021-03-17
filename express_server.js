const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const randomString = function() {
  let r = Math.random().toString(36).substring(7);
  return r;
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index1", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

// Not told to add this in assignment? But need it?
// app.get("/urls_show", (req, res) => {
//   const templateVars = { urls:  };
//   res.render("urls_show", templateVars);
// });

// Not sure if this is needed? Correct?
app.get("/urls/:longURL", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_show/:longURL", templateVars);
});

app.post("/urls", (req, res) => {
  let randomKey = randomString();
  console.log(randomKey);
  console.log(req.body);  // Log the POST request body to the console
  let newLongURL = req.body.longURL
  urlDatabase[randomKey] = newLongURL
  res.redirect(`/urls/${randomKey}`)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  // Prepare data
  console.log("test")
  const key = req.params.shortURL
  // removeURL(urlDatabase, key)
  // Prepare my template variables
  // const templateVars = {}
  // const removeTodo = (todos, key) => {
  delete urlDatabase[key]
  // }
  // Respond
  res.redirect("/urls")
});

app.post("/urls/:shortURL", (req, res) => {
  const longURL = req.body.longURL
  urlDatabase[req.params.shortURL] = longURL
  res.redirect("/urls");
});

//Route for login, using cookies
app.post("/login", (req, res) => {
  // console.log(req.cookies);
  // const templateVars = { username: req.cookies.username }
  const username = req.body.username
  console.log(username)
  res.cookie('username', username)
  console.log(username)
  res.redirect("/urls");
});