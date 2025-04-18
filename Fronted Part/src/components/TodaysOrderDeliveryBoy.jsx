import React, { useState } from "react";
import CartItemsDeliveryBoy from "../components/CartItemsDeliveryBoy.jsx";

function TodaysOrderDeliveryBoy({deliveryBoyId})
{
    const [orders,setOrders]=useState([]);

    return (
        <>
            <div className="todaysOrderSection" >
                <div className="headingPartTodaysOrderSection">
                    <h1>Todays Order</h1>
                </div>
                    <CartItemsDeliveryBoy setOrders={setOrders} deliveryBoyId={deliveryBoyId}/>
                {/* <button>Confirm with PIN</button> */}
            </div>
        </>
    )
}

export default TodaysOrderDeliveryBoy;