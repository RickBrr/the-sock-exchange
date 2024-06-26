import Feature from "./Feature";

const Featured = (promo_data) => {
    return (
        <>
            <h5>Featured</h5>
            <div className="card-container d-flex flex-row justify-content-start" style={{ gap: "20px", padding: "20px" }}>

            {
                promo_data.data.map((promo) => (
                    <Feature key={promo.id} data={promo} />
                ))
            }
            </div>
        </>
    );
};

export default Featured;