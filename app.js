// .env
require('dotenv').config();

// express
const express = require("express");
const app = express();
// body parser
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended:true}));
// embedded js
app.set("view engine","ejs");
// connecting css in the folder public
app.use(express.static("public"));
// md5 hashing algorithm
const md5 = require("md5");

// passport *********************************************************

const expressSession = require('express-session');
const passport = require('passport');
const {initializingpassport,isAuthenticated} = require('./passportconfig.js');
initializingpassport(passport);

app.use(expressSession({secret:process.env.secret,resave:false,saveUninitialized:false}))
app.use(passport.initialize());
app.use(passport.session());


// database *********************************************************
const {connectmongoose,postcollection,usercollection,newusercollection}  = require('./database.js');
connectmongoose();


//date **************************************************************

option = {
    month:"string",
    year:"numeric",
    day:"numeric",
    weekday:"long"
}
let date = new Date().toDateString('en-us',option);

const options = { hour: 'numeric', minute: 'numeric' };
time  = new Date().toLocaleTimeString('en-US', options);




// GET routes *************************************************************

//home
app.get("/home",isAuthenticated,(req,res)=>{
    
    console.log(date);
    newusercollection.findById(req.user._id).then(result=>{

        let postdata = result.posts.reverse();

            res.render('home',{
                date:date,
                time:time,
                result:postdata
            })
        })

})

// newpage 
 app.get("/post/:temp",isAuthenticated,(req,res)=>{

    let route = req.params.temp.toLowerCase();
    newusercollection.findById(req.user._id).then(i=>{

        i.posts.forEach(j=>{
            if(j.title.toLowerCase() == route){
                res.render("newpage",{
                    date:date,
                    time:time,
                    j:j
                })

            }
        })


    })

 })


// compose  
app.get("/compose",isAuthenticated,(req,res)=>{
    res.render('compose');
})

 // about 

app.get("/about",isAuthenticated,function(req,res){

    res.render("about",{});
})


// contact
app.get("/contact",isAuthenticated,function(req,res){

    res.render("contact",{});
})



// Posts routes *****************************************************************

// deletepost 
 app.post('/delete',(req,res)=>{

    let titlename = (req.body.btn).trim();
    console.log("this is the id: "+ titlename);

    newusercollection.updateOne(
        { _id: req.user._id },
        { $pull: { posts: { _id: titlename } } }
      ).catch((err)=>console.log(err))

    
    res.redirect('/home')
})




app.post("/compose",(req,res)=>{

    time = new Date().toLocaleTimeString('en-US', options);
    const data = {
        date:date,
        time:time,
        title:req.body.title,
        content:req.body.content
    };

    newusercollection.findById(req.user._id).then(post=>{

        post.posts.push(data);
        post.save();

    }).catch(err=>console.log(err));

    res.redirect("/compose");

})


//authentication ****************************************************
app.get("/",(req,res)=>{
    res.render("auth",{});
})
app.get("/register",(req,res)=>{
    res.render("register",{});
})
app.get("/login",(req,res)=>{
    res.render("login",{});
})


app.post("/register",(req,res)=>{

    let un = req.body.username;
    let pass = md5(req.body.password);
    const user = new newusercollection({
        username:un,
        password:pass
    })

    newusercollection.find({username:un}).then(newuser=>{
        if(newuser.length >0){
            console.log("jada users he iss naam ke");
            return res.send('<script>alert("User already exists, try another username."); window.location="/register";</script>');
        }
        else{
            user.save();
            return res.send('<script>alert("User registered successfully"); window.location="/login";</script>');
        }

    })
})

// app.post("/login",passport.authenticate('local',{failureRedirect:'/login',successRedirect:'/home'}));

app.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        // Handle error
        return next(err);
      }
      if (!user) {
        // Display alert for wrong credentials
        return res.send('<script>alert("Wrong credentials"); window.location="/login";</script>');
      }
      req.logIn(user, (err) => {
        if (err) {
          // Handle error
          return next(err);
        }
        // Authentication successful, redirect to /home
        return res.redirect('/home');
      });
    })(req, res, next);
  });
  




app.get('/logout', function(req, res){
    req.logout(function(err){
      if(err){
        console.log(err);
      }
      res.redirect('/');
    });
  });
  


// listning *********************************************************
let port = 80;
app.listen(port,()=>{
    console.log("listning at port "+ port);
})
