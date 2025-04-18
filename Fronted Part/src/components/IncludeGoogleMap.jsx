import React from "react";
import './IncludeGoogleMap.css';

function IncludeGoogleMap()
{
    return (
        <>
            <div className="googleMap">
                <div className="googleMap1">
                  <h1>Google Map</h1>
                  <br></br>
                  <iframe className="map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1692229.690185768!2d85.34392938106592!3d23.736882620277193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fa16ff1397e887%3A0x71543a3dc3e7a20a!2sWest%20Bengal!5e1!3m2!1sen!2sin!4v1743787535490!5m2!1sen!2sin"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
            </div>
        </>
    )
}

export default IncludeGoogleMap;