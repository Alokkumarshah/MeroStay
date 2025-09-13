const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const e = require("connect-flash");
const passport=require("passport");
const {saveRedirectUrl}=require('../middleware.js');

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    };
};

const userController=require("../controllers/users.js");


router.route("/signup")
.get(userController.renderSignUpform)
.post(wrapAsync(userController.signup)
);

router.route("/login")
.get(userController.renderLoginform)
.post(saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),userController.login);


router.get("/logout",userController.logout)

module.exports=router;
