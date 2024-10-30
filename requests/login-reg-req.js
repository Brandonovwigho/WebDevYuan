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
          res.redirect('/');
        });
      } 
      else {
        res.status(401).json({ error: 'Incorrect username or password.' });
      }
    });
});

module.exports = router;