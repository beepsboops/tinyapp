const { assert } = require('chai');

const { getExistingUser } = require('../helperFunctions.js');

const testUsers = {
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
};

describe('getExistingUser', function() {
  it('should return a user with valid email', function() {
    const user = getExistingUser("user@example.com", testUsers)
    const expectedOutput = testUsers.userRandomID;
    // Write your assert statement here
    assert.equal(user, expectedOutput)
  });
  it('should return undefined with a non-existent email', function() {
    const user = getExistingUser("mrbean@example.com", testUsers)
    const expectedOutput = undefined;
    // Write your assert statement here
    assert.equal(user, expectedOutput)
  });
});