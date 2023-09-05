var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      minlength: 5,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
    if(this.password && this.isModified("password")) {
        try {
            const hashed = await bcrypt.hash(this.password, 10);
            this.password = hashed;
            return next();
        } catch (err) {
            return next(err);
        }
    } else {
        next();
    }
});

userSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
        return cb(err, result);
    });
};

userSchema.methods.signToken = async function() {
    var payload = {
        userId: this.id,
        email: this.email
    };
    var token = await jwt.sign(payload, process.env.TOKEN_SECRET);
    return token;
}

module.exports = mongoose.model("User", userSchema);
