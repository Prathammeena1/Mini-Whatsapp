const express = require('express')
const router = express.Router();
const passport = require('passport')
const localStrategy = require('passport-local')
const userModel = require('./users')
const messageModel = require('./message')
const groupModel = require('./group')

router.use(express.json());

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/chat', isLoggedIn, async function (req, res, next) {
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user }).populate('friends').populate('groups')
  res.render('chat', { loggedInUser });
});

router.get('/search/:username', isLoggedIn, async function (req, res, next) {
  var users = await userModel.find({
    username: {
      $regex: req.params.username,
      $options: 'i'
    }
  })

  res.status(200).json(users);

});


router.get('/addFriend/:username', isLoggedIn, async function (req, res, next) {
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user })
  const user = await userModel.findOne({ username: req.params.username })
  if (loggedInUser.friends.indexOf(user._id) === -1) {
    loggedInUser.friends.push(user._id)
    user.friends.push(loggedInUser._id)
    await loggedInUser.save()
    await user.save()
    res.json('Friend added')
  }
  else {
    res.json('Already Friends')
  }


});


router.get('/getMessage/:oppositeUser', isLoggedIn, async function (req, res, next) {
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user })
  const messageArray = await messageModel.find(
    {
      $or: [
        {
          sender: loggedInUser.username,
          receiver: req.params.oppositeUser,
        },
        {
          receiver: loggedInUser.username,
          sender: req.params.oppositeUser,
        },
      ]
    }

  )
  res.status(200).json(messageArray);

});


router.get('/getMessageGroup/:oppositeUser', isLoggedIn, async function (req, res, next) {
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user })
  const messageArray = await messageModel.find(
    {
      receiver:req.params.oppositeUser
    }
  )
  res.status(200).json(messageArray);

});


router.get('/createGroup', isLoggedIn, async function (req, res, next) {
  // Access query parameters using req.query
  const groupName = req.query.name;
  const ids = req.query.ids;
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user });

  const findGroup = await groupModel.findOne({
    name: groupName
  })


  if (ids.length !== 0) {

    if (findGroup == null) {
      const newGroup = await groupModel.create({
        name: groupName,
        admin: loggedInUser._id,
        members: [loggedInUser._id]
      })
      loggedInUser.groups.push(newGroup._id)
      await loggedInUser.save()

      ids.forEach(async id => {
        newGroup.members.push(id)
        const user = await userModel.findOne({ _id: id })
        user.groups.push(newGroup._id)
        await user.save()
      })

      await newGroup.save()
      var msg = {status:'Group created',newGroup}
      res.status(200).json(msg);
    }
    else {
      var msg = {status:'Group name already exist'}
      res.status(200).json(msg)
    }
  }
  else {
    var msg = {status:'Add some members'}
    res.status(200).json(msg)
  }

});


















router.post("/register", async function (req, res) {
  var existedUser = await userModel.findOne({ username: req.body.username })
  if (!existedUser) {

    const userData = new userModel({
      username: req.body.username,
      email: req.body.email,
    })

    userModel.register(userData, req.body.password)
      .then(function () {
        passport.authenticate("local")(req, res, function () {
          res.redirect('/chat');
        })
      })
  } else {
    res.redirect('/')
  }

})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/chat',
  failureRedirect: '/login'
}), function (req, res) { })

router.get('/logout', (req, res) => {
  req.logout(function () {
    res.redirect('/login');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}







module.exports = router;