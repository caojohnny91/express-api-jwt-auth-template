const express = require("express");
const router = express.Router();
// Add in the jsonwebtoken package
const jwt = require("jsonwebtoken");

router.get("/sign-token", (req, res) => {
  //   res.json({ message: "you are authorized!" }), just for testing route

  // Mock user object payload added
  const user = {
    id: 1,
    username: "test",
    password: "test",
  };
  const token = jwt.sign({ user }, process.env.JWT_SECRET);
  // Send the token back to the client
  res.json({ token });
});

// When we send a request to the verify-token route, the token will be included in the request’s headers. We can access this token in the route handler using req.headers.authorization.
// In our code, let’s return to our verify-token route. Remove the placeholder message from res.json and replace it with a new token variable from req.headers.authorization

router.post("/verify-token", (req, res) => {
  try {
    // res.json({ message: 'Token is valid.' }); for postman test

    // Notice the word Bearer is in front of the token. This is a convention that is used to specify the type of token that is being sent. We will need to remove this word before we can verify the token, because the verify method only expects the token with nothing else prepended.
    // We’ll use the split method to remove the word Bearer from the token. This method will split the string into an array of strings. We can then grab the second item in the array, which will be the token.
    const token = req.headers.authorization.split(" ")[1];
    // Add in verify method
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ decoded });
  } catch (error) {
    res.status(401).json({ error: "invalid token" });
  }
});

module.exports = router;
