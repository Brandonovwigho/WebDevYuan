// This file is the 'main' file in the project. It connects everything together and runs the server.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
app.use(session({secret:"RecipeSite!@#$%^&*()1234567890", resave:false, saveUninitialized:true}))

// Parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add JSON body parser

// Serve other static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect 'requests' files
const loginReg = require('./requests/login-reg-req');
const foodApi = require('./requests/api-call');
app.use(loginReg); // File to manage all requests associated with the login/registration page.
app.use(foodApi); // File to make api fetches from themealdb.com

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/login-reg.html'));
})
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/login-reg.html'));
})
app.get('/recipe', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/recipe.html'));
})
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/search.html'));
})
/* app.get('/signup-complete', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/signup_complete.html'));
}) */
app.all('*', (req, res) => {
  res.send('Error 404 - PAGE NOT FOUND');
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});