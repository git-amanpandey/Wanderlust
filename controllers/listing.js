const Listing = require("../models/listing.js");
const {cloudinary} = require('../cloudStorage');

module.exports.index = async (req, res, next) => {
  const lists = await Listing.find({});
  res.render("./listings/index.ejs", { lists });
};

module.exports.newForm = (req, res) => {
  res.render("./listings/form.ejs");
};

module.exports.createList = async (req, res) => {
  const newList = new Listing(req.body.list);
    let url = req.file.path;
    let filename = req.file.filename;
    newList.image = {url , filename};
    newList.owner = req.user._id;

    await newList.save();
    req.flash("success", "New Listing is Created");
    res.redirect("/listing");
};

module.exports.showList = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id)
    .populate("reviews")
    .populate({
      path: "reviews",
      populate: { path: "owner" },
    })
    .populate("owner");
  // console.log(list);
  if (!list) {
    req.flash("error", "Sorry ! Listing you wanted to access doesn't exists !");
    res.redirect("/listing");
  } else {
    // res.send("ok....!");
    // console.log(list.owner);
    res.render("./listings/show.ejs", { list });
  }
};

module.exports.editListForm = async (req, res) => {
  let { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Sorry ! Listing you wanted to Edit doesn't exists !");
    res.redirect("/listing");
  } else {
    let originalListUrl = list.image.url;
    newImageUrl= originalListUrl.replace("/upload","/upload/q_25,w_300,h_150,c_fill"); 
    res.render("./listings/edit.ejs", { list });
  }
};

module.exports.editList = async (req, res) => {
  let { id } = req.params;
  let newList = await Listing.findByIdAndUpdate(id, { ...req.body.list }, { new: true });
  if(typeof req.file !== 'undefined'){
   let url = req.file.path;
    let filename = req.file.filename;
    newList.image = {url , filename};
    await newList.save();
  }
  req.flash("success", "Listing edited Successfully !");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteList = async (req, res) => {
  let { id } = req.params;

  let list = await Listing.findById(id);
  // console.log(list);
  const publicIdToDelete = list.image.filename;
  cloudinary.uploader.destroy(publicIdToDelete)
    .then(result => {
        console.log("Image deletion result:", result);
    })
    .catch(error => {
        console.error("Error deleting image:", error);
    });

  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted Successfully !");
  res.redirect("/listing");
};
