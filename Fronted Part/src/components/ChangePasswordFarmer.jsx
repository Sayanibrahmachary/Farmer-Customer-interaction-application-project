import React ,{useState}from "react";
import './ChangePassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock ,faUser} from '@fortawesome/free-solid-svg-icons';

function ChangePasswordFarmer({email})
{
    const [oldPassword,setOldPassword]=useState("");
        const [newPassword,setNewPassword]=useState("");
    
        const handleChangePassword=async(e)=>
        {
            e.preventDefault();
            const data = {
                email:email,
                oldPassword:oldPassword,
                newPassword:newPassword,
            };
    
            try{
    
                const token = localStorage.getItem("token"); // Retrieve token from local storage
                
                if (!token) {
                    console.error("No token found. Please log in.");
                    alert("You are not logged in.");
                    return;
                }
                console.log("token",token);

                const response=await fetch(`http://localhost:8000/api/v1/farmers/changePasswordFarmer`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Include token
                    },
                    body: JSON.stringify(data),
                })
    
                if (!response.ok) {
                    const error = await response.json();
                    console.error("Error:", error.message);
                    alert(error.message);
                }
                else{
                    const result = await response.json();
                    console.log("Passowrd Changed Successful:", result);
                    alert("Passowrd Changed Successfull");
                }
            }
            catch(e)
            {
                console.error(e);
                alert("SOMETHING WENT WRONG ADDING DATA");
            }
        }
    return(
        <>
            <div className="changePasswordSection">
                <div className="leftSideChangePassword">
                    <img src="./src/assets/changePassword.jpg"></img>
                </div>
                <div className="rightSideChangePassword">
                    <div className="innerRightSideChangePassword">
                    <form className="formChangePassword">
                        <div className="headingChangePassword">
                            <img src="./src/assets/profilePic.jpeg" className="profilePic" alt="Profile Picture"/>
                            <h2>Change Password</h2>
                        </div>

                        <div className="input-div-login">
                            <div className="i1-login">
                                <FontAwesomeIcon icon={faLock} />
                            </div>
                            <input type="password" id="email" name="email" placeholder=" " required onChange={(e)=>setOldPassword(e.target.value)}/>
                            <label htmlFor="email">old Password</label>
                        </div>
                        <div className="input-div-login">
                            <div className="i1-login"> 
                                <FontAwesomeIcon icon={faLock} />
                           </div>
                            <input type="password" id="password" name="password" placeholder=" " required onChange={(e)=>setNewPassword(e.target.value)}/>
                            <label htmlFor="password">New Password</label>
                        </div>
                        <button className="btn" type="submit" onClick={handleChangePassword}>Submit</button>
                    </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePasswordFarmer;