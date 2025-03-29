import React, { useCallback, useEffect, useState } from "react";
import Product from "../components/Product.jsx";
import './DashboardCustomer.css';

function DashboardCustomer({id})
{
    const customerId=id;
    const [fetchAllProducts,setAllProducts]=useState([]);


    const handleProducts = useCallback(async () => {
        try {
            const token = localStorage.getItem("token"); // Retrieve token from local storage
    
            if (!token) {
                console.error("No token found. Please log in.");
                alert("You are not logged in.");
                return;
            }

            // console.log(token);
            const response = await fetch(`http://localhost:8000/api/v1/customers/allProductsAccordingToAddress/${customerId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Include token
                },
            });
    
            if (!response.ok) {
                const error = await response.json();
                console.error("Error:", error.message);
                alert(`Fetched products failed: ${error.message}`);
            } else {
                const result = await response.json();
                setAllProducts(result.data);
                console.log("all products",result);
            }
        } catch (e) {
            console.error("Fetch error:", e);
        }
    });

    useEffect(()=>
    {
        handleProducts()
    },[])

    console.log(fetchAllProducts);
    return(
        <>
            <div className="allProducts">
                <div className="allProducts1">
                    {fetchAllProducts.length > 0 ? (
                        fetchAllProducts.map((item, index) => (
                            <Product key={item._id} productId={item.productId} src={item.productPhoto} name={item.productName} price={item.productPay} customerId={id}/>
                        ))
                    ) : (
                        <p>Loading.......</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default DashboardCustomer;
