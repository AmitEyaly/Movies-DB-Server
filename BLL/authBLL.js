const userModel = require('../models/UsersModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Registers a new user by encrypting the password and saving the user data to the database.
const register = async (obj)=>{
    let { password } = obj;
    let incryptPass = await bcrypt.hash(password + process.env.SECRET_KEY_PASSWORD, 12);
    obj.password = incryptPass;
    let user = new userModel(obj);
    await user.save()   
    return "User created successfully!";
}

// * Authenticates a user by comparing the provided username and password with the stored credentials.
// If authentication succeeds, a JWT token is generated and returned.
const login = async (obj)=>{
    let users = await userModel.find();
    let user = await users.find(user => user.userName === obj.userName);
    if (!user) {
        return "User not found. please make sure you're registered and try again";
    } else {
        let userHashed = await user.password;
        let validatePass = bcrypt.compare(obj.password+ process.env.SECRET_KEY_PASSWORD, userHashed);
        console.log(validatePass);
        if (validatePass == false) {
            return "Wrong Password, please try again";
        } else {
            console.log(process.env.SECRET_TOKEN_KEY);
            let token = jwt.sign({ ...user }, process.env.SECRET_TOKEN_KEY, {
                expiresIn: "24h"
            });
            return token;
        }
    }
}


module.exports = {
    register,
    login
}