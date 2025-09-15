const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    "firstName":{type:String, required: true},
    "lastName":{type:String, required: true},
   "age":{type:Number, required: true},
    "adress":{type:String, required: true},
    "Email": {type:String, required: true},
    "userName": {type:String, required: true},
    "password": {type:String, required: true},
    "filmsPosted": {type:[String]}
}
);

const userModel = new mongoose.model("user" , userSchema , "users");

module.exports = userModel;