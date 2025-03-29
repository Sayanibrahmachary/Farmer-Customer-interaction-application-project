import React ,{useState}from "react";
import './product.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faComment} from '@fortawesome/free-regular-svg-icons';
import Amount from './Amount.jsx';

function Product({productId,src,name,price,customerId})
{
    // console.log(productId,customerId);
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

    return (
        <>
            <div className="product">
                <img className="bigImage" src={src}/>
                <div className="productName">
                  <h4>{name}</h4>
                  <FontAwesomeIcon icon={faComment} />
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
                <button onClick={handleProduct} className="addtoCart">Add to cart</button>
            </div>
              {/* Popup & Overlay */}
              {isOpen && (
                <div className="overlay" onClick={closePopup}>
                    <div className="popup" onClick={(e) => e.stopPropagation()}>
                        <Amount closePopup={closePopup} productId={productId} customerId={customerId} />
                    </div>
                </div>
            )}
        </>
    )
}

export default Product;


