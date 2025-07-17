import React ,{useState}from "react";
import './Product.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faComment} from '@fortawesome/free-regular-svg-icons';
import Amount from './Amount.jsx';
import AllComments from "./AllComments.jsx";


function Product({productId,src,name,price,customerId})
{
    //console.log(productId,customerId);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenComments, setIsOpenComments] = useState(false);
    const [comments,setComments]=useState([]);

    function handleProduct()
    {
      setIsOpen(true);
    }

    function closePopup(event) 
    {
      event.stopPropagation();
      setIsOpen(false);
    }

    const handleComment=async()=>
    {
       try{

          const response=await fetch(`http://localhost:8000/api/v1/product/allComments/${productId}`,{
            method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
          })
        
        if (!response.ok) {
          const error = await response.json();
          console.error("Error:", error.message);
          alert(`Fetching all comments: ${error.message}`);
          return;
        }

        const result = await response.json();
        console.log("📦 all comments successfully:", result);
        setComments(result.data);
        setIsOpenComments(true);
        alert("fetched all comments successfully!");
       }
       catch(e)
       {
          console.error(e);
          alert(`An error occurred while fetching all the comments`);
       }
    }

    return (
        <>
            <div className="product">
                <img className="bigImage" src={src}/>
                <div className="productName">
                  <h4>{name}</h4>
                  <FontAwesomeIcon icon={faComment} onClick={handleComment} className="commentIcon" />
                </div>
                <div className="veg-qoute">
                  <p>Healthy and nutrient-rich.</p>
                </div>
                <div className="stars">
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/003/170/298/small/five-stars-5-star-icon-set-yellow-isolated-five-stars-vector.jpg"
                    alt="stars"
                  />
                  <h4 className="productPay">Rs:{price}</h4>
                </div>
                <button onClick={handleProduct} id="addtoCart">Add to cart</button>
            </div>

            {/* Popup & Overlay */}
            {isOpen && (
                <div className="overlay" onClick={closePopup}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <Amount closePopup={closePopup} productId={productId} customerId={customerId} />
                    </div>
                </div>
            )}

            {/* All comments */}
            {isOpenComments && 
            (
              <AllComments comments={comments} setIsOpenComments={setIsOpenComments} productId={productId}/>
            )}

        </>
    )
}

export default Product;


