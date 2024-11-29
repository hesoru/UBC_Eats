-- Table drop + creations

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

/* ASSERTION NEEDED - to ensure each user MUST be associated with a single User_Location */
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

/* ASSERTION NEEDED - to ensure Restaurant_Location MUST be associated with AT LEAST 1 menu */
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

/* ASSERTION NEEDED - to ensure Review MUST be associated with a single User */
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
   Distance_Difference_KM DECIMAL(10, 6),
   PRIMARY KEY (User_Longitude, User_Latitude, Restaurant_Longitude, Restaurant_Latitude),
   FOREIGN KEY (User_Longitude, User_Latitude)
       REFERENCES User_Location(Longitude, Latitude),
   FOREIGN KEY (Restaurant_Longitude, Restaurant_Latitude)
       REFERENCES Restaurant_Location_Has(Longitude, Latitude)
);

/* ASSERTION NEEDED - to ensure Menu MUST be associated with a single Restaurant_Location */
CREATE TABLE Menu_Serves (
   Id VARCHAR2(30) PRIMARY KEY,
   Food_Type VARCHAR2(30),
   Restaurant_Latitude NUMBER(9, 6) NOT NULL,
   Restaurant_Longitude NUMBER(9, 6) NOT NULL,
   CONSTRAINT fk_menu_restaurant FOREIGN KEY (Restaurant_Latitude, Restaurant_Longitude)
       REFERENCES Restaurant_Location_Has(Latitude, Longitude)
);

/* ASSERTION NEEDED - to ensure Menu_Item MUST be associated with a single Menu */
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

/* ASSERTION NEEDED - to ensure Dietary_Profile MUST be associated with a single User */
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
   CONSTRAINT fk_dietary_profile_Allergen FOREIGN KEY (Dietary_Profile_Name, User_Username) REFERENCES Dietary_Profile_Can_Save(Profile_Name, Username)
);

-- Insertion statements

INSERT INTO User_Location VALUES (-123.1207, 49.2827, DATE '2024-10-30', TIMESTAMP '2024-10-30 08:30:00');
INSERT INTO User_Location VALUES (-122.4194, 37.7749, DATE '2024-10-31', TIMESTAMP '2024-10-31 15:45:00');
INSERT INTO User_Location VALUES (-123.120735, 49.282730, DATE '2024-11-01', TIMESTAMP '2024-11-01 16:45:00');
INSERT INTO User_Location VALUES (-123.120744, 49.282740, DATE '2024-11-02', TIMESTAMP '2024-11-02 17:45:00');
INSERT INTO User_Location VALUES (-123.120730, 49.282735, DATE '2024-11-03', TIMESTAMP '2024-11-03 18:45:00');
INSERT INTO User_Location VALUES (-123.120728, 49.282733, DATE '2024-11-04', TIMESTAMP '2024-11-04 19:45:00');
INSERT INTO User_Location VALUES (-123.120739, 49.282728, DATE '2024-11-05', TIMESTAMP '2024-11-05 20:45:00');


INSERT INTO User_Has VALUES ('jdoe', 'John', 'Doe', 'jdoe@example.com', -123.1207, 49.2827);
INSERT INTO User_Has VALUES ('esmith', 'Emma', 'Smith', 'esmith@example.com', -122.4194, 37.7749);
INSERT INTO User_Has VALUES ('hesoru', 'Helena', 'Sokolovska', 'hesoru@gmail.com', -123.1207, 49.2827);
INSERT INTO User_Has VALUES ('hedie', 'Hediyeh', 'Mahmoudian', 'hediemahmoudian@gmail.com', -123.1207, 49.2827);
INSERT INTO User_Has VALUES ('oreo', 'Oreoluwa', 'Akinwunmi', 'oreakinwunmi@yahoo.com', -123.1207, 49.2827);
INSERT INTO User_Has VALUES ('jsmith', 'Jane', 'Smith', 'jsmith@hotmail.com', -123.1207, 49.2827);
INSERT INTO User_Has VALUES ('alovelace', 'Ada', 'Lovelace', 'alovelace@gmail.com', -123.1207, 49.2827);

INSERT INTO Restaurant VALUES ('R001', 'Cafe', 'Cafe Delight', 15);
INSERT INTO Restaurant VALUES ('R002', 'Diner', 'The Diner', 25);
INSERT INTO Restaurant VALUES ('R006', 'Grill', 'The Point Grill', 30);
INSERT INTO Restaurant VALUES ('R007', 'Poke', 'Pacific Poke', 20);
INSERT INTO Restaurant VALUES ('R008', 'Gallery', 'Gallery 2 Go', 18);
INSERT INTO Restaurant VALUES ('R009', 'Pizzeria', 'Mercante', 22);
INSERT INTO Restaurant VALUES ('R010', 'Coffee Shop', 'Tim Hortons', 5);
INSERT INTO Restaurant VALUES ('R011', 'Coffee Shop', 'Starbucks', 10);

