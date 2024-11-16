DROP TABLE User_Has CASCADE CONSTRAINTS;
DROP TABLE User_Location CASCADE CONSTRAINTS;
DROP TABLE Review_For_Makes CASCADE CONSTRAINTS;
DROP TABLE Restaurant_Location_Has CASCADE CONSTRAINTS;
DROP TABLE Distance_From CASCADE CONSTRAINTS;
DROP TABLE Restaurant CASCADE CONSTRAINTS;
DROP TABLE Menu_Serves CASCADE CONSTRAINTS;
DROP TABLE Menu_Item_On CASCADE CONSTRAINTS;
DROP TABLE Contains CASCADE CONSTRAINTS;
DROP TABLE Allergen CASCADE CONSTRAINTS;
DROP TABLE Diet CASCADE CONSTRAINTS;
DROP TABLE Stores CASCADE CONSTRAINTS;
DROP TABLE Dietary_Profile_Can_Save CASCADE CONSTRAINTS;

CREATE TABLE User_Location (
    Longitude decimal(9, 6),
    Latitude decimal(9, 6),
    Record_Date DATE,
    Record_Time TIMESTAMP,
    PRIMARY KEY (Longitude, Latitude)
);

CREATE TABLE User_Has (
    Username VARCHAR(30) PRIMARY KEY,
    First_Name VARCHAR(30), 
    Last_Name VARCHAR(30),
    Email VARCHAR(30) NOT NULL UNIQUE,
    User_Longitude decimal(9, 6) NOT NULL,
    User_Latitude decimal(9, 6) NOT NULL,
    FOREIGN KEY (User_Longitude, User_Latitude) REFERENCES User_Location(Longitude, Latitude)
    ON DELETE CASCADE,
    ON UPDATE CASCADE
);

CREATE TABLE Restaurant (
    Id VARCHAR(30) PRIMARY KEY,
    Cuisine_Type VARCHAR(30),
    Name VARCHAR(30),
    Average_Price INT UNSIGNED
);

CREATE TABLE Restaurant_Location_Has (
    Longitude DECIMAL(9, 6),
    Latitude DECIMAL(9, 6),
    City VARCHAR(30),
    Province_or_State VARCHAR(30),
    Street_Address VARCHAR(50) NOT NULL UNIQUE,
    Postal_Code CHAR(6),
    Restaurant_Id VARCHAR(30),
    Location_Name VARCHAR(30),
    Phone_Number VARCHAR(15) UNIQUE,
    Average_Rating DECIMAL(3, 2) CHECK (Average_Rating BETWEEN 0 AND 5),
    PRIMARY KEY (Longitude, Latitude),
    FOREIGN KEY (Restaurant_Id) REFERENCES Restaurant(Id)
);

CREATE TABLE Review_For_Makes (
    Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Content VARCHAR(200) NOT NULL,
    Rating INT UNSIGNED CHECK (Rating BETWEEN 0 AND 5),
    Record_Date DATE,
    Record_Time TIMESTAMP,
    Username VARCHAR(30) NOT NULL,
    Restaurant_Longitude DECIMAL(9, 6),
    Restaurant_Latitude DECIMAL(9, 6),
    FOREIGN KEY (Username) REFERENCES User_Has(Username),
    FOREIGN KEY (Restaurant_Longitude, Restaurant_Latitude)
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
    Id VARCHAR(30) PRIMARY KEY,
    Type VARCHAR(30),
    Restaurant_Latitude DECIMAL(9, 6) NOT NULL,
    Restaurant_Longitude DECIMAL(9, 6) NOT NULL,
    FOREIGN KEY (Restaurant_Latitude, Restaurant_Longitude)
        REFERENCES Restaurant_Location_Has(Latitude, Longitude)
);

CREATE TABLE Menu_Item_On (
    Name VARCHAR(30),
    Menu_Id VARCHAR(30) NOT NULL,
    Description VARCHAR(100),
    Type VARCHAR(30),
    Price DECIMAL(9, 2),
    PRIMARY KEY (Name, Menu_Id),
    FOREIGN KEY (Menu_Id) REFERENCES Menu_Serves(Id)
);

CREATE TABLE Diet (
    Diet_Type VARCHAR(30) PRIMARY KEY
);

CREATE TABLE Allergen (
    Allergen_Type VARCHAR(30) PRIMARY KEY
);

CREATE TABLE Contains (
    Type VARCHAR(30),
    Menu_Item_Name VARCHAR(30),
    Menu_Id VARCHAR(30),
    PRIMARY KEY (Type, Menu_Item_Name, Menu_Id),
    FOREIGN KEY (Type) REFERENCES Diet(Diet_Type),
    FOREIGN KEY (Type) REFERENCES Allergen(Allergen_Type),
    FOREIGN KEY (Menu_Item_Name, Menu_Id) REFERENCES Menu_Item_On(Name, Menu_Id)
);

CREATE TABLE Stores (
    Dietary_Profile_Name CHAR(20),
    User_Username CHAR(20),
    Diet_Type VARCHAR(30),
    Allergen_Type VARCHAR(30),
    PRIMARY KEY (Dietary_Profile_Name, User_Username, Diet_Type, Allergen_Type),
    FOREIGN KEY (Diet_Type) REFERENCES Diet(Diet_Type),
    FOREIGN KEY (Allergen_Type) REFERENCES Allergen(Allergen_Type),
    FOREIGN KEY (User_Username) REFERENCES User_Has(Username)
);

CREATE TABLE Dietary_Profile_Can_Save (
    Name CHAR(20),
    Username CHAR(30) NOT NULL,
    PRIMARY KEY (Name, Username),
    FOREIGN KEY (Username) REFERENCES User_Has(Username)
);



INSERT INTO User_Has VALUES ('jdoe', 'John', 'Doe', 'jdoe@example.com', '-123.1207', '49.2827');
INSERT INTO User_Has VALUES ('esmith', 'Emma', 'Smith', 'esmith@example.com', '-122.4194', '37.7749');
INSERT INTO User_Has VALUES ('hesoru', 'Helena', 'Sokolovska', 'hesoru@gmail.com', '-123.120735', '49.28273');
INSERT INTO User_Has VALUES ('hedie', 'Hediyeh', 'Mahmoudian', 'hediemahmoudian@gmail.com', '-123.120744', '49.28274');
INSERT INTO User_Has VALUES ('oreo', 'Oreoluwa', 'Akinwunmi', 'oreakinwunmi@yahoo.com', '-123.12073', '49.282735');
INSERT INTO User_Has VALUES ('jsmith', 'Jane', 'Smith', 'jsmith@hotmail.com', '-123.120728', '49.282733');
INSERT INTO User_Has VALUES ('alovelace', 'Ada', 'Lovelace', 'alovelace@gmail.com', '-123.120739', '49.282728');


INSERT INTO User_Location VALUES ('-123.1207', '49.2827', '2024-10-30 00:00:00', '08:30:00');
INSERT INTO User_Location VALUES ('-122.4194', '37.7749', '2024-10-31 00:00:00', '15:45:00');
INSERT INTO User_Location VALUES ('-123.120735', '49.28273', '2024-11-01 00:00:00', '16:45:00');
INSERT INTO User_Location VALUES ('-123.120744', '49.28274', '2024-11-02 00:00:00', '17:45:00');
INSERT INTO User_Location VALUES ('-123.12073', '49.282735', '2024-11-03 00:00:00', '18:45:00');
INSERT INTO User_Location VALUES ('-123.120728', '49.282733', '2024-11-04 00:00:00', '19:45:00');
INSERT INTO User_Location VALUES ('-123.120739', '49.282728', '2024-11-05 00:00:00', '20:45:00');


INSERT INTO Review_For_Makes VALUES ('1', 'Great food!', '5', '2024-10-30 00:00:00', '13:30:00', 'jdoe', '-123.13', '49.29');
INSERT INTO Review_For_Makes VALUES ('2', 'Average service. ', '3', '2024-10-31 00:00:00', '18:00:00', 'esmith', '-123.13', '49.29');
INSERT INTO Review_For_Makes VALUES ('3', 'A rat was cooking my food! Is that even allowed :(', '0', '2024-11-01 00:00:00', '19:00:02', 'oreo', '-122.4294', '37.7849');
INSERT INTO Review_For_Makes VALUES ('4', 'Fantastic ambiance and great food!', '5', '2024-11-02 00:00:00', '12:15:00', 'hesoru', '-123.248266', '49.261233');
INSERT INTO Review_For_Makes VALUES ('5', 'Fresh ingredients, but portions were small.', '3', '2024-11-03 00:00:00', '14:00:00', 'hedie', '-123.252471', '49.266564');
INSERT INTO Review_For_Makes VALUES ('6', 'Friendly staff, but the coffee was too bitter.', '2', '2024-11-04 00:00:00', '09:30:00', 'oreo', '-123.255589', '49.269235');
INSERT INTO Review_For_Makes VALUES ('7', 'Loved the pizza, will definitely come back!', '5', '2024-11-05 00:00:00', '18:45:00', 'alovelace', '-123.251791', '49.262884');

