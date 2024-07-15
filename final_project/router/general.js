const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username=req.body.username;
  const password=req.body.password;
  if(username&&password){
    if(isValid(username)){
        return res.status(404).json({message: "User already exists!"});
    }
    else{
        users.push({username,password});
        return res.status(200).json({message: `${username} successfully registered. Now you can login`})
  }
}
});

// Get the book list available in the shop
function fetchBooks(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if (books) {
                resolve(books);
            } else {
                reject(new Error(`Books not found`));
            }
        },1000)
    })
}

public_users.get('/',function (req, res) {
  //Write your code here
  fetchBooks().then((booksData) => {
            return res.send(JSON.stringify(booksData, null, 4));
        }).catch((err) => {
            console.error('Error fetching books:', err);
            res.status(500).send('Error fetching books');
        });
});

// Get book details based on ISBN
function fetchIsbnBook(isbn){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            let book=books[isbn]
            if (book) {
                resolve(book);
            } else {
                reject(new Error(`Book with ISBN ${isbn} not found`));
            }
        },1000)
    })
}
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let requested_isbn=req.params.isbn;

  fetchIsbnBook(requested_isbn).then((booksData) => {
            return res.send(JSON.stringify(booksData, null, 4));
        }).catch((err) => {
            console.error('Error fetching book with isbn:', err);
            res.status(500).send('Error fetching book using isbn');
        });
 });
  
// Get book details based on author
function fetchAuthorBook(author){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            const keys=Object.keys(books);
            const booksByAuthor = [];
            keys.forEach(key => {
                if (books[key].author === author) {
                    booksByAuthor.push(
                        {key:
                            books[key]
                });
                }
            });
            if(booksByAuthor){
                resolve(booksByAuthor)
            }
            else {
                reject(new Error(`Book with author ${author} not found`));
            }
        },1000)
    })
}
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let requested_author=req.params.author;
  
  //let resultt_book=books_keys.find(book=>books[book].author===requested_author)
  
  fetchAuthorBook(requested_author).then((booksData) => {
            return res.send(JSON.stringify(booksData, null, 4));
        }).catch((err) => {
            console.error('Error fetching book by auhtor:', err);
            res.status(500).send('Error fetching book by author');
        });
});

// Get all books based on title
function fetchTitleBook(title){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            const keys=Object.keys(books);
            const booksByTitle = [];
            keys.forEach(key => {
                if (books[key].title === title) {
                    booksByTitle.push(
                        {key:
                            books[key]
                });
                }
            });
            if(booksByTitle){
                resolve(booksByTitle)
            }
            else {
                reject(new Error(`Book with title ${title} not found`));
            }
        },1000)
    })
}
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let requested_title=req.params.title;
  //let resultt_book=books_key.find(book=>books[book].title===requested_title)
  fetchTitleBook(requested_title).then((booksData) => {
            return res.send(JSON.stringify(booksData, null, 4));
        }).catch((err) => {
            console.error('Error fetching book by title:', err);
            res.status(500).send('Error fetching book by title');
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let req_review=req.params.isbn;
  return res.send(books[req_review].reviews)
});

module.exports.general = public_users;
