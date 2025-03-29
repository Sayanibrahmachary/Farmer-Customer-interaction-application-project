import React ,{ useState,useEffect }from "react";
import { NavLink } from "react-router-dom";
import './HomePageCustomer.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars,faHouse,faLock,faCartShopping,faTrash,faLocationDot,faFaceSmile} from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";
import TodaysAllProductsFarmer from "../components/TodaysAllProductsFarmer";
import LogOutFarmer from "../components/LogOutFarmer";
import ChangePasswordFarmer from "../components/ChangePasswordFarmer";
import CreateProduct from "../components/CreateProduct";


function HomePageFarmer()
{
    const location = useLocation();
    const {email, username,id} = location.state || {};
    // console.log(username,id);
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState("TodaysAllOrder");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        // Save the id to localStorage for retrieval after navigation
        if (id) {
            localStorage.setItem("farmerId", id);
        }
    }, [id]);
    useEffect(() => {
        // Save the id to localStorage for retrieval after navigation
        if (username) {
            localStorage.setItem("farmerName",username);
        }
    }, [username]);


    const farmerId = localStorage.getItem("farmerId");
    const name=localStorage.getItem("farmerName");
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


                        <div className="homeSection"  tabIndex="0"  onClick={() => setCurrentPage("TodaysAllOrder")}>
                            <FontAwesomeIcon icon={faHouse} className="homeIcon" />
                            <p>Todays all product</p>
                        </div>
                        <div className="homeSection"  tabIndex="0" onClick={() => setCurrentPage("CreateProduct")}>
                            <FontAwesomeIcon icon={faCartShopping} className="homeIcon" />
                            <p>Create product</p>
                        </div>
                        <div className="homeSection"  tabIndex="0" onClick={() => setCurrentPage("changePassword")}>
                            <FontAwesomeIcon icon={faLock} className="homeIcon"/>
                            <p>Changed Password</p>
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
                            {currentPage === "TodaysAllOrder" ? <TodaysAllProductsFarmer id={farmerId}/> : <p></p>}
                        </div>
                        <div className="changePassword">
                            {currentPage=="changePassword" ? <ChangePasswordFarmer email={email}/>:<p></p>}
                        </div>
                        {currentPage=="CreateProduct" ? <CreateProduct/>:<p></p>}
                        {currentPage=="Log out" ? <LogOutFarmer/>:<p></p>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePageFarmer;