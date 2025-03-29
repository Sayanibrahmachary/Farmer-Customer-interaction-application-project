import React, { useState } from "react";
import './Amount.css';

function UpdateProduct({closePopup,productId})
{

    const [productName,setProductName]=useState("");
    const [price,setPrice]=useState();

    const handleUpdateProduct=async()=>
    {
        const data={
            productName:productName,
            pay:price,
        }

        try
        {
            const response=await fetch(`http://localhost:8000/api/v1/product/updateProduct/${productId}`,{
                method: "PATCH",
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
				console.log("Product update successfully", result);
				alert("Product update successfully");
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
            <div className="amount-container">
                <div className="popup">
                    <h2>Update Product</h2>
                    <div className="selectAmount">
                        <input type="text" placeholder="Product name" onChange={(e)=>setProductName(e.target.value)}/>
                        <input type="number" placeholder="Price" onChange={(e)=>setPrice(e.target.value)}/>
                    </div>
                    <div className="amountButtons">
                        <button className="btn1" onClick={handleUpdateProduct}>Submit</button>
                        <button className="close-btn" onClick={closePopup}>Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateProduct;