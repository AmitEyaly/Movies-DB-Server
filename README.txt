Movie Database Server

This server provides RESTful APIs to manage a movie database. 
It allows users to view all films, search for films by ID, and perform CRUD (Create, Read, Update, Delete) 
operations on user's films after authentication.

Technologies Used
Node.js
Express.js
MongoDB
Mongoose
JSON Web Tokens (JWT)
Bcrypt


Endpoints

Authentication
POST /register: Register a new user.
POST /login: Log in an existing user.
Authentication is required for accessing the user's personal page.
After registering or logging in, the server will issue a JWT token with a session-cockie, which would be included in the
requests to authenticate the user.

Home Page
GET /Home: Retrieve a list of all films in the database.
GET /Home/:id: Retrieve details of a film by its ID.


User's Personal Page (Requires Authentication)
GET /myfilms/:id: Retrieve all films belonging to the authenticated user.
POST /myfilms/:id: Add a new film to the authenticated user's collection.
PUT /myfilms/:id: Update details of a film owned by the authenticated user.
DELETE /myfilms/:id: Delete a film from the authenticated user's collection by its ID.

Getting Started

To get started with the server, follow these steps:

1.Install dependencies:
npm, express, axios, mongoose, cors, jsonfile, bcrypt, jsonwebtoken, express-session.

2.Set up environment variables:
Add your own values to the following environment variables:
SECRET_KEY_PASSWORD
SECRET_TOKEN_KEY

3.Set up a new mongoose DB named FilmsProj. The DB should have the collection:
Films
users 

4.Start the server