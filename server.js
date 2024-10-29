// This file is the 'main' file in the project. It connects everything together and runs the server.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
app.use(session({secret:"BankApp!@#$%^&*()1234567890", resave:false, saveUninitialized:true}))

// Connect to the SQLite database
const db = require('./database');

// Parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add JSON body parser

// Serve other static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect 'routes' files
//const userRoute = require('./routes/user');
//app.use('/user', userRoute);

// Connect 'requests' files
//const loginReg = require('./requests/login_registration');
//app.use(loginReg); // File to manage all requests associated with the login/registration page.

// Serve login_registration.html as the default startup HTML
/*app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'login_registration.html'));
}); */

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/login-reg.html'));
})
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, './public/login-reg.html'));
})
app.get('/registrationComplete', (req, res) => {
  res.sendFile(path.join(__dirname, './public/regComplete.html'));
})
app.all('*', (req, res) => {
  res.send('Error 404 - PAGE NOT FOUND');
})

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});