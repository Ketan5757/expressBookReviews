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
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  // Step 1: Get all books as an array
  const booksByAuthor = Object.values(books).filter((book) => book.author === author);

  // Step 2: Respond with matching books or 404
  if (booksByAuthor.length > 0) {
    return res.status(200).json({ books: booksByAuthor });
  } else {
    return res.status(404).json({ message: "No books found by the given author." });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  // Step 1: Get all books as an array
  const booksByTitle = Object.values(books).filter((book) => book.title === title);

  // Step 2: Respond with matching books or 404
  if (booksByTitle.length > 0) {
    return res.status(200).json({ books: booksByTitle });
  } else {
    return res.status(404).json({ message: "No books found with the given title." });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Step 1: Check if the book exists
  const book = books[isbn];

  if (book) {
    // Step 2: Return only the reviews
    return res.status(200).json({ reviews: book.reviews });
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }
});

module.exports.general = public_users;
