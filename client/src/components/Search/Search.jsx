import { useContext, useEffect, useState } from "react";
import "./Search.css"
import { IoSearch } from "react-icons/io5";
import { ReactContext } from "../../ReactContext/Context";
import axios from "axios";
import { toast } from "react-toastify";
import cookies from "js-cookie"

const Search = ()=>{
  const [searchText,setSearchText] = useState("")
  const {url,token,getMentors,setMentors} = useContext(ReactContext)
  useEffect(()=>{
    const getData = async()=>{
      await axios.get(`${url}/getMentorBySearch?search=${searchText}`,{
        headers:{
          Authorization:`Bearer ${cookies.get("token")}`
        }
      })
      .then((response)=>{
        // console.log(response)
        if(response.status === 200){
          setMentors(response.data.data.mentors)
        }
      })
      .catch((error)=>{
        console.log(error)
        setMentors([])
        toast.error(error.response.data.message)
      })
    }

    getData()
  },[url,searchText,token,setMentors])
  // console.log(getMentors)
  return(
    <div className="search-container">
        <IoSearch className="search-logo"/>
        <input type="text" className="search-element" onChange={(e)=>setSearchText(e.target.value)} placeholder="Search mentors by area of expertise" />
    </div>
  )
}

export default Search