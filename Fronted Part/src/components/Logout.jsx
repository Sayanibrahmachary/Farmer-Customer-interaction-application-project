import React, { useState } from "react";
import './Logout.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleExclamation} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function Logout()
{
    const navigate=useNavigate();

    const handleLogout=async()=>
    {
        try 
        {
            const token = localStorage.getItem("token"); // Retrieve token from local storage
        
            if (!token) {
                console.error("No token found. Please log in.");
                alert("You are not logged in.");
                return;
            }
            const response = await fetch(`http://localhost:8000/api/v1/customers/logOutCustomer`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Include token
                },
            })
            

            if (!response.ok) {
                const error = await response.json();
                console.error("Error:", error.message);
                alert(`logout failed: ${error.message}`);
                return;
            }

            const result = await response.json();
            console.log("logout successfully", result);
            localStorage.removeItem("token");

            alert(`logout successfully`);
            navigate("/login"); 
        } 
        catch (error) {
            console.error("Error logout :", error);
            alert("An error occurred while logout");
        }
    }
    return (
        <>
            
            <div className="logoutPage">
                <div className="logoutPage1">
                    <FontAwesomeIcon icon={faCircleExclamation} className="logouticon"/>
                    <h3>Are You Leaving?</h3>
                    <p>Are you sure you wants to logout?if yes then clik on the button</p>
                    <button onClick={handleLogout} className="logoutButton">Logout</button>
                </div>
            </div>
            
        </>
    )
}

export default Logout;