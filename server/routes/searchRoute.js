const express =require("express")
const searchController = require("../controllers/searchController")
const authController = require("../controllers/authController")

const router = express.Router()

router.route("/getMentorBySearch")
      .get(authController.authorization,searchController.getMentorFromExpertise)


module.exports = router