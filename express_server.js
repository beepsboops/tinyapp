const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
// const cookieParser = require('cookie-parser'); // Deprecated, replace with cookieSession
const { getExistingUser, urlsForUser, deleteURL, editURL, urlOwnershipValidation } = require(`./helperFunctions`);
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser()); // Deprecated, replace with cookieSession
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.set("view engine", "ejs");

// URL DATABASTE 1.0 // Deprecated, replaced with URL DATABASE 2.0
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

// URL DATABASTE 2.0
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "h4z1qj" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "h4z1qj" }
};

// USERS DATABASE
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "h4z1qj": {
    "id": "h4z1qj",
    "email": "user5@example.com",
    "password": "$2b$10$PZghxzozpmH6OmOBUGR8p.KkILzHSD2QKE0PATycdCg687d6jKbg."
  }
};

// RANDOM STRING FUNCTION
const randomString = function() {
  let r = Math.random().toString(36).substring(7);
  return r;
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  // console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// [GET] HOMEPAGE 1.0 (DEPRECATED, REPLACED WITH HOMEPAGE 2.0)
// app.get("/urls", (req, res) => {
//   const templateVars = { urls: urlDatabase, user: users[req.session.user_id] };
//   res.render("urls_index1", templateVars);
// });

// [GET] HOMEPAGE 2.0
app.get("/urls", (req, res) => {
  let userID = req.session.user_id;
  const user = users[userID];
  const templateVars = {user: user, urls: urlsForUser(urlDatabase, userID)};
  res.render("urls_index1", templateVars);
});

// [GET] /U/ REDIRECT TO LONG URL PAGE
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// [GET] URLS NEW PAGE
app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = { user: user };
  if (user) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect('/login');
  }
});

// [GET] SHORT URLS PAGE
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const currentLongURL = urlDatabase[req.params.shortURL].longURL;
  const user = users[req.session.user_id];
  const templateVars = { shortURL: shortURL, currentLongURL: currentLongURL, user: user };
  res.render("urls_show", templateVars);
});

// [GET] LONG URLS PAGE // Not sure if this is needed? Correct?
app.get("/urls/:longURL", (req, res) => {
  const templateVars = { urls: urlDatabase, user:users[req.session.user_id] };
  res.render("urls_show/:longURL", templateVars);
});

// [GET] REGISTRATION FORM
app.get("/register", (req, res) => {
  const templateVars = { user:users[req.session.user_id] };
  res.render("register", templateVars);
});

// [GET] LOGIN FORM
app.get("/login", (req, res) => {
  // res.render("login", {user: ""}); // Used for testing
  res.render("login", {user: users[req.session.user_id]});
});

// [GET] EDIT
app.get("/urls/:shortURL/edit", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  const currentLongURL = urlDatabase[req.params.shortURL].longURL;
  const templateVars = { user: user, currentLongURL: currentLongURL, shortURL: req.params.shortURL};
  res.render("edit", templateVars);
});

// [GET] GET DATABASE // FOR DEBUGGING ONLY <- REALLY USEFUL!, COMMENTED OUT FOR SECURITY
// To use, navigate to http://localhost:8080/usersDatabase
// Displays current/udpated database in memory
// app.get("/usersDatabase", (req, res) => {
//   res.json(users);
// });

// [POST] URLS MAIN PAGE
app.post("/urls", (req, res) => {
  let randomKey = randomString();
  let newLongURL = req.body.longURL;
  urlDatabase[randomKey] = newLongURL;
  res.redirect(`/urls/${randomKey}`);
});

// [POST] NEW LOGIN
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // If the e-mail or password are empty strings, send response with 400 status code
  if ((!email) || (!password)) {
    res.status(400).send("Email and password cannot be blank");
    return;
  }
  
  const currentUser = (getExistingUser(email, users));

  // Check if currentUser exists in database; if it does, proceed to next step
  if (!currentUser) {
    res.status(404).send("User does not exist");
    return;
  }
  
  // Check if user provided plaintext password matches hashed password
  const hashedPassword = currentUser.password;
  const passwordVerified = bcrypt.compareSync(password, hashedPassword);
  if (!passwordVerified) {
    res.status(401).send("Invalid login");
    return;
  }
  
  // User is now presummed to be valid
  // Set a user_id cookie containing the user's newly generated ID and redirect to /urls page
  req.session.user_id = currentUser.id;
  res.redirect("/urls");
});

// [POST] DELETE
app.post("/urls/:shortURL/delete", (req, res) => {

  // PSUEDO LOGIC
  // Prepare necessary info
  // We need to know who's logged in (userID) and what their URLs are (urls)
  // const templateVars = {user: user, urls: urlsForUser(urlDatabase, userID)}

  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
    
  // Check to make sure that user is logged in
  // if !user then redirect
  // else if user === true
    // delete URL requested for deletion
    // call deleteURL function, pass in appropriate object & key
  
  // user = logged in user
  // urls = long URLs for logged in user

  if (urlOwnershipValidation(urlDatabase, userID, shortURL)) {
    deleteURL(urlDatabase, shortURL);
    res.redirect("/urls");
  } else {
      res.redirect("/urls");
  }
});

// [POST] EDIT
app.post("/urls/:shortURL/edit", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  editURL(urlDatabase, shortURL, longURL);
  res.redirect("/urls");
});

// [POST] SHORT URL -> LONG URL REDIRECT PAGE
app.post("/urls/:shortURL", (req, res) => {
  const currentLongURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect("/urls", currentLongURL);
});

// [POST] LOGOUT, CLEARS COOKIES
app.post("/logout", (req, res) => {
  req.session.user_id = "";
  res.redirect("/urls");
});

// [POST] REGISTRATION FORM
app.post("/register", (req, res) => {
  
  // Set up required info
  const email = req.body.email;
  const password = req.body.password;

  // If the e-mail or password are empty strings, send response with 400 status code
  if ((!email) || (!password)) {
    res.status(400).send("Email and password cannot be blank");
    return;
  }
  
  if (getExistingUser(email, users)) {
  // If someone tries registering with email already in users object, send response with 400 status code
    res.status(400).send("User already exists");
    return;
  }
  
  // Create random user ID
  let randomUserID = randomString();
  
  // bycrypt implementation here
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create new user object
  let newUser = { id: randomUserID, email: email, password: hashedPassword };

  // Add new user to global users object
  users[randomUserID] = newUser;

  // Set a user_id cookie containing the user's newly generated ID
  req.session.user_id = randomUserID;

  // Test that the users object is properly being appended to
  // console.log(users)

  // Set conditionals in templates to handle registration errors

  // Redirect the user to the /urls page.
  res.redirect("/urls");
});

// [POST] LOGIN NAVBAR (DEPRECATED, REPLACED BY LOGIN FORM, GET, POST)
// app.post("/login", (req, res) => {
//   const username = req.body.username
//   res.cookie('username', username)
//   res.redirect("/urls");
// });

/* COMPLETED TESTS
[x] A user can register
[x] A user cannot register with an email address that has already been used
[x] A user can log in with a correct email/password
[x] A user sees the correct information in the header
[x] A user cannot log in with an incorrect email/password
[x] A user can log out
*/