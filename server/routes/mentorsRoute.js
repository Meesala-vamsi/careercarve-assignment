const express = require("express")
const mentorController = require("../controllers/mentorController")
const authController = require("../controllers/authController")

const router = express.Router()

router.route("/mentors")
      .get(authController.authorization,mentorController.getAllMentorsList)

module.exports = router