INSERT INTO Restaurant_Location_Has VALUES ('R001', '-123.13', '49.29', 'Vancouver', 'BC', '1234 Main St', 'V6A1A1', 'Cafe Delight', '123-456-7890', '4.5');
INSERT INTO Restaurant_Location_Has VALUES ('R002', '-122.4294', '37.7849', 'San Francisco', 'CA', '5678 Market St', '94103', 'The Diner', '987-654-3210', '3.8');
INSERT INTO Restaurant_Location_Has VALUES ('R006', '-123.248266', '49.261233', 'Vancouver', 'BC', '6138 Student Union Blvd', 'V6T1Z4', 'The Point Grill', '604-822-2334', '4.35');
INSERT INTO Restaurant_Location_Has VALUES ('R007', '-123.252471', '49.266564', 'Vancouver', 'BC', '2021 West Mall', 'V6T1Z4', 'Pacific Poke', '604-822-5678', '4.2');
INSERT INTO Restaurant_Location_Has VALUES ('R008', '-123.255589', '49.269235', 'Vancouver', 'BC', '6255 Crescent Road', 'V6T1Z4', 'Gallery 2 Go', '604-822-3456', '4.0');
INSERT INTO Restaurant_Location_Has VALUES ('R009', '-123.251791', '49.262884', 'Vancouver', 'BC', '2055 Lower Mall', 'V6T1Z4', 'Mercante', '604-822-4567', '4.5');
INSERT INTO Restaurant_Location_Has VALUES ('R010', '-123.253154', '49.267726', 'Vancouver', 'BC', '6133 University Blvd', 'V6T1Z4', 'Tim Hortons', '604-822-6789', '3.9');
INSERT INTO Restaurant_Location_Has VALUES ('nan', 'nan', 'nan', 'Vancouver', 'BC', '6138 Student Union Blvd', 'V6T1Z4', 'Starbucks', '604-822-8036', '2.4');
INSERT INTO Restaurant_Location_Has VALUES ('nan', 'nan', 'nan', 'Vancouver', 'BC', '6200 University Blvd', 'V6T1Z3', 'Starbucks', '604-822-0552', '2.8');
INSERT INTO Restaurant_Location_Has VALUES ('nan', 'nan', 'nan', 'Vancouver', 'BC', '2332 Main Mall', 'V6T1Z4', 'Starbucks', '604-827-5779', '3.5');
INSERT INTO Restaurant_Location_Has VALUES ('nan', 'nan', 'nan', 'Vancouver', 'BC', '6190 Agronomy Rd', 'V6T 1L9', 'Starbucks', '604-221-6434', '4.0');


INSERT INTO Distance_From VALUES ('-123.12073', '49.282735', '-122.4294', '37.7849', '1.2');
INSERT INTO Distance_From VALUES ('-122.4194', '37.7749', '-123.253154', '49.267726', '1.5');


