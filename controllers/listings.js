const Listing=require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async (req,res)=>{
   const allListings=await Listing.find({});
   res.render("listings/index.ejs",{allListings});
   console.log("home");
};
module.exports.renderNewForm=(req,res)=>{
 res.render("listings/new.ejs");
  };

  module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{
      path:"author",
    },
  })
  .populate("owner");
    if(!listing){
         req.flash("error","Listing does not exist");
         res.redirect("/listings");
    }
    else{

    
   res.render("listings/show.ejs",{listing});
    }
};
module.exports.createListing=async (req,res,next)=>{

 let response=await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1,
})
  .send();

 let url= req.file.path;
 let filename=req.file.filename;

  const newListing=new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  newListing.geometry=response.body.features[0].geometry;
  await newListing.save();
  req.flash("success","New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
         req.flash("error","Listing does not exist");
         res.redirect("/listings");
    }
    else{
   res.render("listings/edit.ejs",{listing});
    }
};
module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;

  // Find the listing
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Update basic fields
  listing.set(req.body.listing);

  // Geocode the location to update geometry
  let geometry = null;
  try {
    const response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    }).send();

    if (response.body.features.length) {
      geometry = response.body.features[0].geometry;
    }
  } catch (err) {
    console.log("Geocoding error:", err);
  }

  // If geocoding failed, fallback to default (Kathmandu)
  listing.geometry = geometry || { type: "Point", coordinates: [85.3240, 27.7172] };

  // Update image if uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
      req.flash("success"," Listing Deleted!");
    res.redirect(`/listings`);
};