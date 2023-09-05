var jwt = require("jsonwebtoken");
var User = require("../models/user");

auth = {
  // Define a middleware function to check if the user is logged in
  verifyToken: async (req, res, next) => {
    var token = req.headers.authorisation;
    if (token) {
      try {
        // validate the token
        var payload = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = payload;
        next();
      } catch (error) {
        next(error);
      }
    } else {
      res.status(400).json({ error: "token required" });
    }
  },
};

module.exports = auth;
