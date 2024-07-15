const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let user_exist=users.filter((user)=> {
    return user.username===username
});
if(user_exist.length>0){
    return true
}
else{
    return false
}

}



const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let vadilate_user=users.filter((user)=>{
    return (user.username===username && user.password===password);
})
if(vadilate_user.length>0){
    return true
}
else{
    return false
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username=req.body.username;
  let password=req.body.password;
  
  if(!username||!password){
    return res.status(400).json({error: "username or password is missing"});
  }
  else{
    if(authenticatedUser(username,password)){
        let accessToken=jwt.sign({data:password},'access',{expiresIn:60*60});
        req.session.authorization={accessToken,username};
        req.session.username=username;
        return res.status(200).json({msg: `${username} login is successful`});
    }
    else{
        return res.status(400).json({error: "user login failed. check username and password"});
    }

  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

    // Check if review and username are provided
    if (!review) {
        return res.status(400).json({ error: 'Review data is required in the request query' });
    }
    if (!username) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if the ISBN exists in the books data
    if (!books[isbn]) {
        return res.status(404).json({ error: 'Book not found for the given ISBN' });
    }

    // Add or modify the review for the given ISBN and username
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        // Modify existing review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: 'Review modified successfully', isbn, review });
    } else {
        // Add new review
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }
        books[isbn].reviews[username] = review;
        return res.status(201).json({ message: 'Review added successfully', isbn, review });
    }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    const username = req.session.username;
    if (!username) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if the ISBN exists in the books data
    if (!books[isbn]) {
        return res.status(404).json({ error: 'Book not found for the given ISBN' });
    }
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        // Delete the user's review
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: 'Review deleted successfully', isbn });
    } else {
        return res.status(404).json({ error: 'Review not found for the given ISBN and user' });
    }


});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