INSERT INTO Restaurant_Location_Has VALUES ('R001', -123.130000, 49.290000, 'Vancouver', 'BC', '1234 Main St', 'V6A1A1', 'Cafe Delight', '123-456-7890', 4.50);
INSERT INTO Restaurant_Location_Has VALUES ('R002', -122.429400, 37.784900, 'San Francisco', 'CA', '5678 Market St', '94103', 'The Diner', '987-654-3210', 3.80);
INSERT INTO Restaurant_Location_Has VALUES ('R006', -123.248266, 49.261233, 'Vancouver', 'BC', '6138 Student Union Blvd', 'V6T1Z4', 'The Point Grill', '604-822-2334', 4.35);
INSERT INTO Restaurant_Location_Has VALUES ('R007', -123.252471, 49.266564, 'Vancouver', 'BC', '2021 West Mall', 'V6T1Z4', 'Pacific Poke', '604-822-5678', 4.20);
INSERT INTO Restaurant_Location_Has VALUES ('R008', -123.255589, 49.269235, 'Vancouver', 'BC', '6255 Crescent Road', 'V6T1Z4', 'Gallery 2 Go', '604-822-3456', 4.00);
INSERT INTO Restaurant_Location_Has VALUES ('R009', -123.251791, 49.262884, 'Vancouver', 'BC', '2055 Lower Mall', 'V6T1Z4', 'Mercante', '604-822-4567', 4.50);
INSERT INTO Restaurant_Location_Has VALUES ('R010', -123.253154, 49.267726, 'Vancouver', 'BC', '6133 University Blvd', 'V6T1Z4', 'Tim Hortons', '604-822-6789', 3.90);
INSERT INTO Restaurant_Location_Has VALUES ('R011', -123.250050, 49.267470, 'Vancouver', 'BC', '6137 Student Union Blvd', 'V6T1Z4', 'Starbucks', '604-822-8036', 2.40);
INSERT INTO Restaurant_Location_Has VALUES ('R011', -123.250510, 49.265480, 'Vancouver', 'BC', '6200 University Blvd', 'V6T1Z3', 'Starbucks', '604-822-0552', 2.80);
INSERT INTO Restaurant_Location_Has VALUES ('R011', -123.250070, 49.262160, 'Vancouver', 'BC', '2332 Main Mall', 'V6T1Z4', 'Starbucks', '604-827-5779', 3.50);
INSERT INTO Restaurant_Location_Has VALUES ('R011', -123.246559, 49.261271, 'Vancouver', 'BC', '6190 Agronomy Rd', 'V6T1L9', 'Starbucks', '604-221-6434', 4.00);

INSERT INTO Review_For_Makes VALUES ('1', 'Great food!', 5, DATE '2024-10-30', TIMESTAMP '2024-10-30 13:30:00', 'jdoe', -123.130000, 49.290000);
INSERT INTO Review_For_Makes VALUES ('2', 'Average service.', 3, DATE '2024-10-31', TIMESTAMP '2024-10-31 18:00:00', 'esmith', -123.130000, 49.290000);
INSERT INTO Review_For_Makes VALUES ('3', 'A rat was cooking my food! Is that even allowed :(', 0, DATE '2024-11-01', TIMESTAMP '2024-11-01 19:00:02', 'oreo', -122.429400, 37.784900);
INSERT INTO Review_For_Makes VALUES ('4', 'Fantastic ambiance and great food!', 5, DATE '2024-11-02', TIMESTAMP '2024-11-02 12:15:00', 'hesoru', -123.248266, 49.261233);
INSERT INTO Review_For_Makes VALUES ('5', 'Fresh ingredients, but portions were small.', 3, DATE '2024-11-03', TIMESTAMP '2024-11-03 14:00:00', 'hedie', -123.252471, 49.266564);
INSERT INTO Review_For_Makes VALUES ('6', 'Friendly staff, but the coffee was too bitter.', 2, DATE '2024-11-04', TIMESTAMP '2024-11-04 09:30:00', 'oreo', -123.255589, 49.269235);
INSERT INTO Review_For_Makes VALUES ('7', 'Loved the pizza, will definitely come back!', 5, DATE '2024-11-05', TIMESTAMP '2024-11-05 18:45:00', 'alovelace', -123.251791, 49.262884);
INSERT INTO Review_For_Makes VALUES ('8', 'The matcha was soooo yummy!', 5, DATE '2024-11-06', TIMESTAMP '2024-11-06 08:20:00', 'hedie', -123.250050, 49.267470);
INSERT INTO Review_For_Makes VALUES ('9', 'Sometimes the salmon is a little chewy', 3, DATE '2024-11-07', TIMESTAMP '2024-11-07 17:30:00', 'hedie', -123.252471, 49.266564);
INSERT INTO Review_For_Makes VALUES ('10', 'I got the hamburger Spongebob gave the health inspector', 0, DATE '2024-11-10', TIMESTAMP '2024-11-10 17:36:00', 'hedie', -122.429400, 37.784900);
INSERT INTO Review_For_Makes VALUES ('11', 'Pizza can be soggy', 3, DATE '2024-11-08', TIMESTAMP '2024-11-08 18:10:00', 'jdoe', -123.251791, 49.262884);
INSERT INTO Review_For_Makes VALUES ('12', 'Lots of waiting but sandwiches are worth it', 4, DATE '2024-11-09', TIMESTAMP '2024-11-09 12:10:00', 'jdoe', -123.253154, 49.267726);
INSERT INTO Review_For_Makes VALUES ('13', 'My sandwich was ice cold!!! >:(', 1, DATE '2024-11-11', TIMESTAMP '2024-11-11 09:39:00', 'jdoe', -123.246559, 49.261271);


INSERT INTO Distance_From VALUES (-123.120730, 49.282735, -123.255589, 49.269235, 9.9);
INSERT INTO Distance_From VALUES (-122.4194, 37.7749, -123.253154, 49.267726, 1279.7);
INSERT INTO Distance_From VALUES (-123.120730, 49.282735, -123.248266, 49.261233, 9.5);
INSERT INTO Distance_From VALUES (-123.120744, 49.282740, -123.252471, 49.266564, 9.7);
INSERT INTO Distance_From VALUES (-123.120739, 49.282728, -123.250510, 49.265480, 9.6);

INSERT INTO Menu_Serves VALUES ('M001', 'Lunch', 49.290000, -123.130000);
INSERT INTO Menu_Serves VALUES ('M002', 'Appetizer', 49.290000, -123.130000);
INSERT INTO Menu_Serves VALUES ('M003', 'Snack', 49.262884, -123.251791);
INSERT INTO Menu_Serves VALUES ('M004', 'Breakfast', 49.266564, -123.252471);
INSERT INTO Menu_Serves VALUES ('M005', 'Beverage', 49.269235, -123.255589);
INSERT INTO Menu_Serves VALUES ('M006', 'Main Course', 49.261233, -123.248266);
INSERT INTO Menu_Serves VALUES ('M007', 'Appetizer', 49.269235, -123.255589); 


