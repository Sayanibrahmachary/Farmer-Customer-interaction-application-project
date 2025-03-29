import React, { useState, useEffect, useCallback } from "react";
import "./CartItems.css";

function CartItems({ setOrders ,id}) {
    const [totalBill,setTotalBill]=useState(0);
    const [fetchedProducts, setFetchedProducts] = useState([]);

    const handleCart =useCallback(async () => {
        try {
                const token = localStorage.getItem("token"); // Retrieve token from local storage
            
                if (!token) {
                    console.error("No token found. Please log in.");
                    alert("You are not logged in.");
                    return;
                }
                const response = await fetch(
                `http://localhost:8000/api/v1/customers/todaysAllOrder/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Include token
                    },
                }
            );

            if (!response.ok) {
                const error = await response.json();
                console.error("Error:", error.message);
                alert(`Fetching order failed: ${error.message}`);
                return;
            }

            const result = await response.json();
            console.log("Fetched Data:", result);
            alert(`fetched data`);

            const orders = result.data || [];
            setOrders(orders);
            setFetchedProducts(orders);
            
        } catch (error) {
            console.error("Error fetching cart data:", error);
            alert("An error occurred while fetching cart data.");
        }
    }, [id, setOrders]);

    useEffect(() => {
        const total = fetchedProducts.reduce((acc, item) => {
            return acc + handleBill(item.amount, item.kgOrg, item.pay);
        },0);
        setTotalBill(total);
    }, [fetchedProducts]);

    useEffect(()=>
    {
        handleCart();
    },[handleCart])

    function handleBill(amount,kgOrg,pay)
    {
        
        if(kgOrg=='kg')
        {
            return amount*pay;
        }
        else
        {
            //250g
            let d=pay/1000;
            return d*amount;
        }
    }
    return (
        <>
            <div className="items-cartItems">
                <ul>
                    {fetchedProducts.length > 0 ? (
                        fetchedProducts.map((item, index) => (
                            <li key={item.id || index} className="items-cartItems-li">
                                <img src={item.photo} alt={item.name} />
                                <h3>{item.productName}</h3>
                                <h2>{item.amount} </h2>
                                <p>{item.kgOrg}</p>
                                <h2>Rs: {handleBill(item.amount,item.kgOrg,item.pay)}</h2>
                            </li>
                        ))
                    ) : (
                        <p>Loading...</p>
                    )}
                </ul>
                <div className="totalSum">
                        <h2>rs: {totalBill}</h2>
                    </div>
                <div className="totalSum1">
                    <h2>Delivary charge: rs: 5</h2>
                </div>
                <div className="totalSum2">
                    <h2>Total Bill: rs: {totalBill+5}</h2>
                </div>
            </div>
        </>
    );
}

export default CartItems;

