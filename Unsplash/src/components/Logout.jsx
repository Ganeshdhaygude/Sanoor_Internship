import React,{ useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () =>{
    const Navigate = useNavigate();
    useEffect(()=>{
        navigate ('/login');
    },{navigate});
    return <div>Logging Out...</div>

};
export default Logout;
