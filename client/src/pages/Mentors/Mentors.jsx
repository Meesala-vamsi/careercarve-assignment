import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./Mentors.css";
import { ReactContext } from "../../ReactContext/Context";
import { FaStar } from "react-icons/fa6";
import { CiStar } from "react-icons/ci";
import axios from "axios";
import { MdOutlineArrowOutward } from "react-icons/md";
import cookies from "js-cookie"
import { toast } from "react-toastify";

const Mentors = () => {
  const { url, token, getMentors, setMentors } = useContext(ReactContext);
  const [times, setTimes] = useState({});
  const studentData = JSON.parse(localStorage.getItem("user"));
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const getDetails = async () => {
      await axios
        .get(`${url}/mentors`, {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        })
        .then((response) => {
          // console.log(response)
          if (response.status === 200) {
            setMentors(response.data.data.mentors);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          console.log(err);
        });
    };

    getDetails();
  }, [token, url, setMentors]);

  const handleTimeChange = (mentorId, type, value) => {
    setTimes((prevTimes) => ({
      ...prevTimes,
      [mentorId]: {
        ...prevTimes[mentorId],
        [type]: value,
      },
    }));
  };

  const handleBooking = (mentorId) => {
    const { startTime, endTime } = times[mentorId] || {};
    if (!startTime || !endTime) {
      toast.error("Please select both start and end times.");
      return;
    }

    const [startHours, startMinutes] = startTime.split(':');
    const [endHours, endMinutes] = endTime.split(':');

    const combinedStartDateTime = new Date(startDate);
    combinedStartDateTime.setHours(startHours);
    combinedStartDateTime.setMinutes(startMinutes);

    const combinedEndDateTime = new Date(startDate);
    combinedEndDateTime.setHours(endHours);
    combinedEndDateTime.setMinutes(endMinutes);

    const isoStartTime = combinedStartDateTime.toISOString();
    const isoEndTime = combinedEndDateTime.toISOString();

    const durationInMilliseconds = combinedEndDateTime - combinedStartDateTime;
    const durationInMinutes = durationInMilliseconds / (1000 * 60);
    const bookingData = {
      student: studentData.user._id,
      mentor: mentorId,
      endTime: isoEndTime,
      startTime: isoStartTime,
      duration: durationInMinutes
    };

    axios.post(`${url}/booking`, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.data.status === "success") {
        const { session_url } = response.data;
        window.location.replace(session_url);
      }
    })
    .catch((err) => {
      toast.error(err.response.data.message);
      console.log(err);
    });
  };

  // console.log(getMentors)

  return (
    <>
      <Navbar />
      <div className="mentors-container">
        <h1>Available Mentors</h1>
        <ul className="mentors-list-container">
          {getMentors.length > 0 ? (
            getMentors.map((eachMentor) => (
              <li key={eachMentor._id} className="mentors-list-items">
                <div className="mentor-profile-container">
                  <img
                    src="https://res.cloudinary.com/db0f83m76/image/upload/v1708003261/blank-profile-picture-973460_1280_qwwp4w.png"
                    alt="mentor-image"
                    className="mentor-profile"
                  />
                </div>
                <h3>{eachMentor.name}</h3>
                <ul className="expertise-container">
                  {
                    eachMentor.areaOfExpertise.map((eachArea,index)=>(
                      <li className="expertise-item" key={index}>{eachArea}</li>
                    ))
                  }
                </ul>
                <div className="container1">
                <div className="time-container">
                  <label htmlFor="start">Start: </label>
                  <input
                  id="start"
                    type="time"
                    value={times[eachMentor._id]?.startTime || ""}
                    onChange={(e) => handleTimeChange(eachMentor._id, "startTime", e.target.value)}
                    placeholder="Start Time"
                    style={{marginRight:"20px"}}
                  />
                </div>
                <div className="time-container">
                  <label htmlFor="end">End: </label>
                  <input
                  id="end"
                    type="time"
                    value={times[eachMentor._id]?.endTime || ""}
                    onChange={(e) => handleTimeChange(eachMentor._id, "endTime", e.target.value)}
                    placeholder="End Time"
                  />
                </div>
                </div>
                <div className="booking-container">
                  <div className="ratings-container">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <CiStar />
                  </div>
                  
                  {
                    studentData.user.role==="student" && <button
                    className="book-button"
                    onClick={() => handleBooking(eachMentor._id)}
                  >
                    Book now
                  </button>
                  }
                </div>
              </li>
            ))
          ) : (
            <div>
              <p>No Mentors Found</p>
            </div>
          )}
        </ul>
      </div>
    </>
  );
};

export default Mentors;
