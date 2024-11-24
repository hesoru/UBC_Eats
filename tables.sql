DROP TABLE User_Has CASCADE CONSTRAINTS;
DROP TABLE User_Location CASCADE CONSTRAINTS;
DROP TABLE Review_For_Makes CASCADE CONSTRAINTS;
DROP TABLE Restaurant_Location_Has CASCADE CONSTRAINTS;
DROP TABLE Distance_From CASCADE CONSTRAINTS;
DROP TABLE Restaurant CASCADE CONSTRAINTS;
DROP TABLE Menu_Serves CASCADE CONSTRAINTS;
DROP TABLE Menu_Item_On CASCADE CONSTRAINTS;
DROP TABLE Contains_Allergen CASCADE CONSTRAINTS;
DROP TABLE Contains_Diet CASCADE CONSTRAINTS;
DROP TABLE Allergen CASCADE CONSTRAINTS;
DROP TABLE Diet CASCADE CONSTRAINTS;
DROP TABLE Dietary_Profile_Can_Save CASCADE CONSTRAINTS;
DROP TABLE Stores_Allergen CASCADE CONSTRAINTS;
DROP TABLE Stores_Diet CASCADE CONSTRAINTS;


CREATE TABLE User_Location (
                               Longitude NUMBER(9, 6),
                               Latitude NUMBER(9, 6),
                               Record_Date DATE,
                               Record_Time TIMESTAMP,
                               PRIMARY KEY (Longitude, Latitude)
);

CREATE TABLE User_Has (
                          Username VARCHAR2(30) PRIMARY KEY,
                          First_Name VARCHAR2(30),
                          Last_Name VARCHAR2(30),
                          Email VARCHAR2(30) NOT NULL UNIQUE,
                          User_Longitude NUMBER(9, 6) NOT NULL,
                          User_Latitude NUMBER(9, 6) NOT NULL,
                          CONSTRAINT fk_user_location FOREIGN KEY (User_Longitude, User_Latitude)
                              REFERENCES User_Location(Longitude, Latitude)
                              ON DELETE CASCADE
);

CREATE TABLE Restaurant (
                            Id VARCHAR2(30) PRIMARY KEY,
                            Cuisine_Type VARCHAR2(30),
                            Restaurant_Name VARCHAR2(30),
                            Average_Price NUMBER(10, 0) CHECK (Average_Price >= 0)
);

CREATE TABLE Restaurant_Location_Has (
                                         Restaurant_Id VARCHAR2(30),
                                         Longitude NUMBER(9, 6),
                                         Latitude NUMBER(9, 6),
                                         City VARCHAR2(30),
                                         Province_or_State VARCHAR2(2),
                                         Street_Address VARCHAR2(50) NOT NULL UNIQUE,
                                         Postal_Code CHAR(6),
                                         Location_Name VARCHAR2(30),
                                         Phone_Number VARCHAR2(15) UNIQUE,
                                         Average_Rating NUMBER(3, 2) CHECK (Average_Rating BETWEEN 0 AND 5),
                                         PRIMARY KEY (Longitude, Latitude),
                                         CONSTRAINT fk_restaurant FOREIGN KEY (Restaurant_Id)
                                             REFERENCES Restaurant(Id)
);

CREATE TABLE Review_For_Makes (
                                  Id VARCHAR2(30) PRIMARY KEY,
                                  Content VARCHAR2(200) NOT NULL,
                                  Rating NUMBER(10, 0) CHECK (Rating BETWEEN 0 AND 5),
                                  Record_Date DATE,
                                  Record_Time TIMESTAMP,
                                  Username VARCHAR2(30) NOT NULL,
                                  Restaurant_Longitude NUMBER(9, 6),
                                  Restaurant_Latitude NUMBER(9, 6),
                                  CONSTRAINT fk_user_review FOREIGN KEY (Username)
                                      REFERENCES User_Has(Username),
                                  CONSTRAINT fk_restaurant_location FOREIGN KEY (Restaurant_Longitude, Restaurant_Latitude)
                                      REFERENCES Restaurant_Location_Has(Longitude, Latitude)
);

CREATE TABLE Distance_From (
                               User_Longitude DECIMAL(9, 6),
                               User_Latitude DECIMAL(9, 6),
                               Restaurant_Longitude DECIMAL(9, 6),
                               Restaurant_Latitude DECIMAL(9, 6),
                               Distance_Difference_KM DECIMAL(9, 6),
                               PRIMARY KEY (User_Longitude, User_Latitude, Restaurant_Longitude, Restaurant_Latitude),
                               FOREIGN KEY (User_Longitude, User_Latitude)
                                   REFERENCES User_Location(Longitude, Latitude),
                               FOREIGN KEY (Restaurant_Longitude, Restaurant_Latitude)
                                   REFERENCES Restaurant_Location_Has(Longitude, Latitude)
);

CREATE TABLE Menu_Serves (
                             Id VARCHAR2(30) PRIMARY KEY,
                             Food_Type VARCHAR2(30),
                             Restaurant_Latitude NUMBER(9, 6) NOT NULL,
                             Restaurant_Longitude NUMBER(9, 6) NOT NULL,
                             CONSTRAINT fk_menu_restaurant FOREIGN KEY (Restaurant_Latitude, Restaurant_Longitude)
                                 REFERENCES Restaurant_Location_Has(Latitude, Longitude)
);

CREATE TABLE Menu_Item_On (
                              Menu_Name VARCHAR2(60),
                              Menu_Id VARCHAR2(30) NOT NULL,
                              Description VARCHAR2(100),
                              Menu_Type VARCHAR2(30),
                              Price NUMBER(9, 2),
                              PRIMARY KEY (Menu_Name, Menu_Id),
                              CONSTRAINT fk_menu_item FOREIGN KEY (Menu_Id) REFERENCES Menu_Serves(Id)
);

CREATE TABLE Diet (
                      Diet_Type VARCHAR2(30) PRIMARY KEY
);

CREATE TABLE Allergen (
                          Allergen_Type VARCHAR2(30) PRIMARY KEY
);

CREATE TABLE Contains_Diet (
                               Diet_Type VARCHAR2(30),
                               Menu_Item_Name VARCHAR2(60),
                               Menu_Id VARCHAR2(30),
                               PRIMARY KEY (Diet_Type, Menu_Item_Name, Menu_Id),
                               CONSTRAINT fk_diet FOREIGN KEY (Diet_Type) REFERENCES Diet(Diet_Type),
                               CONSTRAINT fk_menu_diet FOREIGN KEY (Menu_Item_Name, Menu_Id) REFERENCES Menu_Item_On(Menu_Name, Menu_Id)
);

CREATE TABLE Dietary_Profile_Can_Save (
                                          Profile_Name VARCHAR2(30),
                                          Username VARCHAR2(30) NOT NULL,
                                          PRIMARY KEY (Profile_Name, Username),
                                          CONSTRAINT fk_user_profile FOREIGN KEY (Username) REFERENCES User_Has(Username)
);

CREATE TABLE Stores_Diet (
                             Dietary_Profile_Name VARCHAR2(30),
                             User_Username VARCHAR2(30) NOT NULL,
                             Diet_Type VARCHAR2(30),
                             PRIMARY KEY (Dietary_Profile_Name, User_Username, Diet_Type),
                             CONSTRAINT fk_diet_user FOREIGN KEY (Diet_Type) REFERENCES Diet(Diet_Type),
                             CONSTRAINT fk_dietary_profile_Diet FOREIGN KEY (Dietary_Profile_Name, User_Username) REFERENCES Dietary_Profile_Can_Save(Profile_Name, Username)
);

CREATE TABLE Contains_Allergen (
                                   Allergen_Type VARCHAR2(30),
                                   Menu_Item_Name VARCHAR2(60),
                                   Menu_Id VARCHAR2(30),
                                   PRIMARY KEY (Allergen_Type, Menu_Item_Name, Menu_Id),
                                   CONSTRAINT fk_allergen FOREIGN KEY (Allergen_Type) REFERENCES Allergen(Allergen_Type),
                                   CONSTRAINT fk_menu_allergen FOREIGN KEY (Menu_Item_Name, Menu_Id) REFERENCES Menu_Item_On(Menu_Name, Menu_Id)
);

CREATE TABLE Stores_Allergen (
                                 Dietary_Profile_Name VARCHAR2(30),
                                 User_Username VARCHAR2(30),
                                 Allergen_Type VARCHAR2(30),
                                 PRIMARY KEY (Dietary_Profile_Name, User_Username, Allergen_Type),
                                 CONSTRAINT fk_allergen_user FOREIGN KEY (Allergen_Type) REFERENCES Allergen(Allergen_Type),
                                 CONSTRAINT fk_user_allergen FOREIGN KEY (User_Username) REFERENCES User_Has(Username),
                                 CONSTRAINT fk_dietary_profile_Allergen FOREIGN KEY (Dietary_Profile_Name, User_Username) REFERENCES Dietary_Profile_Can_Save(Profile_Name, Username)
);