INSERT INTO Menu_Item_On VALUES ('Burger', 'M001', 'Beef burger with fries', 'Main Course', '12.99');
INSERT INTO Menu_Item_On VALUES ('Salad', 'M002', 'Fresh green salad', 'Appetizer', '8.99');
INSERT INTO Menu_Item_On VALUES ('Tortellini', 'M003', 'Cheese Tortellini with pesto', 'Main Course', '11.99');
INSERT INTO Menu_Item_On VALUES ('Lasagne Bolognese', 'M003', 'Spinach lasagna with bolognese & bechamel sauce', 'Main Course', '12.99');
INSERT INTO Menu_Item_On VALUES ('Pesto Pollo', 'M003', 'Pesto pizza with artichokes & mushrooms', 'Main Course', '19.45');
INSERT INTO Menu_Item_On VALUES ('Margherita', 'M003', 'Margherita pizza', 'Main Course', '16.95');
INSERT INTO Menu_Item_On VALUES ('Prosciutto', 'M003', 'Prosciutto pizza with arugula & basil', 'Main Course', '17.95');
INSERT INTO Menu_Item_On VALUES ('Alla Salsiccia', 'M003', 'Pizza with pork sausage, basil & oregano', 'Main Course', '17.95');
INSERT INTO Menu_Item_On VALUES ('Bianca', 'M003', 'Pizza with bocconcini, goat, mozzarella, romano, and gorgonzola cheese', 'Main Course', '17.95');
INSERT INTO Menu_Item_On VALUES ('Ortolana', 'M003', 'Pizza with sundried tomato, bocconcini, artichokes & arugula', 'Main Course', '16.95');
INSERT INTO Menu_Item_On VALUES ('Pesto Di Salame', 'M003', 'Pizza with pesto, pepperoni, olives & mozzarella cheese', 'Main Course', '17.95');
INSERT INTO Menu_Item_On VALUES ('Vegan Feature', 'M003', 'A vegan pizza with your choice of toppings (for an additional charge)', 'Main Course', '16.0');
INSERT INTO Menu_Item_On VALUES ('Classic Benny', 'M004', 'Classic eggs benedict on whole wheat english muffin', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Strawberry Pancakes', 'M004', 'Fluffy pancakes with strawberry compote', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Bacon', 'M004', 'Freshly cooked bacon', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Turkey Sausage', 'M004', 'Breakfast sausages', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('TMRW Patty', 'M004', 'Meat-free breakfast patty', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Scrambled Eggs', 'M004', 'Scrambled eggs with salt & pepper', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Hashbrowns', 'M004', 'Crispy potato hashbrowns', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Wilted Spinach', 'M004', 'Cooked spinach seasoned with salt & pepper', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Roasted Tomatoes', 'M004', 'Roasted tomatoes seasoned with salt & pepper', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Just Egg', 'M004', 'Egg-substitute omelette with parsley', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Shiitake Mozza Omelette', 'M004', 'Omelette with shiitake mushrooms, mozzarella cheese, & parsley', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Overnight Oats Tiramisu', 'M004', 'Overnight oats with cocoa powder & greek yogurt', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Oatmeal', 'M004', 'Plain and simple oatmeal', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Congee Chicken', 'M004', 'Hearty congee with chicken', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Vanilla Yogurt', 'M004', 'Vanilla Yogurt', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Strawberry Yogurt', 'M004', 'Plain yogurt with strawberry puree', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Plant Based Yogurt', 'M004', 'Plant based yogurt made of coconut cream', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Granola', 'M004', 'Granola made with coconut chips, raisins, nuts, seeds, and dried fruits', 'Breakfast', 'nan');
INSERT INTO Menu_Item_On VALUES ('Espresso', 'M005', 'A single or double shot of espresso', 'Beverage', '2.5');
INSERT INTO Menu_Item_On VALUES ('Espresso Macchiato', 'M005', 'Espresso with a dollop of steamed milk', 'Beverage', '2.75');
INSERT INTO Menu_Item_On VALUES ('Caffè Americano', 'M005', 'Espresso with hot water', 'Beverage', '3.5');
INSERT INTO Menu_Item_On VALUES ('Caffè Latte', 'M005', 'Espresso with steamed milk', 'Beverage', '4.5');
INSERT INTO Menu_Item_On VALUES ('Cappuccino', 'M005', 'Espresso with steamed and foamed milk', 'Beverage', '4.25');
INSERT INTO Menu_Item_On VALUES ('Flat White', 'M005', 'Espresso with steamed milk and microfoam', 'Beverage', '4.75');
INSERT INTO Menu_Item_On VALUES ('Caramel Macchiato', 'M005', 'Espresso with steamed milk and caramel drizzle', 'Beverage', '5.0');
INSERT INTO Menu_Item_On VALUES ('Mocha', 'M005', 'Espresso with steamed milk and chocolate syrup', 'Beverage', '5.25');
INSERT INTO Menu_Item_On VALUES ('White Chocolate Mocha', 'M005', 'Espresso with steamed milk and white chocolate', 'Beverage', '5.5');
INSERT INTO Menu_Item_On VALUES ('Vanilla Latte', 'M005', 'Espresso with steamed milk and vanilla syrup', 'Beverage', '4.95');
INSERT INTO Menu_Item_On VALUES ('Iced Coffee', 'M005', 'Chilled coffee served over ice', 'Beverage', '3.75');
INSERT INTO Menu_Item_On VALUES ('Cold Brew Coffee', 'M005', 'Slow-steeped coffee served cold', 'Beverage', '4.0');
INSERT INTO Menu_Item_On VALUES ('Vanilla Sweet Cream Cold Brew', 'M005', 'Cold brew with vanilla sweet cream', 'Beverage', '4.75');
INSERT INTO Menu_Item_On VALUES ('Nitro Cold Brew', 'M005', 'Nitro-infused cold brew coffee', 'Beverage', '4.95');

