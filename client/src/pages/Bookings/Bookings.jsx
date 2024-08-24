import { useContext, useEffect, useState } from "react"
import Navbar from "../../components/Navbar/Navbar"
import "./Bookings.css"
import { ReactContext } from "../../ReactContext/Context"
import axios from "axios"
import { FaStar } from "react-icons/fa6"
import { CiStar } from "react-icons/ci"
import {format} from "date-fns"
import cookies from "js-cookie"

const Bookings = ()=>{
  const {url,token} = useContext(ReactContext)
  const [getUserBookings,setUserBookings] = useState([])
  const userData = JSON.parse(localStorage.getItem("user"))
  useEffect(()=>{
    const getBookings = async()=>{
      await axios.get(`${url}/bookings/${userData.user._id}`,{
        headers:{
          Authorization:`Bearer ${cookies.get("token")}`
        }
      })
      .then((response)=>{
        if(response.status===200){
          setUserBookings(response.data.data.bookings)
        }
      })
      .catch((error)=>{
        console.log(error)
      })
    }

    getBookings()
  },[token,url,userData.user._id])
  // console.log(getUserBookings)
  return(
    <>
    <Navbar/>
    <div className="bookings-container">
      <h1>Your Bookings</h1>
      <ul className="bookings-list-container">
        {
          getUserBookings.length>0?getUserBookings.map((eachBooking)=>(
            <li className="booking-list-items" key={eachBooking._id}>
              <div className="booking-profile-container">
              <img
                    src="https://res.cloudinary.com/db0f83m76/image/upload/v1708003261/blank-profile-picture-973460_1280_qwwp4w.png"
                    alt="mentor-image"
                    className="booking-profile"
                  />
                </div>
                <h3>Name: {eachBooking.mentor.name?eachBooking.mentor.name:eachBooking.student.name}</h3>
                <p>Duration: {eachBooking.duration} mins</p>
                <p>Starts At: {format(new Date(eachBooking.startTime), 'hh:mm a')}</p>
                <p>Meeting: {eachBooking.status}</p>
                <ul className="expertise-container">
                  {
                    eachBooking.mentor.areaOfExpertise.map((eachArea,index)=>(
                      <li className="expertise-item" key={index}>{eachArea}</li>
                    ))
                  }
                </ul>
                <div className="ratings-container">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <CiStar />
                  </div>
            </li>
          )):<div>
            <h4>No Bookings Found</h4>
          </div>
        }
      </ul>
    </div>
    </>
  )
}

export default Bookings