// HELPER FUNCTIONS

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

module.exports = { urlsForUser, getExistingUser, deleteURL, editURL, urlOwnershipValidation }