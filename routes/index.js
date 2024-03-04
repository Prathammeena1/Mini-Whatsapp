const express = require('express');
const router = express.Router();
const passport = require('passport');
const localStrategy = require('passport-local');
const userModel = require('./users.js');
const messageModel = require('./message.js');
const groupModel = require('./group.js');

router.use(express.json());

passport.use(new localStrategy(userModel.authenticate()));

// Render home page
router.get('/', (req, res) => {
  res.render('index.ejs', { title: 'Express' });
});

// Render login page
router.get('/login', (req, res) => {
  res.render('login.ejs', { title: 'Express' });
});

// Render chat page for authenticated users
router.get('/chat', isLoggedIn, async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne({ username: req.session.passport.user }).populate('friends').populate('groups');
    res.render('chat.ejs', { loggedInUser });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Search for users by username
router.get('/search/:username', isLoggedIn, async (req, res) => {
  try {
    const users = await userModel.find({
      username: { $regex: req.params.username, $options: 'i' }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Add friend
router.get('/addFriend/:username', isLoggedIn, async (req, res) => {
  try {
    // Implementation logic here
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get messages with opposite user
router.get('/getMessage/:oppositeUser', isLoggedIn, async (req, res) => {
  try {
    // Implementation logic here
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get messages from a group
router.get('/getMessageGroup/:oppositeUser', isLoggedIn, async (req, res) => {
  try {
    // Implementation logic here
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Create group
router.get('/createGroup', isLoggedIn, async (req, res) => {
  try {
    // Implementation logic here
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// User registration
router.post('/register', async (req, res) => {
  try {
    // Implementation logic here
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// User login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/chat',
  failureRedirect: '/login'
}));

// User logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
