import React from "react";

const Navigator = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button className='btn btn-primary'>Back</button>
            <button className='btn btn-primary'>Next</button>
        </div>
    )
}

export default Navigator;