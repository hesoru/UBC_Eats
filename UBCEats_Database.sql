CREATE TABLE User_Has (
    Username VARCHAR(30) PRIMARY KEY,
    First_Name VARCHAR(30),
    Last_Name VARCHAR(30),
    Email VARCHAR(30) UNIQUE NOT NULL,
    User_Location_Longitude VARCHAR(30) NOT NULL,
    User_Location_Latitude VARCHAR(30) NOT NULL,
    FOREIGN KEY (User_Location_Longitude, User_Location_Latitude) REFERENCES User_Location
);

CREATE TABLE User_Location (
    Longitude VARCHAR(30),
    Latitude VARCHAR(30),
    date DATE,
    Time VARCHAR(30),
    PRIMARY KEY (Longitude, Latitude)
);
