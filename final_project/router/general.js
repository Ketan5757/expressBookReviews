const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Use JSON.stringify to display the book list neatly
  const bookList = JSON.stringify(books, null, 2);  // Pretty-print with 2 spaces of indentation
  
  // Return the book list as a JSON response
  return res.status(200).json({
    message: "Books available in the shop",
    books: JSON.parse(bookList)  // Parse it back to an object if necessary
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // ✅ Step 1: Retrieve ISBN from URL
  const isbn = req.params.isbn;

  // ✅ Step 2: Get book from the books object
  const book = books[isbn];

  // ✅ Step 3: Respond accordingly
  if (book) {
    return res.status(200).json({ book });
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
