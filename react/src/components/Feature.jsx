import React from "react";

const Feature = (promos) => {
    return (
        <div className="card" style={{ flex: '1', minWidth: '100px', maxWidth: '45%' }}>
            <div className="card-body">
            <div className="card bg-light" style={{gap: "10px"}}>
                <div className="card-text">{promos.data.feature}</div>
                <div><a href="#">Click here to buy!</a></div>
            </div>
            </div>
        </div>
    )
};

export default Feature;