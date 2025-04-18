import React ,{ useState,useEffect }from "react";
import { NavLink } from "react-router-dom";
import './HomePageCustomer.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars,faHouse,faLock,faCartShopping,faTrash,faLocationDot,faFaceSmile} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";
import ChangePasswordDeliveryBoy from "../components/ChangePasswordDeliveryBoy.jsx";
import LogOutDeliveryBoy from "../components/LogOutDeliveryBoy.jsx";
import TodaysOrderDeliveryBoy from "../components/TodaysOrderDeliveryBoy.jsx";
import IncludeGoogleMap from "../components/IncludeGoogleMap.jsx";
function HomePageDeliveryBoy()
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
            localStorage.setItem("deliveryBoyId", id);
        }
    }, [id]);
    useEffect(() => {
        // Save the id to localStorage for retrieval after navigation
        if (username) {
            localStorage.setItem("deliveryBoyName",username);
        }
    }, [username]);


    const deliveryBoyId = localStorage.getItem("deliveryBoyId");
    const name=localStorage.getItem("deliveryBoyName");
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

                        <div className="homeSection"  tabIndex="0"  onClick={() => setCurrentPage("todaysOrder")}>
                            <FontAwesomeIcon icon={faHouse} className="homeIcon" />
                            <p>Todays orders</p>
                        </div>
                        <div className="homeSection"  tabIndex="0" onClick={() => setCurrentPage("changePassword")}>
                            <FontAwesomeIcon icon={faLock} className="homeIcon"/>
                            <p>changepassword</p>
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
                        <div className="changePassword">
                            {currentPage=="changePassword" ? <ChangePasswordDeliveryBoy email={email}/>:<p></p>}
                        </div>
                        {currentPage=="todaysOrder" ? <TodaysOrderDeliveryBoy deliveryBoyId={deliveryBoyId}/>:<p></p>}
                        {currentPage=="track the order" ? <IncludeGoogleMap/>:<p></p>}
                        {currentPage=="Log out" ? <LogOutDeliveryBoy/>:<p></p>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePageDeliveryBoy;
