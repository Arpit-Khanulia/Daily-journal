// .env
require('dotenv').config();


const mongoose = require("mongoose");

// connecting to database server
exports.connectmongoose = ()=>{
    mongoose.connect("mongodb+srv://admin:"+process.env.DB_PASSWORD+"@cluster0.xgf8i8e.mongodb.net/dailyjournal",{useNewUrlParser:true}).then(e=> console.log('connected to database')).catch(e=>console.log(e));
}


// creating schema
const postschema = new mongoose.Schema({
    title:String,
    content:String
})

// creating collection of schema postschema
exports.postcollection =  mongoose.model("postcollection",postschema);



const userschema = new mongoose.Schema({
    username:String,
    password:String
})

// creating collection of schema userschema
exports.usercollection = mongoose.model("usercollection",userschema);



// new database *****************************************************

const newuserschema = new mongoose.Schema({
    username:String,
    password:String,
    posts:[
        {
        title:String,
        content:String,
        date:String,
        time:String
        }
    ]
})

exports.newusercollection = mongoose.model('newusercollection',newuserschema);

