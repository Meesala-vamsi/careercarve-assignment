const express = require("express")
const authController = require("../controllers/authController")
const paymentController = require("../controllers/paymentController")

const router = express.Router()


router.route("/payment")
      .post(authController.authorization,paymentController.paymentMiddleware,paymentController.verifyBooking)
