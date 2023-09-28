const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/authenticate");

const getUserByEmail = (userEmail) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: userEmail })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const addNewUser = (newUser) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) reject(err);
        newUser.password = hash;
        // User detail save in database
        newUser
          .save()
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    });
  });
};

const comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};

exports.UserRegister = async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    // check user email is already present or not
    const userEmailExists = await getUserByEmail(newUser.email);
    if (userEmailExists) {
      res.status(200).send({ status: 200, message: "Email is already Exists" });
    }

    // save user to database
    const saveUser = await addNewUser(newUser);
    if (saveUser) {
      return res
        .status(201)
        .send({ status: 201, message: "User Register Successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ status: 500, error: "Something went wrong", message: error });
  }
};

exports.LoginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await getUserByEmail(email);
    if (!userData) {
      return res.status(400).send({
        status: 400,
        error: "Bad Request.",
        message: "Email is not exists/register.",
      });
    }
    // if user is register then try to compare the password
    comparePassword(password, userData.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) {
        return res
          .status(400)
          .send({ status: 400, message: "Invalid Password" });
      }
      // generate a token to send in response;
      const token = jwt.sign(userData.toJSON(), process.env.JWT_SECRET_KEY, {
        expiresIn: 604800,  // 1 week
      });
      return res.status(200).send({
        status: 200,
        token: "JWT " + token,
        user: {
          id: userData._id,
          name: userData.name,
          email: userData.email,
        },
      });
    });
  } catch (error) {
    res
      .status(500)
      .send({ status: 500, error: "Something went wrong", message: error });
  }
};

module.exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports.getProfileData = (req, res) => {
  try {
    // Ensure that req.user contains the user's information, which is typically set by your authentication middleware
    if (!req.user) {
      return res.status(401).send({
        status: 401,
        message: "Unauthorized",
      });
    }

    const user = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    };
console.log("user", user);
    return res.status(200).json({
      status: 200,
      message: "Success",
      user: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      error: "Something went wrong",
      message: error.message,
    });
  }
};

