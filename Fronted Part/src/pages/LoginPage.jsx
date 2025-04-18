import React, { useEffect, useState } from "react";
import './LoginPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock ,faUser} from '@fortawesome/free-solid-svg-icons';
import { NavLink, useNavigate } from "react-router-dom";
import AlertMessage from "../components/AlertMessage.jsx";


function LoginPage()
{
	const navigate=useNavigate();
	const[role,setRole]=useState(null);
	const [email,setEmail]=useState("");
	const [pass,setPass]=useState("");
	const [alertMessage, setalertMessage]=useState("");
	const [showAlert, setShowAlert] = useState(false);


	const handleLoginSubmit=async(e)=>
	{
		e.preventDefault();
		const data = {
			email: email,
			password: pass,
		};

		let endPoint="";

		switch(role){
			case "Customer":
				endPoint="http://localhost:8000/api/v1/customers/loginCustomer";
				break;
			case "Seller":
				endPoint="http://localhost:8000/api/v1/farmers/loginFarmer";
				break;
			case "Delivery Boy":
				endPoint="http://localhost:8000/api/v1/deliveryBoy/loginDeliveryBoy";
				break;
		}

		try{
			const response=await fetch(endPoint,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			console.log(response);
			if (!response.ok) {
				const error = await response.json();
				console.error("Error:", error.message);
				setalertMessage(error.message);
				setShowAlert(true);
			}
			else{
				const result = await response.json();
				console.log("Login Successful:", result);
				// console.log(result.data.accessToken);
				localStorage.setItem("token", result.data.accessToken);
				const token =localStorage.getItem("token");
				console.log(token);
				
				setalertMessage("Login Successfull");
				setShowAlert(true);

				if(role=="Customer")
				{
					localStorage.setItem("paymentDone", "false");
					setTimeout(() => {
						setShowAlert(false);
						navigate('/homePageCustomer',{
	
							state:{
								username: result.data.user.username,
								id:result.data.user._id,
								email:result.data.user.email,
							}
						});
					}, 2000); // 2-second delay
				}
				else if(role=="Seller")
				{
					setTimeout(() => {
						setShowAlert(false);
						navigate('/homePageFarmer',{
	
							state:{
								username: result.data.user.username,
								id:result.data.user._id,
								email:result.data.user.email,
							}
						});
					}, 2000); // 2-second delay
				}
				else if(role=="Delivery Boy")
				{
					setTimeout(() => {
						setShowAlert(false);
						navigate('/homePageDeliveryBoy',{

							state:{
								username: result.data.user.username,
								id:result.data.user._id,
								email:result.data.user.email,
							}
						});
					}, 2000); // 2-second delay
				}
			}
		}
		catch(e)
		{
			console.log(e);
			setalertMessage("SOMETHING WENT WRONG ADDING DATA");
			setShowAlert(true);
		}
	}

	
    return (
        <>
			{showAlert && <AlertMessage message={alertMessage} />}
			<img className="wave" src="./src/assets/wave1.png"/>
    		<div className="containerLogin">
				<div className="img">
					<img src="./src/assets/bg.svg" className="boy"/>
				</div>
    		    <div className="login-content">
					<form className="form">
						<img src="./src/assets/profilePic.jpeg" className="profilePic" alt="Profile Picture"/>
						<h2>Welcome</h2>
						<div className="input-div-login">
							<div className="i1-login">
								<FontAwesomeIcon icon={faUser} />
							</div>
							<input type="email" id="email" name="email" placeholder=" " required onChange={(e)=>setEmail(e.target.value)}/>
							<label htmlFor="email">email</label>
						</div>
						<div className="input-div-login">
							<div className="i1-login"> 
								<FontAwesomeIcon icon={faLock} />
						   </div>
							<input type="password" id="password" name="password" placeholder=" " required onChange={(e)=>setPass(e.target.value)}/>
							<label htmlFor="password">Password</label>
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
						<NavLink href="#" className="password">Forgot Password?</NavLink>
						<button className="btn" type="submit" onClick={handleLoginSubmit}>Login</button>
					</form>
    		    </div>
    		</div>
        </>
    )
}

export default LoginPage
