const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log("TOKEN:", token); // debug
    
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    const decodedObj = jwt.verify(token, process.env.JWT_SECRET); 
    console.log("DECODED:", decodedObj); // debug

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("AUTH ERROR FULL:", err); // debug
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };