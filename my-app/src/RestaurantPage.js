import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import restuarant1 from "./restuarant-1.svg";

const RestaurantInfoOre = () => {
    return (
        <Box
            sx={{
                backgroundColor: "#c2e5ee",
                display: "flex",
                justifyContent: "center",
                width: "100%",
            }}
        >
            <Box
                sx={{
                    backgroundColor: "#c2e5ee",
                    width: 1440,
                    height: 1024,
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        width: 238,
                        height: 70,
                        top: 159,
                        left: 22,
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<FilterListIcon />}
                        sx={{
                            width: 236,
                            height: 70,
                            backgroundColor: "#012046",
                            color: "#fff",
                            fontSize: 40,
                            fontFamily: "Gabarito-Regular, Helvetica",
                        }}
                    >
                        FILTER
                    </Button>
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        width: 298,
                        height: 70,
                        top: 159,
                        left: 302,
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<FilterListIcon />}
                        sx={{
                            width: 296,
                            height: 70,
                            backgroundColor: "#012046",
                            color: "#fff",
                            fontSize: 40,
                            fontFamily: "Gabarito-Regular, Helvetica",
                        }}
                    >
                        EDIT VIEW
                    </Button>
                </Box>

                <Box
                    sx={{
                        position: "absolute",
                        width: 1121,
                        height: 755,
                        top: 269,
                        left: 159,
                    }}
                >
                    <Box
                        sx={{
                            height: 770,
                            backgroundColor: "#fff",
                            position: "relative",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                width: 1020,
                                height: 174,
                                top: 52,
                                left: 53,
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    width: 1020,
                                    height: 58,
                                    top: 88,
                                    left: 0,
                                }}
                            >
                                <Typography
                                    sx={{
                                        position: "absolute",
                                        width: 300,
                                        top: 0,
                                        left: 716,
                                        fontFamily: "Gabarito-Regular, Helvetica",
                                        fontSize: "2.5rem",
                                        color: "#000",
                                    }}
                                >
                                    123 - 456 - 789
                                </Typography>

                                <Typography
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        fontFamily: "Gabarito-Regular, Helvetica",
                                        fontSize: "2.5rem",
                                        color: "#000",
                                    }}
                                >
                                    Cuisine Type
                                </Typography>
                            </Box>

                            <Typography
                                sx={{
                                    position: "absolute",
                                    width: 715,
                                    top: 0,
                                    left: 150,
                                    fontFamily: "Gabarito-Regular, Helvetica",
                                    fontSize: "2.5rem",
                                    color: "#000",
                                }}
                            >
                                Street Address, City, Postal Code,
                            </Typography>
                        </Box>

                        <Box
                            component="img"
                            sx={{
                                position: "absolute",
                                width: 798,
                                height: 448,
                                top: 251,
                                left: 162,
                                objectFit: "cover",
                            }}
                            alt="Restaurant"
                            src={restuarant1}
                        />
                    </Box>
                </Box>

                <Typography
                    sx={{
                        position: "absolute",
                        top: 5,
                        left: 507,
                        fontFamily: "Gabarito-Regular, Helvetica",
                        fontSize: "4rem",
                        color: "#000",
                        whiteSpace: "nowrap",
                    }}
                >
                    ROMANO
                </Typography>
            </Box>
        </Box>
    );
};

export default RestaurantInfoOre;
