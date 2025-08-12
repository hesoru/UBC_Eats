# UBC Eats

UBC Eats is a full-stack web application built with a **Node.js/Express backend**, **React frontend**, and **Oracle Database**. The app helps UBC students navigate all the different restaurants available on campus. It allows users to search for menu items across all restaurants on campus based on proximity, food allergens, dietary restrictions, cuisine type, and affordability.

### By Oreoluwa Akinwunmi, Helena Sokolovska, and Hediyeh Mahmoudian

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Oracle Database with OracleDB driver
- **Middleware**: CORS, dotenv for environment configuration
- **Architecture**: RESTful API with modular controller/service pattern

### Frontend
- **Framework**: React 18.3.1
- **UI Libraries**: Material-UI (MUI), Flowbite React
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Build Tool**: Create React App

### Database
- **DBMS**: Oracle Database
- **Connection**: OracleDB Node.js driver
- **Schema**: Comprehensive restaurant, menu, user, and review management system

## Features

### Restaurant Discovery
- **Search Restaurants**: Search for specific restaurants on campus
- **Location-Based Search**: Discover restaurants near your current location using GPS coordinates
- **Top-Rated by Cuisine**: Explore the highest-rated restaurants organized by cuisine type

### Menu & Dietary Management
- **Search Menu Items**: Search for menu items across all restaurants by name or description
- **Smart Menu Filtering**: Filter menu items across all restaurants based on dietary restrictions and allergen information
- **Dietary Restriction Support**: Find restaurants that accommodate various dietary needs (vegetarian, vegan, gluten-free, etc.)
- **Universal Diet Options**: Discover restaurants that serve options for all dietary restrictions

### User Profile & Personalization
- **User Registration**: Create personalized profiles with username, name, email, and location

### Review & Rating System
- **Write Reviews**: Share your dining experiences and rate restaurants
- **View User Reviews**: Read reviews from other UBC students to make informed dining decisions
- **Personal Review Management**: View, edit, and delete your own restaurant reviews

## Database Design
The application uses a normalized relational database schema supporting:
- Restaurant information with location data
- Comprehensive menu management with dietary restriction tracking
- User profile and preference management
- Review and rating system
- Allergen and dietary restriction categorization

## Development & Deployment
- **Local Development**: Uses environment variables for database configuration
- **Scripts**: Automated database setup and connection testing
- **CORS**: Configured for cross-origin requests between frontend and backend
- **Static Serving**: Express serves both API endpoints and static React build files
