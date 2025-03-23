const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // ❗ Validate presence of both username and password
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // 🔍 Check if user already exists
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists. Please choose another one." });
  }

  // ✅ Add new user to the in-memory users array
  users.push({ username, password });

  // 🎉 Success response
  return res.status(201).json({ message: "User registered successfully!" });
});


// Get book details based on ISBN (synchronous route)
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

// -------------------------------------------------
// Task 11: Get book details based on ISBN using async/await + Axios
// -------------------------------------------------
public_users.get('/isbn-async/:isbn', async function (req, res) {
  // Retrieve ISBN from URL
  const isbn = req.params.isbn;
  try {
    // Call the existing /isbn/:isbn route using Axios
    const response = await axios.get(`http://localhost:3000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch book details", error: error.message });
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

public_users.get('/books', function (req, res) {
  res.status(200).json(books);
});

// -----------------------------
// Task 10: Get all books using async/await + Axios
// -----------------------------
const axios = require('axios');

public_users.get('/books-async', async (req, res) => {
  try {
    // Call the /books route which returns all books
    const response = await axios.get('http://localhost:3000/books');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
});

//  Get book review
public_users.put('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session?.authorization?.username;

  // Step 1: Check if user is logged in
  if (!username) {
    return res.status(401).json({ message: "User not logged in. Please log in to post a review." });
  }

  // Step 2: Validate the review
  if (!review) {
    return res.status(400).json({ message: "Review is required as a query parameter." });
  }

  // Step 3: Check if the book exists
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }

  // Step 4: Initialize the reviews object if it doesn't exist
  if (!book.reviews) {
    book.reviews = {};
  }

  // Step 5: Add or update the user's review
  const isUpdated = book.reviews.hasOwnProperty(username);
  book.reviews[username] = review;

  // Step 6: Return updated reviews
  return res.status(200).json({
    message: isUpdated ? "Review updated successfully." : "Review added successfully.",
    reviews: book.reviews
  });
});


module.exports.general = public_users;
