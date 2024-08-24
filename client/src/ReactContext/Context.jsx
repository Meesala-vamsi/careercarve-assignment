import React, { useState } from "react"
import cookies from "js-cookie";

export const ReactContext = React.createContext()

export const ContextProvider = ({children})=>{
  const url = "https://careercarve-assignment-2dvi.onrender.com"
  const [token,setToken] = useState(cookies.get('token') || '')
  const [getMentors,setMentors] = useState([])

  return(
    <ReactContext.Provider value={{token,setToken,url,getMentors,setMentors}}>
      {children}
    </ReactContext.Provider>
  )
}
