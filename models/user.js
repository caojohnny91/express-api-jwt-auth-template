const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
});

// In Mongoose, there is a method called set where we set options for our Schemas. There is an option in our Schemas called toJSON, which is called when we take an instance of a document and send it through a function or method, like res.json(), that transforms the document to JSON. This is perfect because we want to remove the field hashedPassword when we send it to the client using res.json().
// The set method is going to intake two arguments:
// Key: String - The option’s name to set.
// Value: Object - The option’s value we want to set.
// We already know we want to change the toJSON option, so that will be the key we want to change. For the value, we want to delete the field hashedPassword from the document. To do this, we will use transform. transform expects a callback function, and it will pass that callback function two arguments.

// The original document from the database.
// What is returned when the function is run.
// Inside the set method, let’s add the two arguments.
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
