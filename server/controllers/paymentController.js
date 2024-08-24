// module.exports.calculatePrice = calculatePrice

const Stripe = require("stripe");
const Mentors = require("../models/mentorModel");
const CustomError = require("../utils/customError");
const dotenv = require("dotenv");
const Bookings = require("../models/bookingModel");
const { format, parseISO, isBefore, isAfter, isWithinInterval } = require('date-fns');
const Students = require("../models/studentModel");

dotenv.config({ path: "./.env" });

const stripe = new Stripe(process.env.STRIPE_SEC_KEY);

const calculatePrice = (duration) => {
  if (duration <= 30) return 20000; // 200 INR
  if (duration <= 45) return 30000; // 300 INR
  if (duration <= 60) return 40000; // 400 INR
  if (duration > 60) return 50000; // 500 INR
  throw new Error("Invalid duration");
};

const convertToTime = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  return new Date().setHours(hours, minutes, 0, 0);
};

const checkForConflicts = async (mentorId, startTime, endTime) => {
  const existingBookings = await Bookings.find({
    mentor: mentorId,
    status: 'Scheduled'
  });

  const newBookingInterval = {
    start: new Date(startTime),
    end: new Date(endTime)
  };

  for (const booking of existingBookings) {
    const existingInterval = {
      start: new Date(booking.startTime),
      end: new Date(booking.endTime)
    };

    if (isWithinInterval(newBookingInterval.start, existingInterval) ||
        isWithinInterval(newBookingInterval.end, existingInterval) ||
        isWithinInterval(existingInterval.start, newBookingInterval) ||
        isWithinInterval(existingInterval.end, newBookingInterval)) {
      return true;
    }
  }

  return false; 
};

exports.paymentMiddleware = async (req, res, next) => {
  try {
    const { mentor, startTime, endTime,duration } = req.body;

    // Convert time strings to Date objects
    const startDateTime = convertToTime(new Date(startTime).toISOString().split('T')[1].split('Z')[0]);
    const endDateTime = convertToTime(new Date(endTime).toISOString().split('T')[1].split('Z')[0]);
    console.log(startTime)

    // Find the mentor and check availability
    const mentorData = await Mentors.findById(mentor);
    if (!mentorData) {
      return res.status(404).json({ message: 'Mentor not found' });
    }

    // Check mentor availability
    const isAvailable = mentorData.availability.some(slot => {
      const slotStart = convertToTime(new Date(slot.startTime).toISOString().split('T')[1].split('Z')[0]);
      const slotEnd = convertToTime(new Date(slot.endTime).toISOString().split('T')[1].split('Z')[0]);
      return startDateTime >= slotStart && endDateTime <= slotEnd;
    });

    if (!isAvailable) {
      return res.status(400).json({ message: 'Selected time is outside mentor\'s availability' });
    }

    const hasConflict = await checkForConflicts(mentor, startTime, endTime);
    if (hasConflict) {
      return res.status(400).json({ message: 'Selected time slot is already booked' });
    }

    // Create the booking
    const price = calculatePrice(duration);
    const booking = await Bookings.create({
      student: req.user._id,
      mentor,
      duration,
      startTime: startDateTime,
      endTime: endDateTime,
      price,
      status: 'Pending'
    });

    // Set up Stripe payment session
    const line_items = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `Session with Mentor ${mentorData.name}`
          },
          unit_amount: price
        },
        quantity: 1
      }
    ];

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&bookingId=${booking._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&bookingId=${booking._id}`
    });

    req.body.paymentSession = session;
    req.bookingId = booking._id;
    req.body.price = price;
    next();
  } catch (error) {
    console.error('Error in payment middleware:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.calculatePrice = calculatePrice