INSERT INTO Menu_Item_On VALUES ('Seafood Special', 'M003', 'A pizza with pesto, shrimp, scallops, and fresh mozarella', 'Main Course', 19.95);
INSERT INTO Menu_Item_On VALUES ('Soju', 'M005', 'Delicious peach soju', 'Beverage', 8.99);
INSERT INTO Menu_Item_On VALUES ('Lemonade', 'M005', 'Refreshing glass of Lemonade', 'Beverage', 0.99);
INSERT INTO Menu_Item_On VALUES ('Burger', 'M001', 'Beef burger with fries', 'Main Course', 12.99);
INSERT INTO Menu_Item_On VALUES ('Salad', 'M002', 'Fresh green salad', 'Appetizer', 8.99);
INSERT INTO Menu_Item_On VALUES ('Tortellini', 'M003', 'Cheese Tortellini with pesto', 'Main Course', 11.99);
INSERT INTO Menu_Item_On VALUES ('Lasagne Bolognese', 'M003', 'Spinach lasagna with bolognese bechamel sauce', 'Main Course', 12.99);
INSERT INTO Menu_Item_On VALUES ('Pesto Pollo', 'M003', 'Pesto pizza with artichokes, mushrooms', 'Main Course', 19.45);
INSERT INTO Menu_Item_On VALUES ('Margherita', 'M003', 'Margherita pizza', 'Main Course', 16.95);
INSERT INTO Menu_Item_On VALUES ('Prosciutto', 'M003', 'Prosciutto pizza with arugula, basil', 'Main Course', 17.95);
INSERT INTO Menu_Item_On VALUES ('Alla Salsiccia', 'M003', 'Pizza with pork sausage, basil oregano', 'Main Course', 17.95);
INSERT INTO Menu_Item_On VALUES ('Al Pesto', 'M003', 'A Pesto Pizza', 'Main Course', 17.95);
INSERT INTO Menu_Item_On VALUES ('Bianca', 'M003', 'Pizza with bocconcini, goat, mozzarella, romano, and gorgonzola cheese', 'Main Course', 17.95);
INSERT INTO Menu_Item_On VALUES ('Ortolana', 'M003', 'Pizza with sundried tomato, bocconcini, artichokes , arugula', 'Main Course', 16.95);
INSERT INTO Menu_Item_On VALUES ('Pesto Di Salame', 'M003', 'Pizza with pesto, pepperoni, olives, mozzarella cheese', 'Main Course', 17.95);
INSERT INTO Menu_Item_On VALUES ('Vegan Feature', 'M003', 'A vegan pizza with your choice of toppings (for an additional charge)', 'Main Course', 16.00);
INSERT INTO Menu_Item_On VALUES ('Classic Benny', 'M004', 'Classic eggs benedict on whole wheat english muffin', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Strawberry Pancakes', 'M004', 'Fluffy pancakes with strawberry compote', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Bacon', 'M004', 'Freshly cooked bacon', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Turkey Sausage', 'M004', 'Breakfast sausages', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('TMRW Patty', 'M004', 'Meat-free breakfast patty', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Scrambled Eggs', 'M004', 'Scrambled eggs with salt , pepper', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Hashbrowns', 'M004', 'Crispy potato hashbrowns', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Wilted Spinach', 'M004', 'Cooked spinach seasoned with salt , pepper', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Roasted Tomatoes', 'M004', 'Roasted tomatoes seasoned with salt , pepper', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Just Egg Omlette', 'M004', 'Egg-substitute omelette with parsley', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Shiitake Mozza Omelette', 'M004', 'Omelette with shiitake mushrooms, mozzarella cheese, , parsley', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Overnight Oats Tiramisu', 'M004', 'Overnight oats with cocoa powder , greek yogurt', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Oatmeal', 'M004', 'Plain and simple oatmeal', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Congee Chicken', 'M004', 'Hearty congee with chicken', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Vanilla Yogurt', 'M004', 'Vanilla Yogurt', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Strawberry Yogurt', 'M004', 'Plain yogurt with strawberry puree', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Plant Based Yogurt', 'M004', 'Plant based yogurt made of coconut cream', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Granola', 'M004', 'Granola made with coconut chips, raisins, nuts, seeds, and dried fruits', 'Breakfast', NULL);
INSERT INTO Menu_Item_On VALUES ('Espresso', 'M005', 'A single or double shot of espresso', 'Beverage', 2.5);
INSERT INTO Menu_Item_On VALUES ('Espresso Macchiato', 'M005', 'Espresso with a dollop of steamed milk', 'Beverage', 2.75);
INSERT INTO Menu_Item_On VALUES ('Americano', 'M005', 'Espresso with hot water', 'Beverage', 3.5);
INSERT INTO Menu_Item_On VALUES ('Latte', 'M005', 'Espresso with steamed milk', 'Beverage', 4.5);
INSERT INTO Menu_Item_On VALUES ('Cappuccino', 'M005', 'Espresso with steamed and foamed milk', 'Beverage', 4.25);
INSERT INTO Menu_Item_On VALUES ('Flat White', 'M005', 'Espresso with steamed milk and microfoam', 'Beverage', 4.75);
INSERT INTO Menu_Item_On VALUES ('Caramel Macchiato', 'M005', 'Espresso with steamed milk and caramel drizzle', 'Beverage', 5);
INSERT INTO Menu_Item_On VALUES ('Mocha', 'M005', 'Espresso with steamed milk and chocolate syrup', 'Beverage', 5.25);
INSERT INTO Menu_Item_On VALUES ('White Chocolate Mocha', 'M005', 'Espresso with steamed milk and white chocolate', 'Beverage', 5.5);
INSERT INTO Menu_Item_On VALUES ('Vanilla Latte', 'M005', 'Espresso with steamed milk and vanilla syrup', 'Beverage', 4.95);
INSERT INTO Menu_Item_On VALUES ('Iced Coffee', 'M005', 'Chilled coffee served over ice', 'Beverage', 3.75);
INSERT INTO Menu_Item_On VALUES ('Cold Brew Coffee', 'M005', 'Slow-steeped coffee served cold', 'Beverage', 4);
INSERT INTO Menu_Item_On VALUES ('Vanilla Sweet Cream Cold Brew', 'M005', 'Cold brew with vanilla sweet cream', 'Beverage', 4.75);
INSERT INTO Menu_Item_On VALUES ('Nitro Cold Brew', 'M005', 'Nitro-infused cold brew coffee', 'Beverage', 4.95);
INSERT INTO Menu_Item_On VALUES ('Nitro Cold Brew with Sweet Cream', 'M005', 'Nitro cold brew with vanilla sweet cream', 'Beverage', 5.25);
INSERT INTO Menu_Item_On VALUES ('Pumpkin Cream Cold Brew', 'M005', 'Cold brew with pumpkin spice cold foam (seasonal)', 'Beverage', 5.25);
INSERT INTO Menu_Item_On VALUES ('Frappuccino® Blended Beverage', 'M005', 'Blended coffee drink with ice, milk, and flavors', 'Beverage', 5.5);
INSERT INTO Menu_Item_On VALUES ('Caramel Frappuccino', 'M005', 'Blended coffee with caramel flavor', 'Beverage', 5.5);
INSERT INTO Menu_Item_On VALUES ('Mocha Frappuccino', 'M005', 'Blended coffee with chocolate flavor', 'Beverage', 5.5);
INSERT INTO Menu_Item_On VALUES ('Java Chip Frappuccino', 'M005', 'Blended coffee with chocolate chips', 'Beverage', 5.75);
INSERT INTO Menu_Item_On VALUES ('Strawberry Crème Frappuccino', 'M005', 'Blended crème with strawberry flavor', 'Beverage', 5.5);
INSERT INTO Menu_Item_On VALUES ('Matcha Green Tea Frappuccino', 'M005', 'Blended crème with matcha green tea', 'Beverage', 5.5);
INSERT INTO Menu_Item_On VALUES ('Chai Tea Latte', 'M005', 'Spiced black tea with steamed milk', 'Beverage', 4.25);
INSERT INTO Menu_Item_On VALUES ('Matcha Green Tea Latte', 'M005', 'Matcha green tea with steamed milk', 'Beverage', 4.5);
INSERT INTO Menu_Item_On VALUES ('London Fog Tea Latte', 'M005', 'Earl grey tea with steamed milk and vanilla', 'Beverage', 4.5);
INSERT INTO Menu_Item_On VALUES ('Honey Citrus Mint Tea', 'M005', 'Green tea with citrus and honey', 'Beverage', 4);
INSERT INTO Menu_Item_On VALUES ('Peach Tranquility Tea', 'M005', 'Herbal peach-flavored tea', 'Beverage', 3.5);
INSERT INTO Menu_Item_On VALUES ('Strawberry Açaí Refresher', 'M005', 'Strawberry-flavored drink with green coffee extract', 'Beverage', 4.5);
INSERT INTO Menu_Item_On VALUES ('Mango Dragonfruit Refresher', 'M005', 'Mango and dragonfruit flavored drink', 'Beverage', 4.5);
INSERT INTO Menu_Item_On VALUES ('Pink Drink', 'M005', 'Strawberry Açaí Refresher with coconut milk', 'Beverage', 4.75);
INSERT INTO Menu_Item_On VALUES ('Dragon Drink', 'M005', 'Mango Dragonfruit Refresher with coconut milk', 'Beverage', 4.75);
INSERT INTO Menu_Item_On VALUES ('Kiwi Starfruit Refresher', 'M005', 'Kiwi and starfruit flavored drink', 'Beverage', 4.5);
INSERT INTO Menu_Item_On VALUES ('Hot Chocolate', 'M005', 'Steamed milk with chocolate syrup and whipped cream', 'Beverage', 4);
INSERT INTO Menu_Item_On VALUES ('White Hot Chocolate', 'M005', 'Steamed milk with white chocolate syrup and whipped cream', 'Beverage', 4.25);
INSERT INTO Menu_Item_On VALUES ('Pumpkin Spice Latte', 'M005', 'Espresso with steamed milk and pumpkin spice flavor (seasonal)', 'Beverage', 5.25);
INSERT INTO Menu_Item_On VALUES ('Peppermint Mocha', 'M005', 'Mocha with peppermint flavor (seasonal)', 'Beverage', 5.25);
INSERT INTO Menu_Item_On VALUES ('Bacon, Gouda , Egg Sandwich', 'M005', 'Bacon, gouda cheese, and egg on an artisan roll', 'Breakfast', 4.75);
INSERT INTO Menu_Item_On VALUES ('Sausage, Cheddar , Egg Sandwich', 'M005', 'Sausage patty, cheddar, and egg on an English muffin', 'Breakfast', 4.45);
INSERT INTO Menu_Item_On VALUES ('Spinach, Feta , Egg White Wrap', 'M005', 'Egg whites, spinach, and feta in a whole wheat wrap', 'Breakfast', 4.95);
INSERT INTO Menu_Item_On VALUES ('Impossible™ Breakfast Sandwich', 'M005', 'Plant-based sausage with egg and cheese on English muffin', 'Breakfast', 5.95);
INSERT INTO Menu_Item_On VALUES ('Avocado Spread', 'M005', 'Creamy avocado spread with spices', 'Snack', 1.25);
INSERT INTO Menu_Item_On VALUES ('Egg Bites', 'M005', 'Sous vide egg bites with cheese and optional bacon or veggie', 'Snack', 4.95);
INSERT INTO Menu_Item_On VALUES ('Classic Oatmeal', 'M005', 'Hearty oatmeal with optional nuts, fruit, or brown sugar', 'Breakfast', 3.25);
INSERT INTO Menu_Item_On VALUES ('Hearty Blueberry Oatmeal', 'M005', 'Oatmeal topped with blueberries and nuts', 'Breakfast', 3.75);
INSERT INTO Menu_Item_On VALUES ('Butter Croissant', 'M005', 'Flaky, buttery croissant', 'Bakery', 3.5);
INSERT INTO Menu_Item_On VALUES ('Chocolate Croissant', 'M005', 'Buttery croissant filled with chocolate', 'Bakery', 3.75);
INSERT INTO Menu_Item_On VALUES ('Blueberry Muffin', 'M005', 'Soft muffin filled with blueberries', 'Bakery', 3.25);
INSERT INTO Menu_Item_On VALUES ('Banana Nut Loaf', 'M005', 'Banana bread loaf with nuts', 'Bakery', 3.25);
INSERT INTO Menu_Item_On VALUES ('Pumpkin Loaf', 'M005', 'Spiced pumpkin loaf (seasonal)', 'Bakery', 3.45);
INSERT INTO Menu_Item_On VALUES ('Tomato , Mozzarella on Focaccia', 'M005', 'Sandwich with tomato, mozzarella, and basil pesto on focaccia', 'Lunch', 6.25);
INSERT INTO Menu_Item_On VALUES ('Turkey , Pesto Panini', 'M005', 'Roasted turkey with pesto and cheese on ciabatta', 'Lunch', 6.75);
INSERT INTO Menu_Item_On VALUES ('Plain Bagel', 'M005', 'Simple, plain bagel', 'Bakery', 2.25);
INSERT INTO Menu_Item_On VALUES ('Everything Bagel', 'M005', 'Bagel topped with everything seasoning', 'Bakery', 2.5);
INSERT INTO Menu_Item_On VALUES ('Lemon Loaf', 'M005', 'Moist loaf with lemon flavor and icing', 'Bakery', 3.45);
INSERT INTO Menu_Item_On VALUES ('Chocolate Chip Cookie', 'M005', 'Large cookie with chocolate chips', 'Bakery', 2.95);
INSERT INTO Menu_Item_On VALUES ('Protein Box (Eggs , Cheese)', 'M005', 'Hard-boiled eggs, cheese, apples, and peanut butter', 'Snack', 5.75);
INSERT INTO Menu_Item_On VALUES ('Greek Yogurt Parfait', 'M005', 'Greek yogurt with berries and granola', 'Snack', 3.95);
INSERT INTO Menu_Item_On VALUES ('Granola Bar', 'M005', 'A bar with oats, nuts, and dried fruits', 'Snack', 2.5);

INSERT INTO Diet VALUES ('Vegetarian');
INSERT INTO Diet VALUES ('Vegan');
INSERT INTO Diet VALUES ('Kosher');
INSERT INTO Diet VALUES ('Halal');
INSERT INTO Diet VALUES ('Pescatarian');

INSERT INTO Allergen VALUES ('Soy');
INSERT INTO Allergen VALUES ('Egg');
INSERT INTO Allergen VALUES ('Gluten');
INSERT INTO Allergen VALUES ('Nuts');
INSERT INTO Allergen VALUES ('Dairy');
INSERT INTO Allergen VALUES ('Shellfish');
INSERT INTO Allergen VALUES ('Alcohol');
INSERT INTO Allergen VALUES ('Chickpeas');

INSERT INTO Contains_Diet VALUES ('Vegan', 'Salad', 'M002');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Tortellini', 'M003');
INSERT INTO Contains_Diet VALUES ('Halal', 'Pesto Pollo', 'M003');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Margherita', 'M003');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Bianca', 'M003');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Ortolana', 'M003');
INSERT INTO Contains_Diet VALUES ('Vegan', 'Vegan Feature', 'M003');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Classic Benny', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Strawberry Pancakes', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'TMRW Patty', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegan', 'TMRW Patty', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Scrambled Eggs', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Hashbrowns', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegan', 'Hashbrowns', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Wilted Spinach', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegan', 'Wilted Spinach', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Roasted Tomatoes', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegan', 'Roasted Tomatoes', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Just Egg Omlette', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegan', 'Just Egg Omlette', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Shiitake Mozza Omelette', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Overnight Oats Tiramisu', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Oatmeal', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegan', 'Oatmeal', 'M004');
INSERT INTO Contains_Diet VALUES ('Halal', 'Congee Chicken', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Vanilla Yogurt', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Strawberry Yogurt', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Plant Based Yogurt', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegan', 'Plant Based Yogurt', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Granola', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegan', 'Granola', 'M004');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Latte', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Caramel Macchiato', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Americano', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Espresso', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Flat White', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Mocha', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'White Chocolate Mocha', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Iced Coffee', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Cold Brew Coffee', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Vanilla Sweet Cream Cold Brew', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Nitro Cold Brew', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Nitro Cold Brew with Sweet Cream', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Pumpkin Cream Cold Brew', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Frappuccino® Blended Beverage', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Caramel Frappuccino', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Mocha Frappuccino', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Java Chip Frappuccino', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Dragon Drink', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Strawberry Açaí Refresher', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Mango Dragonfruit Refresher', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Pink Drink', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Matcha Green Tea Latte', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Chai Tea Latte', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Hot Chocolate', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'White Hot Chocolate', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Pumpkin Spice Latte', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Peppermint Mocha', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Bacon, Gouda , Egg Sandwich', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Sausage, Cheddar , Egg Sandwich', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Impossible™ Breakfast Sandwich', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegan', 'Impossible™ Breakfast Sandwich', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Avocado Spread', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegan', 'Avocado Spread', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Egg Bites', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Classic Oatmeal', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegan', 'Classic Oatmeal', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Butter Croissant', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Chocolate Croissant', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Blueberry Muffin', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Banana Nut Loaf', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Pumpkin Loaf', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Tomato , Mozzarella on Focaccia', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Turkey , Pesto Panini', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Plain Bagel', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Everything Bagel', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Lemon Loaf', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Chocolate Chip Cookie', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Protein Box (Eggs , Cheese)', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Greek Yogurt Parfait', 'M005');
INSERT INTO Contains_Diet VALUES ('Vegetarian', 'Granola Bar', 'M005');

INSERT INTO Contains_Allergen VALUES ('Dairy', 'Seafood Special', 'M003');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Seafood Special', 'M003');
INSERT INTO Contains_Allergen VALUES ('Nuts', 'Seafood Special', 'M003');
INSERT INTO Contains_Allergen VALUES ('Shellfish', 'Seafood Special', 'M003');
INSERT INTO Contains_Allergen VALUES ('Alcohol', 'Soju', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Burger', 'M001');
INSERT INTO Contains_Allergen VALUES ('Nuts', 'Tortellini', 'M003');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Tortellini', 'M003');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Tortellini', 'M003');
INSERT INTO Contains_Allergen VALUES ('Egg', 'Tortellini', 'M003');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Lasagne Bolognese', 'M003');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Lasagne Bolognese', 'M003');
INSERT INTO Contains_Allergen VALUES ('Egg', 'Lasagne Bolognese', 'M003');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Pesto Pollo', 'M003');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Pesto Pollo', 'M003');
INSERT INTO Contains_Allergen VALUES ('Nuts', 'Pesto Pollo', 'M003');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Margherita', 'M003');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Margherita', 'M003');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Prosciutto', 'M003');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Prosciutto', 'M003');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Alla Salsiccia', 'M003');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Alla Salsiccia', 'M003');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Al Pesto', 'M003');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Al Pesto', 'M003');
INSERT INTO Contains_Allergen VALUES ('Nuts', 'Al Pesto', 'M003');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Bianca', 'M003');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Bianca', 'M003');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Ortolana', 'M003');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Ortolana', 'M003');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Pesto Di Salame', 'M003');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Pesto Di Salame', 'M003');
INSERT INTO Contains_Allergen VALUES ('Nuts', 'Pesto Di Salame', 'M003');
INSERT INTO Contains_Allergen VALUES ('Egg', 'Classic Benny', 'M004');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Classic Benny', 'M004');
INSERT INTO Contains_Allergen VALUES ('Soy', 'Classic Benny', 'M004');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Classic Benny', 'M004');
INSERT INTO Contains_Allergen VALUES ('Egg', 'Strawberry Pancakes', 'M004');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Strawberry Pancakes', 'M004');
INSERT INTO Contains_Allergen VALUES ('Soy', 'Strawberry Pancakes', 'M004');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Strawberry Pancakes', 'M004');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'TMRW Patty', 'M004');
INSERT INTO Contains_Allergen VALUES ('Egg', 'Scrambled Eggs', 'M004');
INSERT INTO Contains_Allergen VALUES ('Soy', 'Hashbrowns', 'M004');
INSERT INTO Contains_Allergen VALUES ('Soy', 'Just Egg Omlette', 'M004');
INSERT INTO Contains_Allergen VALUES ('Egg', 'Shiitake Mozza Omelette', 'M004');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Shiitake Mozza Omelette', 'M004');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Overnight Oats Tiramisu', 'M004');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Overnight Oats Tiramisu', 'M004');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Oatmeal', 'M004');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Vanilla Yogurt', 'M004');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Strawberry Yogurt', 'M004');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Granola', 'M004');
INSERT INTO Contains_Allergen VALUES ('Nuts', 'Granola', 'M004');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Latte', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Caramel Macchiato', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Flat White', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Mocha', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'White Chocolate Mocha', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Vanilla Sweet Cream Cold Brew', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Nitro Cold Brew with Sweet Cream', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Pumpkin Cream Cold Brew', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Frappuccino® Blended Beverage', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Caramel Frappuccino', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Mocha Frappuccino', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Java Chip Frappuccino', 'M005');
INSERT INTO Contains_Allergen VALUES ('Soy', 'Dragon Drink', 'M005');
INSERT INTO Contains_Allergen VALUES ('Soy', 'Pink Drink', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Matcha Green Tea Latte', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Chai Tea Latte', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Hot Chocolate', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'White Hot Chocolate', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Pumpkin Spice Latte', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Peppermint Mocha', 'M005');
INSERT INTO Contains_Allergen VALUES ('Egg', 'Bacon, Gouda , Egg Sandwich', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Bacon, Gouda , Egg Sandwich', 'M005');
INSERT INTO Contains_Allergen VALUES ('Egg', 'Sausage, Cheddar , Egg Sandwich', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Sausage, Cheddar , Egg Sandwich', 'M005');
INSERT INTO Contains_Allergen VALUES ('Soy', 'Impossible™ Breakfast Sandwich', 'M005');
INSERT INTO Contains_Allergen VALUES ('Egg', 'Impossible™ Breakfast Sandwich', 'M005');
INSERT INTO Contains_Allergen VALUES ('Egg', 'Egg Bites', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Egg Bites', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Hearty Blueberry Oatmeal', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Butter Croissant', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Butter Croissant', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Chocolate Croissant', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Chocolate Croissant', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Blueberry Muffin', 'M005');
INSERT INTO Contains_Allergen VALUES ('Nuts', 'Banana Nut Loaf', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Banana Nut Loaf', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Pumpkin Loaf', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Tomato , Mozzarella on Focaccia', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Tomato , Mozzarella on Focaccia', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Turkey , Pesto Panini', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Plain Bagel', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Everything Bagel', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Lemon Loaf', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Lemon Loaf', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Chocolate Chip Cookie', 'M005');
INSERT INTO Contains_Allergen VALUES ('Egg', 'Protein Box (Eggs , Cheese)', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Protein Box (Eggs , Cheese)', 'M005');
INSERT INTO Contains_Allergen VALUES ('Gluten', 'Protein Box (Eggs , Cheese)', 'M005');
INSERT INTO Contains_Allergen VALUES ('Dairy', 'Greek Yogurt Parfait', 'M005');
INSERT INTO Contains_Allergen VALUES ('Nuts', 'Granola Bar', 'M005');

INSERT INTO Dietary_Profile_Can_Save VALUES ('Hedies_Profile', 'hedie');
INSERT INTO Dietary_Profile_Can_Save VALUES ('Helenas_Profile', 'hesoru');
INSERT INTO Dietary_Profile_Can_Save VALUES ('Vegetables_Only', 'jsmith');
INSERT INTO Dietary_Profile_Can_Save VALUES ('Halal_Friends', 'hedie');
INSERT INTO Dietary_Profile_Can_Save VALUES ('Vegan_Vibes', 'alovelace');
INSERT INTO Dietary_Profile_Can_Save VALUES ('Kosher_Options', 'oreo');

INSERT INTO Stores_Allergen VALUES ('Hedies_Profile', 'hedie', 'Nuts');
INSERT INTO Stores_Allergen VALUES ('Hedies_Profile', 'hedie', 'Shellfish');
INSERT INTO Stores_Allergen VALUES ('Hedies_Profile', 'hedie', 'Chickpeas');
INSERT INTO Stores_Allergen Values ('Halal_Friends', 'hedie', 'Alcohol');
INSERT INTO Stores_Allergen VALUES ('Helenas_Profile', 'hesoru', 'Gluten');
INSERT INTO Stores_Allergen VALUES ('Helenas_Profile', 'hesoru', 'Soy');
INSERT INTO Stores_Allergen VALUES ('Helenas_Profile', 'hesoru', 'Dairy');
INSERT INTO Stores_Allergen VALUES ('Vegetables_Only', 'jsmith', 'Gluten');


INSERT INTO Stores_Diet VALUES ('Vegetables_Only', 'jsmith', 'Vegetarian');
INSERT INTO Stores_Diet VALUES ('Vegan_Vibes', 'alovelace', 'Vegan');
INSERT INTO Stores_Diet VALUES ('Halal_Friends', 'hedie', 'Halal');
INSERT INTO Stores_Diet VALUES ('Kosher_Options', 'oreo', 'Kosher');
INSERT INTO Stores_Diet VALUES ('Helenas_Profile', 'hesoru', 'Vegan');


