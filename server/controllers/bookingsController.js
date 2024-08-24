const Bookings = require("../models/bookingModel");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");

exports.getBookingsByRole = asyncHandler(async (req, res, next) => {
  const studentBookings = await Bookings.find({ student: req.params.id }).populate('mentor', 'name email areaOfExpertise');
  const mentorBookings = await Bookings.find({ mentor: req.params.id }).populate('student', 'name email');

  const bookings = studentBookings.concat(mentorBookings);

  if (bookings.length === 0) {
    const error = new CustomError("No Bookings Found", 404);
    return next(error);
  }

  res.status(200).json({
    status: "Success",
    data: {
      bookings,
    },
  });
});

exports.createBooking = asyncHandler(async (req, res, next) => {
  const { mentor, duration, startTime, endTime } = req.body;
  const { price, paymentSession } = req.body;

  const createBooking = await Bookings.findById(req.bookingId);

  if (!createBooking) {
    return next(new CustomError("Something went wrong", 404));
  }

  res.status(200).json({
    status: "success",
    session_url: paymentSession.url,
    booking: createBooking
  });
});

exports.verifyBooking = asyncHandler(async (req, res, next) => {
  const { bookingId, success } = req.body;
  console.log(bookingId,success)

  if (success === "true" || success===true) {
    await Bookings.findByIdAndUpdate(bookingId, { status: "Scheduled" },{new:true,runValidators:true});
    res.status(200).json({
      status: "success",
      message: "Payment Successful"
    });
  } else {
    await Bookings.findByIdAndDelete(bookingId);
    res.status(404).json({
      status: "failed",
      message: "Payment failed"
    });
  }
});
