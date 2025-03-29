import React,{useEffect,useCallback,useState} from "react";
import AllProduct from "./AllProduct.jsx";

function TodaysAllProductsFarmer({id})
{
    console.log(id);
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
            const response = await fetch(`http://localhost:8000/api/v1/farmers/todaysAllProduct/${id}`, {
                method: "POST",
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

    console.log(fetchAllProducts.length);
    return (
        <>
            <div className="allProducts">
                <div className="allProducts1">
                    {fetchAllProducts.length > 0 ? (
                        fetchAllProducts.map((item, index) => (
                            <AllProduct key={item._id} productId={item.productId} photo={item.photo} productName={item.productName} price={item.pay} farmerId={id}/>
                        ))
                    ) : (
                        <p>Loading.......</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default TodaysAllProductsFarmer;