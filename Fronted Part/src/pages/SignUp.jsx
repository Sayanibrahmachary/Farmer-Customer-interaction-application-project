import React, { useState } from "react";
import {NavLink, useNavigate} from "react-router-dom";
import "./SignUp.css" 
import SignUpCustomer from "./SignUpCustomer.jsx"

function SignUp()
{
    const [role,setRole]=useState(null);
    const navigate=useNavigate();

    function handle()
    {
        if(role=="Customer")
        {
            navigate("/signUpCustomer");
        }
        if(role=="Seller")
        {
            navigate("/signUpFarmer");
        }
        if(role=="Delivery Boy")
        {
            navigate("/signUpDeliveryBoy");
        }
    }
    return (
        <>
            <div className="signUpForm">
                <div className="formDiv">
                    <div className="photo">
                        <img className="profilePic" src="./src/assets/profilePic.jpeg"/>
                    </div>
                    <div className="bottomPart">
                        <div className="inputTag">
                            <input type="text" placeholder="UserName" required/>
                        </div>
                        <div className="address">
                            <input type="text" placeholder="address" required/>
                        </div>

                        <div className="role">
                            <p>Choose your role:</p>
                            <select className="role1" name="role" onChange={(e)=>setRole(e.target.value)}> 
                                <option value="select role">Select role</option>
                                <option value="Customer">Customer</option>
                                <option value="Seller">Seller</option>
                                <option value="Delivery Boy">Delivery Boy</option>
                            </select>
                        </div>
                    
                        <div className="submitBtn">
                            <button type="submit" onClick={handle}>Submit</button>
                            <p>Already have an account?   <NavLink to="/logIn">login</NavLink></p>
                        </div>
                    </div>
                </div>
	        </div>

        </>
    )
}

export default SignUp;