import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "./Success.css";

const Success = () => {
    const navigate = useNavigate();
    const orderId=localStorage.getItem("orderId");
    const [pin,setPin]=useState("");

    useEffect(() => {
        // Get ID from localStorage after successful payment
        setPin(Math. floor(Math. random() * (9999 - 1000 + 1)) + 1000);
        

        const customerId = localStorage.getItem("customerId");
        if (customerId) {
            bookDeliveryBoy(customerId); // ✅ Book delivery only if ID exists
        } else {
            console.error("No customer ID found!");
        }
    }, []);

    const bookDeliveryBoy = async (customerId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/deliveryBoy/bookDeliveryBoy/${customerId}/${orderId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Error:", error.message);
                alert(`Fetching book delivery boy section: ${error.message}`);
                return;
            }

            const result = await response.json();
            console.log("📦 Booked delivery boy successfully:", result);
            alert("Delivery Boy booked successfully!");
        } catch (e) {
            console.error("❌ Error booking delivery boy:", e);
            alert("An error occurred while booking delivery boy");
        }
    };

    const handleGoBackToDashboard = () => {
        navigate("/homePageCustomer"); // ✅ Navigate to home page
    };
    localStorage.setItem("pin",pin);
    return (
        <div className="successPage">
            <div className="successPage1">
                <FontAwesomeIcon icon={faCircleCheck} className="successicon" />
                <h3>Payment Successful</h3>
                <p>Would you like to go to the Dashboard or Home page?</p>
                <h5>Pin: <h4>{pin}</h4></h5>
                <button onClick={handleGoBackToDashboard} className="confirmButton">Confirm</button>
            </div>
        </div>
    );
};

export default Success;
