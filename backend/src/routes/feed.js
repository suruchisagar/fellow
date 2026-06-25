const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const router = express.Router();

router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const alreadyInteracted = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId");

    const hideUserIds = new Set();
    hideUserIds.add(loggedInUser._id.toString());

    alreadyInteracted.forEach(request => {
      hideUserIds.add(request.fromUserId.toString());
      hideUserIds.add(request.toUserId.toString());
    });

    const feed = await User.find({
    _id: { $nin: Array.from(hideUserIds) }
    }).select("_id firstName lastName age gender about skills photoUrl");

    res.json({ data: feed });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;