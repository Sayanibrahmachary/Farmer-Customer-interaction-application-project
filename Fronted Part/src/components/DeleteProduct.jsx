import React from "react";

function DeleteProduct({closePopup,productId})
{

    const handleProductDelete=async()=>
    {
        try{

            const response=await fetch(`http://localhost:8000/api/v1/product/deleteProduct/${productId}`,
                {
                    method:"DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )

            if(!response.ok)
            {
                const error=await response.json();
				console.error("Error:", error.message);
				alert(error.message);
            }
            else
            {
                const result = await response.json();
				console.log("Product deleted successfully", result);
				alert("Product deleted successfully");
            }
        }
        catch(e)
        {
            console.error(e);
            alert("SOMETHING WENT WRONG ADDING DATA");
        }
    }
    return (
        <>
            <div className="amount-container">
                <div className="popup">
                    <h2>Delete Product</h2>
                    <div className="selectAmount">
                        <p>Are you sure you wants to delete the product?</p>
                    </div>
                    <div className="amountButtons">
                        <button className="btn1" onClick={handleProductDelete} >Delete</button>
                        <button className="close-btn" onClick={closePopup}>Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DeleteProduct;