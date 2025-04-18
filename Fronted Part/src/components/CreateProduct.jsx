import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign, faUser } from "@fortawesome/free-solid-svg-icons";
import './ChangePassword.css';

function CreateProduct() {
    const [files, setFiles] = useState(null);
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");

    const handleFileChange = (event) => {
        setFiles(event.target.files[0]); // Save only the first file
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("pay", price);
        formData.append("photo", files);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("You are not logged in.");
                return;
            }

            const response = await fetch("http://localhost:8000/api/v1/product/createProduct", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData, // Send FormData
            });

            const result = await response.json();
            if (response.ok) {
                alert("Product created successfully!");
            } else {
                alert(result.message || "Something went wrong!");
            }
        } catch (e) {
            console.error("Error:", e);
            alert("Something went wrong!");
        }
    };

    return (
        <div className="changePasswordSection">
            <div className="leftSideChangePassword">
                <img src="./src/assets/vegetable.webp" alt="Vegetable" />
            </div>
            <div className="rightSideChangePassword">
                <div className="innerRightSideChangePassword">
                    <form className="formChangePassword" onSubmit={handleCreateProduct}>
                        <div className="headingChangePassword">
                            <img src="./src/assets/profilePic.jpeg" className="profilePic" alt="Profile" />
                            <h2>Upload Product</h2>
                        </div>

                        <div className="input-div-login">
                            <div className="i1-login">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <input type="text" placeholder="Product Name" required onChange={(e) => setProductName(e.target.value)} />
                        </div>

                        <div className="input-div-login">
                            <div className="i1-login">
                                <FontAwesomeIcon icon={faIndianRupeeSign} />
                            </div>
                            <input type="number" placeholder="Product Price" required onChange={(e) => setPrice(e.target.value)} />
                        </div>

                        <div className="upload-container">
                            <label className="upload-box">
                                {files?<p className="photoName"  style={{ color: files ? 'green' : 'black' }}>{files.name}</p>:<p>Click to Upload File</p>}
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                        <button className="btn" type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateProduct;
