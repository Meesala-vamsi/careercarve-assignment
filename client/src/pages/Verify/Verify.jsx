import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import axios from 'axios'
import { ReactContext } from '../../ReactContext/Context'

const Verify = () => {

    const [searchParams,setSearchParams] = useSearchParams()
    const navigate=useNavigate()

    const success=searchParams.get("success")
    const bookingId=searchParams.get("bookingId")
    // console.log(success,bookingId)

    const {url,token} = useContext(ReactContext)
    useEffect(()=>{
        const verifyPayment = async ()=>{
            const response = await axios.post(`${url}/verify`,{success,bookingId},{
              headers:{
                Authorization:`Bearer ${token}`
              }
            })
            // console.log(response)
    
            if(response.data.status==="success"){
                navigate('/bookings')
            }else{
                navigate("/")
            }
        }

        verifyPayment()
    },[])

  return (
    <div className=''>

    </div>
  )
}

export default Verify