INSERT INTO Diet VALUES ('Vegetarian');
INSERT INTO Diet VALUES ('Vegan');
INSERT INTO Diet VALUES ('Kosher');
INSERT INTO Diet VALUES ('Halal');



INSERT INTO Allergen VALUES ('Soy');
INSERT INTO Allergen VALUES ('Egg');
INSERT INTO Allergen VALUES ('Gluten');
INSERT INTO Allergen VALUES ('Nuts');
INSERT INTO Allergen VALUES ('Egg');
INSERT INTO Allergen VALUES ('Dairy');
INSERT INTO Allergen VALUES ('Shellfish');
INSERT INTO Allergen VALUES ('Alcohol');
INSERT INTO Allergen VALUES ('Chickpeas');


INSERT INTO Contains VALUES ('Vegan', 'Salad', 'M002');
INSERT INTO Contains VALUES ('Gluten', 'Burger', 'M001');
INSERT INTO Contains VALUES ('Nuts', 'Tortellini', 'M003');
INSERT INTO Contains VALUES ('Dairy', 'Tortellini', 'M003');
INSERT INTO Contains VALUES ('Gluten', 'Tortellini', 'M003');
INSERT INTO Contains VALUES ('Egg', 'Tortellini', 'M003');
INSERT INTO Contains VALUES ('Vegetarian', 'Tortellini', 'M003');
INSERT INTO Contains VALUES ('Dairy', 'Lasagne Bolognese', 'M003');
INSERT INTO Contains VALUES ('Gluten', 'Lasagne Bolognese', 'M003');
INSERT INTO Contains VALUES ('Egg', 'Lasagne Bolognese', 'M003');
INSERT INTO Contains VALUES ('Gluten', 'Pesto Pollo', 'M003');
INSERT INTO Contains VALUES ('Dairy', 'Pesto Pollo', 'M003');
INSERT INTO Contains VALUES ('Nuts', 'Pesto Pollo', 'M003');
INSERT INTO Contains VALUES ('Halal', 'Pesto Pollo', 'M003');
INSERT INTO Contains VALUES ('Gluten', 'Margherita', 'M003');
INSERT INTO Contains VALUES ('Dairy', 'Margherita', 'M003');
INSERT INTO Contains VALUES ('Vegetarian', 'Margherita', 'M003');
INSERT INTO Contains VALUES ('Gluten', 'Prosciutto', 'M003');
INSERT INTO Contains VALUES ('Dairy', 'Prosciutto', 'M003');
INSERT INTO Contains VALUES ('Gluten', 'Alla Salsiccia', 'M003');
INSERT INTO Contains VALUES ('Dairy', 'Alla Salsiccia', 'M003');
INSERT INTO Contains VALUES ('Gluten', 'Al Pesto', 'M003');
INSERT INTO Contains VALUES ('Dairy', 'Al Pesto', 'M003');
INSERT INTO Contains VALUES ('Nuts', 'Al Pesto', 'M003');
INSERT INTO Contains VALUES ('Gluten', 'Bianca', 'M003');
INSERT INTO Contains VALUES ('Dairy', 'Bianca', 'M003');
INSERT INTO Contains VALUES ('Vegetarian', 'Bianca', 'M003');
INSERT INTO Contains VALUES ('Gluten', 'Ortolana', 'M003');
INSERT INTO Contains VALUES ('Dairy', 'Ortolana', 'M003');
INSERT INTO Contains VALUES ('Vegetarian', 'Ortolana', 'M003');
INSERT INTO Contains VALUES ('Gluten', 'Pesto Di Salame', 'M003');
INSERT INTO Contains VALUES ('Dairy', 'Pesto Di Salame', 'M003');
INSERT INTO Contains VALUES ('Nuts', 'Pesto Di Salame', 'M003');
INSERT INTO Contains VALUES ('Vegan', 'Vegan Feature', 'M003');
INSERT INTO Contains VALUES ('Egg', 'Classic Benny', 'M004');
INSERT INTO Contains VALUES ('Dairy', 'Classic Benny', 'M004');
INSERT INTO Contains VALUES ('Soy', 'Classic Benny', 'M004');
INSERT INTO Contains VALUES ('Gluten', 'Classic Benny', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Classic Benny', 'M004');
INSERT INTO Contains VALUES ('Egg', 'Strawberry Pancakes', 'M004');
INSERT INTO Contains VALUES ('Dairy', 'Strawberry Pancakes', 'M004');
INSERT INTO Contains VALUES ('Soy', 'Strawberry Pancakes', 'M004');
INSERT INTO Contains VALUES ('Gluten', 'Strawberry Pancakes', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Strawberry Pancakes', 'M004');
INSERT INTO Contains VALUES ('Gluten', 'TMRW Patty', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'TMRW Patty', 'M004');
INSERT INTO Contains VALUES ('Vegan', 'TMRW Patty', 'M004');
INSERT INTO Contains VALUES ('Egg', 'Scrambled Eggs', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Scrambled Eggs', 'M004');
INSERT INTO Contains VALUES ('Soy', 'Hashbrowns', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Hashbrowns', 'M004');
INSERT INTO Contains VALUES ('Vegan', 'Hashbrowns', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Wilted Spinach', 'M004');
INSERT INTO Contains VALUES ('Vegan', 'Wilted Spinach', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Roasted Tomatoes', 'M004');
INSERT INTO Contains VALUES ('Vegan', 'Roasted Tomatoes', 'M004');
INSERT INTO Contains VALUES ('Vegan', 'Roasted Tomatoes', 'M004');
INSERT INTO Contains VALUES ('Soy', 'Just Egg Omlette', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Just Egg Omlette', 'M004');
INSERT INTO Contains VALUES ('Vegan', 'Just Egg Omlette', 'M004');
INSERT INTO Contains VALUES ('Egg', 'Shiitake Mozza Omelette', 'M004');
INSERT INTO Contains VALUES ('Dairy', 'Shiitake Mozza Omelette', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Shiitake Mozza Omelette', 'M004');
INSERT INTO Contains VALUES ('Dairy', 'Overnight Oats Tiramisu', 'M004');
INSERT INTO Contains VALUES ('Gluten', 'Overnight Oats Tiramisu', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Overnight Oats Tiramisu', 'M004');
INSERT INTO Contains VALUES ('Gluten', 'Oatmeal', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Oatmeal', 'M004');
INSERT INTO Contains VALUES ('Vegan', 'Oatmeal', 'M004');
INSERT INTO Contains VALUES ('Halal', 'Congee Chicken', 'M004');
INSERT INTO Contains VALUES ('Dairy', 'Vanilla Yogurt', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Vanilla Yogurt', 'M004');
INSERT INTO Contains VALUES ('Dairy', 'Strawberry Yogurt', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Strawberry Yogurt', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Plant Based Yogurt', 'M004');
INSERT INTO Contains VALUES ('Vegan', 'Plant Based Yogurt', 'M004');
INSERT INTO Contains VALUES ('Gluten', 'Granola', 'M004');
INSERT INTO Contains VALUES ('Nuts', 'Granola', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Granola', 'M004');
INSERT INTO Contains VALUES ('Vegan', 'Granola', 'M004');
INSERT INTO Contains VALUES ('Vegetarian', 'Caffè Latte', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Caffè Latte', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Caramel Macchiato', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Caramel Macchiato', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Americano', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Espresso', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Flat White', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Flat White', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Mocha', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Mocha', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'White Chocolate Mocha', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'White Chocolate Mocha', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Iced Coffee', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Cold Brew Coffee', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Vanilla Sweet Cream Cold Brew', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Vanilla Sweet Cream Cold Brew', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Nitro Cold Brew', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Nitro Cold Brew with Sweet Cream', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Nitro Cold Brew with Sweet Cream', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Pumpkin Cream Cold Brew', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Pumpkin Cream Cold Brew', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Frappuccino® Blended Beverage', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Frappuccino® Blended Beverage', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Caramel Frappuccino', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Caramel Frappuccino', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Mocha Frappuccino', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Mocha Frappuccino', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Java Chip Frappuccino', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Java Chip Frappuccino', 'M005');
INSERT INTO Contains VALUES ('Soy', 'Dragon Drink', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Dragon Drink', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Strawberry Açaí Refresher', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Mango Dragonfruit Refresher', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Pink Drink', 'M005');
INSERT INTO Contains VALUES ('Soy', 'Pink Drink', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Matcha Green Tea Latte', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Matcha Green Tea Latte', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Chai Tea Latte', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Chai Tea Latte', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Hot Chocolate', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Hot Chocolate', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'White Hot Chocolate', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'White Hot Chocolate', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Pumpkin Spice Latte', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Pumpkin Spice Latte', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Peppermint Mocha', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Peppermint Mocha', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Bacon, Gouda & Egg Sandwich', 'M005');
INSERT INTO Contains VALUES ('Egg', 'Bacon, Gouda & Egg Sandwich', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Bacon, Gouda & Egg Sandwich', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Sausage, Cheddar & Egg Sandwich', 'M005');
INSERT INTO Contains VALUES ('Egg', 'Sausage, Cheddar & Egg Sandwich', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Sausage, Cheddar & Egg Sandwich', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Impossible™ Breakfast Sandwich', 'M005');
INSERT INTO Contains VALUES ('Vegan', 'Impossible™ Breakfast Sandwich', 'M005');
INSERT INTO Contains VALUES ('Soy', 'Impossible™ Breakfast Sandwich', 'M005');
INSERT INTO Contains VALUES ('Egg', 'Impossible™ Breakfast Sandwich', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Avocado Spread', 'M005');
INSERT INTO Contains VALUES ('Vegan', 'Avocado Spread', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Egg Bites', 'M005');
INSERT INTO Contains VALUES ('Egg', 'Egg Bites', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Egg Bites', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Classic Oatmeal', 'M005');
INSERT INTO Contains VALUES ('Vegan', 'Classic Oatmeal', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Hearty Blueberry Oatmeal', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Butter Croissant', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Butter Croissant', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Butter Croissant', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Chocolate Croissant', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Chocolate Croissant', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Chocolate Croissant', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Blueberry Muffin', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Blueberry Muffin', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Banana Nut Loaf', 'M005');
INSERT INTO Contains VALUES ('Nuts', 'Banana Nut Loaf', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Banana Nut Loaf', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Pumpkin Loaf', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Pumpkin Loaf', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Tomato & Mozzarella on Focaccia', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Tomato & Mozzarella on Focaccia', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Tomato & Mozzarella on Focaccia', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Turkey & Pesto Panini', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Turkey & Pesto Panini', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Plain Bagel', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Plain Bagel', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Everything Bagel', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Everything Bagel', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Lemon Loaf', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Lemon Loaf', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Lemon Loaf', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Chocolate Chip Cookie', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Chocolate Chip Cookie', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Protein Box (Eggs & Cheese)', 'M005');
INSERT INTO Contains VALUES ('Egg', 'Protein Box (Eggs & Cheese)', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Protein Box (Eggs & Cheese)', 'M005');
INSERT INTO Contains VALUES ('Gluten', 'Protein Box (Eggs & Cheese)', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Greek Yogurt Parfait', 'M005');
INSERT INTO Contains VALUES ('Dairy', 'Greek Yogurt Parfait', 'M005');
INSERT INTO Contains VALUES ('Vegetarian', 'Granola Bar', 'M005');
INSERT INTO Contains VALUES ('Nuts', 'Granola Bar', 'M005');

-- CREATE TABLE Restriction_-_Dont_Need (
--     Restriction_Type - PK VARCHAR(30),
--     Diet VARCHAR(30),
--     Allergen VARCHAR(30)
-- );

-- INSERT INTO Restriction_-_Dont_Need VALUES ('Vegan', 'Vegetarian', 'nan');
-- INSERT INTO Restriction_-_Dont_Need VALUES ('Gluten-Free', 'No Gluten', 'Wheat');


INSERT INTO Stores VALUES ('HealthyChoice', 'jdoe', 'nan');
INSERT INTO Stores VALUES ('AllergyAware', 'esmith', 'Wheat');

