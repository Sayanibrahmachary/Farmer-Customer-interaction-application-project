import React ,{useCallback,useEffect,useState}from "react";
import GetPin from "./GetPin";

function CartItemsDeliveryBoy({setOrders,deliveryBoyId})
{
    const [fetchedProducts, setFetchedProducts] = useState([]);
        const handleCartDelievryBoy =useCallback(async () => {
            try {
                    const token = localStorage.getItem("token"); // Retrieve token from local storage
                
                    if (!token) {
                        console.error("No token found. Please log in.");
                        alert("You are not logged in.");
                        return;
                    }
                    const response = await fetch(
                    `http://localhost:8000/api/v1/deliveryBoy/todaysAllOrder/${deliveryBoyId}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
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
        }, [deliveryBoyId, setOrders]);
        
        useEffect(()=>
        {
            handleCartDelievryBoy()
        },[handleCartDelievryBoy]);


        const [isOpen, setIsOpen] = useState(false);
        
        function handleProduct()
        {
          setIsOpen(true);
        }
    
        function closePopup(event) 
        {
          event.stopPropagation(); // Prevent event bubbling
          setIsOpen(false);
        }
        // const handlePin=async()=>
        // {
        //     try {

        //         data
        //         const response = await fetch(
        //             `http://localhost:8000/api/v1/validCustomer/${}/${pinNumber}`,
        //             {
        //                 method: "POST",
        //                 headers: {
        //                     "Content-Type": "application/json",
        //                     "Authorization": `Bearer ${token}`
        //                 },
        //             }
        //         );
    
        //         if (!response.ok) {
        //             const error = await response.json();
        //             console.error("Error:", error.message);
        //             alert(`Fetching order failed: ${error.message}`);
        //             return;
        //         }
    
        //         const result = await response.json();
        //         console.log("Fetched Data:", result);
        //         alert(`fetched data`);

        //     } catch (e) {
        //         console.error("in the time of pin mathing we cought an error so the error is: ",e);
        //         alert("An error occurred while fetching cart data.");       
        //     }
        // }


    return(
        <>
            <div className="table-container">
                <table className="order-table">
                  <thead>
                    <tr>
                      <th>Product Image</th>
                      <th>Product Name</th>
                      <th>Payment Amount</th>
                      <th>Customer Address</th>
                      <th>Phone Number</th>
                      <th>Delivery Confirmation</th>
                    </tr>
                  </thead>
                  <tbody className="items-details">
                    {fetchedProducts.length > 0 ? (
                      fetchedProducts.map((item, index) => (
                        <tr key={item.id || index}>
                          <td>
                            <img src={item.photo} alt={item.name} className="product-img" />
                          </td>
                          <td>{item.productName}</td>
                          <td className="DeliveryBoy-pay">rs.{item.pay}</td>
                          <td>{item.address}</td>
                          <td>{item.phoneNumber}</td>
                          <td>
                            <button className="confirm-btn" onClick={handleProduct}>Enter Delivery PIN</button>
                            {isOpen && (
                                <div className="overlay" onClick={closePopup}>
                                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                                        <GetPin closePopup={closePopup} deliveryBoyId={deliveryBoyId} />
                                    </div>
                                </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="loading-text">
                          Loading...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
            </div>

        </>
    )
}

export default CartItemsDeliveryBoy;