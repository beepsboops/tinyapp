const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { isExistingUser } = require(`./helperFunctions`)

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// users Object
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

// console.log(users)





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
  const templateVars = { urls: urlDatabase, user:users[req.cookies.userID] };
  res.render("urls_index1", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user:users[req.cookies.userID] };
  res.render("urls_new", templateVars );
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user:users[req.cookies.userID] };
  res.render("urls_show", templateVars);
});

// Not told to add this in assignment? But need it?
// app.get("/urls_show", (req, res) => {
//   const templateVars = { urls:  };
//   res.render("urls_show", templateVars);
// });

// Not sure if this is needed? Correct?
app.get("/urls/:longURL", (req, res) => {
  const templateVars = { urls: urlDatabase, user:users[req.cookies.userID] };
  res.render("urls_show/:longURL", templateVars);
});

// Route for register
app.get("/register", (req, res) => {
  const templateVars = { user:users[req.cookies.userID] };
  res.render("register", templateVars);
});

// Route new login page
app.get("/login2", (req, res) => {
  const templateVars = { user:users[req.cookies.userID] };
  res.render("login2", templateVars);
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
  res.cookie('username', username)
  res.redirect("/urls");
});

// Route for logout, clearing cookie
app.post("/logout", (req, res) => {
  // console.log(req.cookies);
  // const templateVars = { username: req.cookies.username }
  res.clearCookie('userID')
  res.redirect("/urls");
});

// Route for handling registration form data (POST)
app.post("/register", (req, res) => {
  
  // Set up required info
  console.log("req.body", req.body)
  const email = req.body.email
  const password = req.body.password

  // If the e-mail or password are empty strings, send response with 400 status code
  if ((!email) || (!password)) {
    res.status(400).send("Email and password cannot be blank");
    return;
  }
  
  if (isExistingUser(email, users)) { 
  // If someone tries registering with email already in users object, send response with 400 status code 
    res.status(400).send("User already exists");
    return;
  }
  
  // Create random user ID
  let randomUserID = randomString();
  console.log("randomUserID", randomUserID)
  
  // Create new user object SOMETHING IS WRONG HERE
  let newUser = { id: randomUserID, email: email, password: password }
  console.log("newUser", newUser)

  // Add new user to global users object?
  users[randomUserID] = newUser

  // Set a user_id cookie containing the user's newly generated ID
  res.cookie('userID', randomUserID)

  // Test that the users object is properly being appended to
  console.log(users)

  // Set conditionals to handle registration errors

  // Redirect the user to the /urls page.
  res.redirect("/urls");

});