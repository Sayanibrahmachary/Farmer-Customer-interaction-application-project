import React ,{ useState,useEffect }from "react";
import { NavLink } from "react-router-dom";
import './HomePageCustomer.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars,faHouse,faLock,faCartShopping,faTrash,faLocationDot,faFaceSmile} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";
import DashboardCustomer from "../components/DashboardCustomer";
import ChangePassword from "../components/ChangePassword";
import TodaysOrder from "../components/TodaysOrder.jsx";
import Logout from "../components/Logout.jsx";
import TrackOrder from "../components/TrackOrder.jsx";

function HomePageCustomer()
{
    const location = useLocation();
    const { username,id,email } = location.state || {};
    // console.log(username,id,email);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState("dashboard");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        // Save the id to localStorage for retrieval after navigation
        if (id) {
            localStorage.setItem("customerId", id);
        }
    }, [id]);
    useEffect(() => {
        // Save the id to localStorage for retrieval after navigation
        if (username) {
            localStorage.setItem("customerName",username);
        }
    }, [username]);


    const customerId = localStorage.getItem("customerId");
    const name=localStorage.getItem("customerName");
    return(
        <>
            <div className={`wholeHomepage ${isMenuOpen ? "menu-open" : "menu-closed"}`}>
                <div className={`leftSideHomePage ${isMenuOpen ? "open" : "closed"}`}tabIndex="0">
                    <div className="upperPartLeftSide">
                        <div className="webPageName">
                            <h3>
                                🌿 Agri<span style={{color: "green", textDecoration: "underline" }}>C</span>onnect 🌿
                            </h3>
                        </div>
                        <div className="welcomePart">
                            <FontAwesomeIcon icon={faFaceSmile} className="welcomePartSmile"/>
                            <p>welcome, {name}</p>
                        </div>
                    </div>
                    <div className="lowerPartLeftSide">

                        {/* <!-- /////// Customer part //////// 
                        1) home....
                        2) changepassword
                        3) todays order
                        4) cancel order
                        5) payment done or not
                        6) track the order --> */}

                        <div className="homeSection"  tabIndex="0"  onClick={() => setCurrentPage("dashboard")}>
                            <FontAwesomeIcon icon={faHouse} className="homeIcon" />
                            <p>Dashboard</p>
                        </div>
                        <div className="homeSection"  tabIndex="0" onClick={() => setCurrentPage("changePassword")}>
                            <FontAwesomeIcon icon={faLock} className="homeIcon"/>
                            <p>changepassword</p>
                        </div>
                        <div className="homeSection"  tabIndex="0" onClick={() => setCurrentPage("todaysOrder")}>
                            <FontAwesomeIcon icon={faCartShopping} className="homeIcon" />
                            <p>todays order</p>
                        </div>
                        <div className="homeSection"  tabIndex="0" onClick={() => setCurrentPage("track the order")}>
                            <FontAwesomeIcon icon={faLocationDot} className="homeIcon" />
                            <p>track the order</p>
                        </div>
                        <div className="homeSection"  tabIndex="0" onClick={() => setCurrentPage("Log out")}>
                            <FontAwesomeIcon icon={faTrash} className="homeIcon" />
                            <p>Log out</p>
                        </div>

                    </div>
                </div>
                <div className={`rightSideHomePage ${isMenuOpen ? "shifted" : ""}`}>
                    <div className="upperSideHomePage">
                        <FontAwesomeIcon icon={faBars} className="menuBar"  onClick={toggleMenu}  tabIndex="0" />
                    </div>
                   
                    <div className="rightSideLowerHomePage">
                        <div className="dashboard">
                            {currentPage === "dashboard" ? <DashboardCustomer id={customerId}/> : <p></p>}
                        </div>
                        <div className="changePassword">
                            {currentPage=="changePassword" ? <ChangePassword email={email}/>:<p></p>}
                        </div>
                        {currentPage=="todaysOrder" ? <TodaysOrder id={customerId}/>:<p></p>}
                        {currentPage=="track the order" ? <TrackOrder/>:<p></p>}
                        {currentPage=="Log out" ? <Logout/>:<p></p>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePageCustomer;
