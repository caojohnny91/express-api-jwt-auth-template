const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Add in constant for the numberconst
SALT_LENGTH = 12;

// we want to set up a new router and create a POST route for /signup
// In most applications, signing up for a new account will automatically authenticate the new user. Let’s implement that by adding our fancy new jwt code to the response from our /users/signup route, and including the token in our response as well:
router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && bcrypt.compareSync(req.body.password, user.hashedPassword)) {
      const token = jwt.sign(
        { username: user.username, _id: user._id },
        process.env.JWT_SECRET
      );
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: "Invalid username or password." });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// Now that a user can sign up, next let’s create a route that allows users to sign in to our application. As with the sign up route, we’ll be using bcrypt - this time to handle checking the user’s credentials.

// We’ll use the built in Bcrypt compareSync() method to check the user’s password. This method takes two arguments - an unhashed password and a hashed password - and checks if they match. If so, the method returns true, otherwise it will return false.

// For now, we’ll just return a boilerplate message in the instance that the passwords match, return a different message for invalid credentials, and add our standard error handling in the catch block:
router.post("/signup", async (req, res) => {
  try {
    // Check if the username is already taken
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.json({ error: "Username already taken." });
    }
    // Create a new user with hashed password
    const user = await User.create({
      username: req.body.username,
      hashedPassword: bcrypt.hashSync(req.body.password, SALT_LENGTH),
    });
    const token = jwt.sign(
      { username: user.username, _id: user._id },
      process.env.JWT_SECRET
    );
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
