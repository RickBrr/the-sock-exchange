import React from "react";

const Navigator = (props) => {
    const backPage = () => {
        props.setPage(props.page - 1);
    };

    const nextPage = () => {
        props.setPage(props.page + 1);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <button className='btn btn-primary' onClick={backPage}>Back</button>
            <button className='btn btn-primary' onClick={nextPage}>Next</button>
        </div>
    )
}

export default Navigator;