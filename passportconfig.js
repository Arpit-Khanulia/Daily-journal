const localstrategy = require('passport-local');
const {newusercollection} = require('./database.js');
const md5 = require('md5');

exports.initializingpassport = (passport)=>{


    passport.use(new localstrategy(async(username,password,done)=>{

        try {

            const user = await newusercollection.findOne({username});

            if(!user) return done(null,false);
            if(user.password !== md5(password)) return done(null,false);
            return done(null,user);
            
        } catch (error) {

            return done(error,false);
            
        }

    }));


    passport.serializeUser((user,done)=>{

        done(null,user.id);
    });



    passport.deserializeUser(async(id,done)=>{
        try {
            const user = await newusercollection.findById(id);
            done(null,user);
            
        } catch (error) {
            done(error,false);
        }

    })





};

exports.isAuthenticated = (req,res,next)=>{

    if(req.user) return next();
    res.redirect("/login");
}