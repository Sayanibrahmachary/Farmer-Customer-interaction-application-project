import { useState } from "react";
import "./Amount.css"; // Import external CSS

export default function Amount({ closePopup ,productId,customerId}) {

    // console.log(productId);
    // console.log(customerId);
    const [amount,setamount]=useState(null);
    const [kgOrg,setKgOrG]=useState("");

    const handleOrder=async()=>{

        const data={
            amount:amount,
            kgOrg:kgOrg,
        }

        try{
            const response=await fetch(`http://localhost:8000/api/v1/orders/orderPlaced/${customerId}/${productId}`,{
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
				console.log("Order placed successfully", result);
				alert("We take your order Successfully now go to the todays order section and done the payment");
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
                <h2>Amount</h2>
                <div className="selectAmount">
                    <input type="text" placeholder="Required Amount" onChange={(e)=>setamount(e.target.value)}/>
                    <select className="role1" name="role" onChange={(e)=>setKgOrG(e.target.value)}> 
                        <option value="select role">Kg or gram</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                    </select>
                </div>
                <div className="amountButtons">
                    <button className="btn1" onClick={handleOrder}>Submit</button>
                    <button className="close-btn" onClick={closePopup}>Close</button>
                </div>
            </div>
        </div>
        
    );
}
