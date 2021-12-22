const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds =10
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50

    },
    email: {
        type:String,
        trim:true ,//스페이스바를 없애주는 역할을 한다.
        unique:1
    },
    password :{
        type:String,
        minlength:5
    },
    lastname : {
        type:String,
        maxlength:50
    },
    role: {
        type:Number,
        default:0
    },
    image: String,
    token : {
        type:String
    },
    tokenExp // 토큰의 유효기간
    :{
        type:Number
    }
})
const User = mongoose.model('User',userSchema)
module.exports = {User}