import React, { useEffect, useState } from "react";
import "./TrackOrder.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faBucket, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const stepIcons = [
  { icon: <FontAwesomeIcon icon={faBucket} />, h1: "Order" },
  { icon: <FontAwesomeIcon icon={faTruck} />, h1: "Transit" },
  { icon: <FontAwesomeIcon icon={faCircleCheck} />, h1: "Completed" }
];

const TrackOrder = () => {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => { setProgress(50); setActiveStep(2); }, 10000),
      setTimeout(() => { setProgress(100); setActiveStep(3); }, 20000)
    ];
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (

      <div className="trackOrderContainer">
    
        <div className="trackOrderContainer1">
          <div className="tracker-title">
            <h3>Track Your Order</h3>
            <FontAwesomeIcon icon={faTruck} className="truck"/>
          </div>
          <div className="tracker-container">
            <div className="tracker-wrapper">
              <div className="line"></div>
              <div className="progress" style={{ width: `${progress}%` }}></div>
              {stepIcons.map((step, index) => (
                <div key={index} className={`step ${activeStep > index ? "active" : ""}`}>
                  {step.icon}
                </div>
              ))}
              
            </div>
          </div>
          <div className="div">
              <div className={`firstStep ${activeStep > 1 ? "active" : ""}`}>
                <h3> Orders</h3>
              </div>
              <div className={`secStep ${activeStep > 2 ? "active" : ""}`}>
                <h3>Transit</h3>
              </div>
              <div className={`thirdStep ${activeStep ==3 ? "active" : ""}`}>
                <h3>Completed</h3>
              </div>
            </div>
        </div>
      </div>
  );
};

export default TrackOrder;
