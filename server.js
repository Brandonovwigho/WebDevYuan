// This file is the 'main' file in the project. It connects everything together and runs the server.
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
app.use(session({secret:"RecipeSite!@#$%^&*()1234567890", resave:false, saveUninitialized:true}))

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
const loginReg = require('./requests/login-reg-req');
app.use(loginReg); // File to manage all requests associated with the login/registration page.


app.get('/api/random-recipe', async (req, res) => {
  try {
      const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const data = await response.json();
      res.json(data);
  } catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});
app.post('/api/recipe-lookup', async(req,res) =>{
  const {recipeId} = req.body;
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`
    );
    const data = await response.json();
    res.json(data);
} catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
}
})
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/login-reg.html'));
})
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/login-reg.html'));
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