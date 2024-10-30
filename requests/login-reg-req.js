const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../database');

// Handles login requests. If successful login, then it saves session user.
router.post('/login', (req, res) => {
    const { username, password } = req.body;
   
    db.get('SELECT * FROM login WHERE lower(username) = ? AND password = ?', [username.toLowerCase(), password], (err, row) => {
      if (err) {
        console.error('Error querying database:', err.message);
        res.status(500).send('Internal Server Error');
        return;
      }
      if (row) {
        // If valid username and password, then it will save the session.
        req.session.save(() => {
          req.session.logged_in = true;
          req.session.user = {
            username: row.username,   // Saves username.
            email: row.email // Saves email
          };
          res.status(200).json({ redirect: '/' });
        });
      } 
      else {
        res.status(401).json({ error: 'Incorrect username or password.' });
      }
    });
});

router.post('/signup', (req, res) => {
  const { email, username, password } = req.body;

  db.run('INSERT INTO login (email, username, password) VALUES (?, ?, ?)', [email, username, password], function(err) {
      if (err) {
          console.error('Error inserting into database:', err.message);
          return res.status(500).send('Internal Server Error');
      }
      res.json({ redirect: '/html/signup_complete.html' });
  });
});


// Check if email is already in use.
router.post('/validate-email', (req, res) => {
  const { email } = req.body;
  db.get('SELECT * FROM login WHERE lower(email) = ?', [email.toLowerCase()], (err, row) => {
    if (err) {
      console.error('Error querying database:', err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (row) {
      res.sendStatus(409); // Send status 409 Conflict if email already exists
    } else {
      res.sendStatus(200); // Send status 200 OK if email is available
    }
  });
});

// Check if username is already in use.
router.post('/validate-username', (req, res) => {
  const { username } = req.body;

  db.get('SELECT * FROM login WHERE lower(username) = ?', [username.toLowerCase()], (err, row) => {
    if (err) {
      console.error('Error querying database:', err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    if (row) {
      res.sendStatus(409); // Send status 409 Conflict if username already exists
    } else {
      res.sendStatus(200); // Send status 200 OK if username is available
    }
  });
});

// Route to log out and end the session
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.sendStatus(200); // Send success status
  });
});


// Route to check if user is logged in
router.get('/auth-status', (req, res) => {
  if (req.session.logged_in) {
      res.json({ loggedIn: true, username: req.session.user.username });
  } else {
      res.json({ loggedIn: false });
  }
});


module.exports = router;