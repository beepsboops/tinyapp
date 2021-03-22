// const userValidation = (userID, email, password, users) => {

// }

const urlsForUser = (urlDatabase, userID) => {
  let result = {};
  if (userID) {
    for (let shortURL in urlDatabase) {
      if (userID === urlDatabase[shortURL].userID) {
        result[shortURL] = urlDatabase[shortURL].longURL;
      }
    }
  }
  return result;
} 

const getExistingUser = (email, users) => { 
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return;
};

const deleteURL = (urlDatabase, shortURL) => {
  delete urlDatabase[shortURL];
}

const editURL = (urlDatabase, shortURL, newLongURL) => {
  console.log(urlDatabase)
  urlDatabase[shortURL].longURL = newLongURL;
}

const urlOwnershipValidation = (urlDatabase, userID, shortURL) => {
  if (urlDatabase[shortURL].userID === userID) {
    return true;
  } else {
    return false;
  }
}

// COPY OF URL DATABASTE 2.0 // REMOVE LATER
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

module.exports = { getExistingUser, urlsForUser, deleteURL, editURL, urlOwnershipValidation }