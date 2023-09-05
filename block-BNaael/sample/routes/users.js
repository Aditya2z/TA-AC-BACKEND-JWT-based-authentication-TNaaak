var express = require('express');
var router = express.Router();
var User = require("../models/user");
var auth = require("../middlewares/auth");

/* GET users listing. */
router.get("/", auth.verifyToken, function(req, res, next) {
  res.json({"success": "token validated"});
});

// register user
router.post('/register', function(req, res, next) {
  const {email} = req.body;
  // Check if the email is already registered
  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(400).json({Error: "Email registered already"});
        return;
      };

      // Check if the password is less than 5 characters
      if (req.body.password.length < 5) {
        res.status(400).json({Error:"Password should be at least 5 characters long."});
        return;
      };

      // Proceed with registration if everything is valid
      User.create(req.body)
        .then((newUser) => {
          res.status(200).json({
            name : newUser.name,
            email : newUser.email
          });
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    })
    .catch((err) => {
      console.log(err);
      return;
});
});

router.post("/login", function (req, res, next) {
  var { email, password } = req.body;
  if (!email || !password) {
    res.json({"error": "Email/Password Required!"});
    return;
  }
  User.findOne({ email }).then((user) => {
    if (!user) {
      res.json({"error": "Email not registered"});
      return;
    } 
    user.verifyPassword(password, async (err, result) => {
      if (err) return next(err);
      if (!result) {
        res.json({"error": "Wrong Password!"});
        return;
      }
      //login success
      var token = await user.signToken();
      res.json({token});
    });
  });
});

module.exports = router;
