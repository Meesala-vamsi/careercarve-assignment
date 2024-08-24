import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar/Navbar"
import "./Home.css"

const Home = ()=>{
  const navigate= useNavigate()
  return(
    <div>
      <Navbar/>
      <div className="home-container">
        <div className="left-home-container">
          <h1>Personalized Sessions That Fit Your Schedule</h1>
          <p> Our platform offers flexible scheduling options to match you with the right mentor at the right time. Book sessions that fit into your busy life and get the support you need without any hassle.</p>
          <button onClick={()=>{navigate("/mentors")}}>Book Now</button>
        </div>
          <img src="https://res.cloudinary.com/db0f83m76/image/upload/v1724468728/mw_zrvdlo.png" alt="" />
      </div>
    </div>
  )
}


export default Home