const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const { validateReview,isLoggedIn,isReviewAuthor } = require("../middleware.js");

const reviewController=require("../controllers/reviews.js");

function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    };
};




//reviews
//post route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));


//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;