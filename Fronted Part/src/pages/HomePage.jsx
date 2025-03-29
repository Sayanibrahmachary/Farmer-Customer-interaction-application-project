import React from "react";
import './HomePage.css';
import {NavLink,Link} from "react-router-dom";

function HomePage()
{
    return(
        <>
            <div className="video-container">
		        <video autoPlay muted loop>
		        	<source src="./src/assets/heroSectionVideo.mp4" type="video/mp4"/>
		        	Your browser does not support the video tag.
		        </video>
		        <div className="navBar">
		        	<div className="navBar1">
		        		<div className="webName">
		        			<div className="projectName">
								<h1>
  									🌿 Agri<span style={{ color: "green", textDecoration: "underline" }}>C</span>onnect 🌿
								</h1>
		        			</div>
		        			<div className="differentComponents">
		        				<h3>Home</h3>
		        				<h3>Help</h3>
		        				<button className="signUp">
									<NavLink to="/signUp" className="signInId">
										Sign Up
                                    </NavLink>
								</button>
		        				<button className="signUp">
									<NavLink to="/logIn" className="signInId">
                                        Log in
                                    </NavLink>
								</button>
		        			</div>
		        		</div>

		        	</div>

		        </div>
		        <div className="overlay-text">
		        	<h2>Order your favourite Vegetables here</h2>
                        <p>Explore a rich variety of farming types, cultivated with the best practices and deep agricultural knowledge. Connect, learn, and grow as you discover sustainable techniques and elevate your farming journey, one harvest at a time. 🌾🚜</p>
		        </div>
	        </div>
        </>
    )
}

export default HomePage;