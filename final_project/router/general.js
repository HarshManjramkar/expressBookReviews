const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});

// =========================================================================
// Task 1 & Task 10: Get the book list available in the shop using Promises
// =========================================================================
function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

public_users.get('/', function (req, res) {
  getBookList()
    .then((bookList) => {
      return res.status(200).send(JSON.stringify(bookList, null, 4));
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error retrieving books", error: error.message });
    });
});

// =========================================================================
// Task 2 & Task 11: Get book details based on ISBN using Promises
// =========================================================================
function getFromISBN(isbn) {
  return new Promise((resolve, reject) => {
    let book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
    }
  });
}

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn)
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
      return res.status(error.status || 500).json({ message: error.message });
    });
});

// =========================================================================
// Task 3 & Task 12: Get book details based on Author using Promises
// =========================================================================
function getFromAuthor(author) {
  return new Promise((resolve, reject) => {
    let matchingBooks = [];
    const searchAuthor = author.toLowerCase();
    Object.keys(books).forEach((key) => {
      if (books[key].author.toLowerCase() === searchAuthor) {
        matchingBooks.push({
          isbn: key,
          author: books[key].author,
          title: books[key].title,
          reviews: books[key].reviews
        });
      }
    });
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: `No books found by author: ${author}` });
    }
  });
}

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  getFromAuthor(author)
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((error) => {
      return res.status(error.status || 500).json({ message: error.message });
    });
});

// =========================================================================
// Task 4 & Task 13: Get all books based on Title using Promises
// =========================================================================
function getFromTitle(title) {
  return new Promise((resolve, reject) => {
    let matchingBooks = [];
    const searchTitle = title.toLowerCase();
    Object.keys(books).forEach((key) => {
      if (books[key].title.toLowerCase() === searchTitle) {
        matchingBooks.push({
          isbn: key,
          author: books[key].author,
          title: books[key].title,
          reviews: books[key].reviews
        });
      }
    });
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: `No books found with title: ${title}` });
    }
  });
}

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  getFromTitle(title)
    .then((result) => {
      return res.status(200).send(JSON.stringify(result, null, 4));
    })
    .catch((error) => {
      return res.status(error.status || 500).json({ message: error.message });
    });
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

// ====================================================================================
// Tasks 10-13: Async operations using Axios with Promises and Async/Await implementations
// ====================================================================================

const BASE_URL = 'http://localhost:5000';

// Task 10: Get the list of books available in the shop using async/await with Axios
const getAllBooksAsync = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error.message);
    throw error;
  }
};

// Task 10 (Promise alternative): Get the list of books using Promise callbacks with Axios
const getAllBooksPromise = () => {
  return axios.get(`${BASE_URL}/`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching books:", error.message);
      throw error;
    });
};

// Task 11: Get book details based on ISBN using async/await with Axios
const getBookByISBNAsync = async (isbn) => {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
    throw error;
  }
};

// Task 11 (Promise alternative): Get book details based on ISBN using Promise callbacks with Axios
const getBookByISBNPromise = (isbn) => {
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
      throw error;
    });
};

// Task 12: Get book details based on Author using async/await with Axios
const getBooksByAuthorAsync = async (author) => {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by author ${author}:`, error.message);
    throw error;
  }
};

// Task 12 (Promise alternative): Get book details based on Author using Promise callbacks with Axios
const getBooksByAuthorPromise = (author) => {
  return axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Error fetching books by author ${author}:`, error.message);
      throw error;
    });
};

// Task 13: Get book details based on Title using async/await with Axios
const getBooksByTitleAsync = async (title) => {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching books by title ${title}:`, error.message);
    throw error;
  }
};

// Task 13 (Promise alternative): Get book details based on Title using Promise callbacks with Axios
const getBooksByTitlePromise = (title) => {
  return axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error(`Error fetching books by title ${title}:`, error.message);
      throw error;
    });
};

module.exports.general = public_users;
module.exports.getBookList = getBookList;
module.exports.getFromISBN = getFromISBN;
module.exports.getFromAuthor = getFromAuthor;
module.exports.getFromTitle = getFromTitle;
module.exports.getAllBooksAsync = getAllBooksAsync;
module.exports.getAllBooksPromise = getAllBooksPromise;
module.exports.getBookByISBNAsync = getBookByISBNAsync;
module.exports.getBookByISBNPromise = getBookByISBNPromise;
module.exports.getBooksByAuthorAsync = getBooksByAuthorAsync;
module.exports.getBooksByAuthorPromise = getBooksByAuthorPromise;
module.exports.getBooksByTitleAsync = getBooksByTitleAsync;
module.exports.getBooksByTitlePromise = getBooksByTitlePromise;
