const Listing = require("../models/listing.js");

module.exports.index = async (req, res, next) => {
  const lists = await Listing.find({});
  res.render("./listings/index.ejs", { lists });
};

module.exports.newForm = (req, res) => {
  res.render("./listings/form.ejs");
};

module.exports.createList = async (req, res) => {
  console.log(req.body.list);
  const newList = new Listing(req.body.list);
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
    res.render("./listings/edit.ejs", { list });
  }
};

module.exports.editList = async (req, res) => {
  let { id } = req.params;
  // console.log(id);
  // console.log(req.body);
  // console.log(req.body.list);
  await Listing.findByIdAndUpdate(id, { ...req.body.list }, { new: true });
  req.flash("success", "Listing edited Successfully !");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteList = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted Successfully !");
  res.redirect("/listing");
};
