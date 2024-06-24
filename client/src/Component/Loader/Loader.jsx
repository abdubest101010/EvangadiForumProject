import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";
function Loader() {
  return (
    <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
        <ClipLoader color="#36d7b7" />
    </div>
  )
}

export default Loader