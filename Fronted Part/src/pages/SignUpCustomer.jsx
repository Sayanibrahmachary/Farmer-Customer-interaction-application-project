import React, { useState } from "react";
import "./SignUpCustomer.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faUser,faEnvelope,faLock,faPhone, faCity,faLocationDot} from '@fortawesome/free-solid-svg-icons'; // ✅ Correct package



function SignUpCustomer()
{
    const[nameCustomer,setNameCustomer]=useState("");
    const[emailCustomer,setEmailCustomer]=useState("");
    const[passCustomer,setPassCustomer]=useState("");
    const[phoneCustomer,setPhoneCustomer]=useState("");
    const[addressCustomer,setAddressCustomer]=useState("");
    const[cityCustomer,setCityCustomer]=useState("");

    const handleSignUpCustomer=async(e)=>
    {
        e.preventDefault();
        const data={
            username:nameCustomer,
            email:emailCustomer,
            password:passCustomer,
            phoneNumber:phoneCustomer,
            address:addressCustomer,
            city:cityCustomer
        };

        try
        {
            const response=await fetch(`http://localhost:8000/api/v1/customers/registerCustomer`,
            {
                method:"Post",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if(!response.ok)
            {
                const error= await response.json();
                console.error("Error :", error.message);
                alert(`Registration Faild ${error.message}`);
            }
            else
            {
                const result= await response.json();
                console.log("Registration Successfull",result);
                alert("Registration Successfull");
            }
        }
        catch(e)
        {
            console.error(e);
            alert("SOMETHING WENT WRONG ADDING DATA");
        }
    }

    return (
        <>
            <div className="signUpCustomerPage">
                <div className="container">
                    <div className="left-container">
                        <div className="left">
                            <img src="./src/assets/nature.jpg"></img>
                            <div className="left-div">
                                <div className="left-div-text">
                                    <h1>WELCOME BACK</h1>
                                    <br/>
                                    <h3>Nature is pleased with simplicity and Nature is the source of true knowledge</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-container">
                        <div className="right">
                            <div className="rightTop">
                                <div className="upperText">
                                    <div className="firstDiv">
                                        <h2>Sign up</h2>
                                    </div>
                                    <p>Sign up to Continue</p>
                                </div>
                                <div className="input-div">
                                    <div className="i1"> 
                                        <FontAwesomeIcon icon={faUser} className="customer"/>
                                   </div>
                                    <input type="text" id="text" placeholder="username" required onChange={(e)=>setNameCustomer(e.target.value)}/>
                                </div>

                                <div className="input-div">
                                    <div className="i1"> 
                                        {/* <i className="fa-solid fa-envelope"></i> */}
                                        <FontAwesomeIcon icon={faEnvelope} className="customer"/>
                                   </div>
                                    <input type="email" id="email" placeholder="email" required onChange={(e)=>setEmailCustomer(e.target.value)}/>
                                </div>
                                <div className="input-div">
                                    <div className="i1"> 
                                        {/* <i className="fa-solid fa-lock"></i> */}
                                        <FontAwesomeIcon icon={faLock} className="customer"/>
                                   </div>
                                   <input required type="password" placeholder="password" onChange={(e)=>setPassCustomer(e.target.value)}/>
                                </div>

                                <div className="input-div">
                                    <div className="i1"> 
                                        {/* <i className="fa-solid fa-phone"></i> */}
                                        <FontAwesomeIcon icon={faPhone} className="customer"/>
                                   </div>
                                   <input required type="number" placeholder="phone number" onChange={(e)=>setPhoneCustomer(e.target.value)}/>
                                </div>

                                <div className="input-div">
                                    <div className="i1"> 
                                        {/* <i className="fa-solid fa-location-dot"></i> */}
                                        <FontAwesomeIcon icon={faLocationDot} className="customer" />
                                   </div>
                                   <input required type="text" placeholder="address" onChange={(e)=>setAddressCustomer(e.target.value)}/>
                                </div>

                                <div className="input-div">
                                    <div className="i1"> 
                                        {/* <i className="fa-solid fa-city"></i> */}
                                        <FontAwesomeIcon icon={faCity} className="customer"/>
                                   </div>
                                   <input required type="text" placeholder="city" onChange={(e)=>setCityCustomer(e.target.value)}/>
                                </div>
                                <div className="buttonSignUpCustomer">
                                    <div className="submitSignUpCustomer">
                                        <button type="submit" className="submitButtonSignUpCustomer" onClick={handleSignUpCustomer}>Submit</button>
                                    </div>
                                    <div className="submitSignUpCustomer">
                                        <button type="submit" className="submitButtonSignUpCustomer">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignUpCustomer;