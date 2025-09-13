const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");

const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    };
};


router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    // Wrap multer to catch upload errors
    (req, res, next) => {
      upload.single('listing[image]')(req, res, function(err) {
        if (err) {
          console.error("Cloudinary Upload Error:", err);
          req.flash("error", "Image upload failed. " + err.message);
          return res.redirect("/listings/new");
        }
        next(); // continue to controller
      });
    },
    wrapAsync(listingController.createListing)
  );




//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.renderEditForm));


module.exports=router;