const express = require("express")
const bookingController = require("../controllers/bookingsController")
const authController = require("../controllers/authController")
const paymentController = require("../controllers/paymentController")

const router = express.Router()

router.route("/booking")
      .post(authController.authorization,paymentController.paymentMiddleware,bookingController.createBooking)
router.route("/verify")
      .post(authController.authorization,bookingController.verifyBooking)
router.route("/bookings/:id")
      .get(authController.authorization,bookingController.getBookingsByRole)

module.exports = router