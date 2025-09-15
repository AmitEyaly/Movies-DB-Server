const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
    "filmName":{type:String, required: true},
    "premieredAt":{type:Number, required: true},
    "directedBy":{type:String, required: true},
    "lenght": {type:String, required: true},
    "filmImg": {type:String, required: true} 
}
);

const filmModel = new mongoose.model("Film" , filmSchema , "Films");

module.exports = filmModel;