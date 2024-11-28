import React from "react";
import { useNavigate } from 'react-router-dom';
import restuarant1 from "../containers/restaurant-1.svg";

const RestaurantPage = ({ restaurant }) => {
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };
    return (
        <div
            style={{
                backgroundColor: "#c2e5ee",
                display: "flex",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <div
                style={{
                    backgroundColor: "#c2e5ee",
                    width: "1440px",
                    height: "1024px",
                    position: "relative",
                }}
            >

                <div
                    style={{
                        position: "absolute",
                        width: "238px",
                        height: "70px",
                        top: "159px",
                        left: "22px",
                    }}
                >
                    <button
                        style={{
                            width: "236px",
                            height: "70px",
                            backgroundColor: "#012046",
                            color: "#fff",
                            fontSize: "40px",
                            fontFamily: "Gabarito-Regular, Helvetica",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        FILTER
                    </button>
                </div>
                {/* Back Button */}
                <div
                    style={{
                        position: "absolute",
                        width: "150x",
                        height: "90px",
                        bottom: "100 px",
                        right: "20px",
                    }}
                >
                    <button
                        onClick={goBack}
                        style={{
                            width: "236px",
                            height: "70px",
                            backgroundColor: "#012046",
                            color: "#fff",
                            fontSize: "40px",
                            fontFamily: "Gabarito-Regular, Helvetica",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        BACK
                    </button>
                </div>
                <div
                    style={{
                        position: "absolute",
                        width: "298px",
                        height: "70px",
                        top: "159px",
                        left: "302px",
                    }}
                >
                    <button
                        style={{
                            width: "296px",
                            height: "70px",
                            backgroundColor: "#012046",
                            color: "#fff",
                            fontSize: "40px",
                            fontFamily: "Gabarito-Regular, Helvetica",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        EDIT VIEW

                    </button>
                </div>
                <div style={{
                    backgroundColor: "#c2e5ee",
                    display: "flex",
                    justifyContent: "center",
                    width: "40%",
                    padding: "20px",
                    fontSize: 30,
                    fontStyle: "-moz-initial",
                    flexDirection: "column",
                    alignItems: "center", }} >
                    Average Price: {restaurant},
                    Average Rating: {restaurant.AVERAGE_RATING}
                </div>
                <div
                    style={{
                        position: "absolute",
                        width: "1121px",
                        height: "755px",
                        top: "269px",
                        left: "159px",
                        backgroundColor: "#fff",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: "1020px",
                            height: "174px",
                            top: "52px",
                            left: "53px",
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                width: "1020px",
                                height: "58px",
                                top: "88px",
                                left: "0",
                            }}
                        >
                            <p
                                style={{
                                    position: "absolute",
                                    width: "300px",
                                    top: "0",
                                    left: "716px",
                                    fontFamily: "Gabarito-Regular, Helvetica",
                                    fontSize: "2.5rem",
                                    color: "#000",
                                }}
                            >
                                {restaurant.PHONE_NUMBER}
                            </p>

                            <p
                                style={{
                                    position: "absolute",
                                    top: "0",
                                    left: "0",
                                    fontFamily: "Gabarito-Regular, Helvetica",
                                    fontSize: "2.5rem",
                                    color: "#000",
                                }}
                            >
                                {restaurant.CUISINE_TYPE}
                            </p>
                        </div>

                        <p
                            style={{
                                position: "absolute",
                                width: "715px",
                                top: "0",
                                left: "150px",
                                fontFamily: "Gabarito-Regular, Helvetica",
                                fontSize: "2.5rem",
                                color: "#000",
                            }}
                        >
                            {restaurant.STREET_ADDRESS}, {restaurant.CITY}, {restaurant.PROVINCE_OR_STATE}, {restaurant.POSTAL_CODE}
                        </p>
                    </div>

                    <img
                        style={{
                            position: "absolute",
                            width: "798px",
                            height: "448px",
                            top: "251px",
                            left: "162px",
                            objectFit: "cover",
                        }}
                        alt="Restaurant"
                        src={restuarant1}
                    />
                </div>

                <h1
                    style={{
                        position: "absolute",
                        top: "5px",
                        left: "507px",
                        fontFamily: "Gabarito-Regular, Helvetica",
                        fontSize: "4rem",
                        color: "#000",
                        whiteSpace: "nowrap",
                    }}
                >
                    {restaurant.LOCATION_NAME}
                </h1>
                <p
                    style={{
                        position: "absolute",
                        top: "80px",
                        left: "507px",
                        fontFamily: "Gabarito-Regular, Helvetica",
                        fontSize: "1.5rem",
                        color: "#000",
                    }}
                >
                    Number of Locations: {restaurant.TOTAL_ROWS}
                </p>
            </div>
        </div>
    );
};

export default RestaurantPage;
