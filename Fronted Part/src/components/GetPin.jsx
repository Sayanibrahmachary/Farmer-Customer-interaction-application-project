import { useState } from "react";
import "./Amount.css"; // Import external CSS

function GetPin({ closePopup,deliveryBoyId}) {

    const [pin,setPin]=useState(null);

    const pinNumber=localStorage.getItem("pin");
    console.log(pinNumber,deliveryBoyId);

    const handleOrder=async()=>{

        const data={
            pinByCustomer:pin,
        }

        try{
            const response=await fetch(`http://localhost:8000/api/v1/deliveryBoy/validCustomer/${deliveryBoyId}/${pinNumber}`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
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
                console.log("Order Delivered successfully", result);
                localStorage.setItem("orderId", result.data._id);
                alert("order is delivered Successfully");
            }
        }
        catch(e)
        {
            console.error(e);
            alert("SOMETHING WENT WRONG ADDING DATA");
        }
    }

    return (
        <div className="amount-container">
            <div className="popup">
                <h2>Put Pin Number</h2>
                <div className="selectAmount">
                    <input type="text" placeholder="Required Amount" onChange={(e)=>setPin(e.target.value)}/>
                </div>
                <div className="amountButtons">
                    <button className="btn1" onClick={handleOrder}>Submit</button>
                    <button className="close-btn" onClick={closePopup}>Close</button>
                </div>
            </div>
        </div>
        
    );
}

export default GetPin;