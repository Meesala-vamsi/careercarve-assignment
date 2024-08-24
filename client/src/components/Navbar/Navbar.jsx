import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"
import cookies from "js-cookie"
import { toast } from "react-toastify"
import Search from "../Search/Search"

const Navbar = ()=>{
  const navigate = useNavigate()
  const data = JSON.parse(localStorage.getItem("user"))
  const onClickLogout=()=>{
    const token = cookies.remove("token")
    localStorage.removeItem("user")
    toast.success("Logged out Successfully...")
    if(!token){
      navigate("/login")
    }
  }
  return(
    <nav className="navbar-container">
      <Link to="/">
      <img src="https://res.cloudinary.com/db0f83m76/image/upload/v1724406859/unnamed_qa43s9.png" alt="logo" className="nav-logo" />
      </Link>
      <ul className="nav-list-container">
        <Link to="/mentors" className="nav-link">
          <li>Mentors</li>
        </Link>
        <Link to="/bookings" className="nav-link">
          <li>Bookings</li>
        </Link>
      </ul>
      <Search/>
      <div className="nav-left">
        <p>Welcome {data.user.role} {data.user.name}</p>
        <img src="https://res.cloudinary.com/db0f83m76/image/upload/v1708003261/blank-profile-picture-973460_1280_qwwp4w.png" alt="profile" className="profile-image" />
        <button className="logout-btn" onClick={onClickLogout}>Logout</button>
      </div>
    </nav>
  )
}

export default Navbar